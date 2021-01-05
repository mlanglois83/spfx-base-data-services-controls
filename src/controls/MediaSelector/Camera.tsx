import { assign } from '@microsoft/sp-lodash-subset';
import * as strings from 'ControlsStrings';
import { css, DefaultButton, Dialog, Icon, PrimaryButton } from 'office-ui-fabric-react';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import * as React from 'react';
import Webcam from "react-webcam";
import RecordRTC from 'recordrtc';
import { IBaseFile, UtilsService } from 'spfx-base-data-services';
import useMobileDetect from 'use-mobile-detect-hook';
import { IContentUrl } from '../MediaSelector/interfaces/IMediaSelectorState';
import { MediaType } from './interfaces/IMediaSelectorProps';
import styles from './MediaSelector.module.scss';




export interface ICameraClasses {
    tile?: string;
    addzone?: string;
    dialogContainer?: string;
    cameraRow?: string;
    cameraActionsRow?: string;
    cameraActions?: string;
    videoView?: string;
    cancelButton?: string;
    primaryButton?: string;
}
export interface IIcons {
    cancel?: string;
    picture?: string;
    startVideo?: string;
    stopVideo?: string;
    switchCamera?: string;
}

export enum CameraMode {
    Video,
    Picture
}

export enum CameraFacing {
    User,
    Environnement
}

export interface ICameraProps<T extends IBaseFile> {
    fileConstructor: new (data?: any) => T;
    onChanged?: (file: T) => void;
    cssClasses?: ICameraClasses;
    mediaTypes: MediaType;
    icons?: IIcons;
}


export const Camera = <T extends IBaseFile>(props: ICameraProps<T>) => {


    function rotateBase64Image(base64data, callback) { 
        const currentAngle = window.screen.orientation.angle;
        if(currentAngle === 0 || currentAngle % 360 === 0) {
            callback(base64data);
        }
        else {
            var image = new Image();
            image.src = base64data;
            image.onload = function() {
                const canvas = document.createElement("canvas");            
                if(currentAngle === 90 || currentAngle === -90 || currentAngle === 270){
                    canvas.width = image.height;
                    canvas.height = image.width;
                }
                else {                
                    canvas.width = image.width;
                    canvas.height = image.height;
                }
                document.body.append(canvas);
                const ctx = canvas.getContext("2d");
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(currentAngle * Math.PI / 180);
                ctx.drawImage(image, -image.width / 2, -image.width / 2);
                const url = canvas.toDataURL();
                document.body.removeChild(canvas);
                callback(url);
            };
        }     
    }

    const detectMobile = useMobileDetect();

    const [videoConstraints, setVideoCosntraints] = React.useState<any>({
        width: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth,
        height: (window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight),
        facingMode: "user"
    });

    const [mode, setMode] = React.useState<CameraMode>(CameraMode.Picture);

    const [camera, setCamera] = React.useState<CameraFacing>(CameraFacing.User);

    const [angle, setAngle]= React.useState<number>(window.screen.orientation.angle);

    const [RTC, setRTC] = React.useState<boolean>(false);
    const [videoRecorder, setVideoRecorder] = React.useState<any>(null);

    const [devices, setDevices] = React.useState([]);

    const webcamRef = React.useRef(null);

    const handleDevices = React.useCallback(
        mediaDevices =>
            setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );

    React.useEffect(
        () => {           
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );
    React.useEffect(
        () => {
            if(!detectMobile.isMobile()) {
                window.screen.orientation.addEventListener("change", handleOrientation,{passive: true});
                return () => {
                    window.screen.orientation.removeEventListener("change", handleOrientation);
                };
            }
            
        },
        [angle]
    );

    const handleOrientation = (e: Event) => {
        if(angle !== window.screen.orientation.angle) {
            setAngle(window.screen.orientation.angle);
        }
    };  

    const addFileMobile = async (inputElement: HTMLInputElement) => {
        const file = inputElement.files[0];

        let newFile: (T & IContentUrl) = assign(new props.fileConstructor(), { contentUrl: "" });
        newFile.title = file.name;
        newFile.mimeType = file.type;
        newFile.content = await UtilsService.blobToArrayBuffer(file);
        newFile.contentUrl = await UtilsService.getOfflineFileUrl(file);

        inputElement.value = null;

        props.onChanged(newFile);
    };


    function formatDate(date: Date) {
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    }

    const addFile = async (base64: string) => {


        let newFile: (T & IContentUrl) = assign(new props.fileConstructor(), { contentUrl: "" });
        if (mode == CameraMode.Picture) {
            newFile.title = "Picture-" + formatDate(new Date()) + ".jpeg";
            newFile.mimeType = "image/jpeg";
        }
        if (mode == CameraMode.Video) {
            newFile.title = "Video-" + formatDate(new Date()) + ".webm";
            newFile.mimeType = "video/webm";
        }

        newFile.content = convertDataURIToBinary(base64);
        newFile.contentUrl = base64;
        setRTC(false);
        props.onChanged(newFile);
    };

    const capture = React.useCallback(
        () => {
            if (mode == CameraMode.Video) {
                if (!videoRecorder) {
                    let temp = RecordRTC(webcamRef.current.stream, {
                        type: 'video',
                        video: {
                            width: 640,
                            height: 480
                        },
                        canvas: {
                            width: 640,
                            height: 480
                        }
                    });

                    temp.startRecording();
                    setVideoRecorder(temp);

                } else {
                    videoRecorder.stopRecording((url) => {

                        videoRecorder.getDataURL((data) => {
                            addFile(data);
                            setVideoRecorder(null);
                        });
                    });
                }

            }
            if (mode == CameraMode.Picture) {
                const imageSrc = webcamRef.current.getScreenshot();
                rotateBase64Image(imageSrc, (url) => {
                    addFile(url);
                });
                //addFile(imageSrc);
            }
        },
        [webcamRef, videoRecorder, mode]
    );

    var BASE64_MARKER = ';base64,';

    function convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
    let videoInput: HTMLInputElement;
    let photoInput: HTMLInputElement;
    let fileInput: HTMLInputElement;

    const {cssClasses, mediaTypes, icons} = props;

    return (
        <React.Fragment>
            {!RTC &&
                <React.Fragment>
                    {(mediaTypes & MediaType.File) === MediaType.File &&
                    <div className={css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile: null)}>
                        <div className={css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone: null)} onClick={() => {
                            fileInput.click();
                        }}>
                        <input ref={(elt) => { fileInput = elt; }} type="file" accept=".doc,.docx,.csv,.xlsx,.xls,.ppt,.pptx,text/plain,.pdf" capture onChange={() => addFileMobile(fileInput)} />
                            <Icon iconName="Page" />
                        </div>
                    </div>}

                    {(mediaTypes & MediaType.Photo) === MediaType.Photo &&
                    <div className={css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile: null)}>
                        <div className={css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone: null)} onClick={() => {
                            if (detectMobile.isMobile()) {
                                photoInput.click();
                            } else {
                                setRTC(true);
                                setMode(CameraMode.Picture);
                            }

                        }}>
                            <input ref={(elt) => { photoInput = elt; }} type="file" accept="image/*" capture onChange={() =>
                                //mobile call
                                addFileMobile(photoInput)}
                            />
                            <Icon iconName="Camera" />
                        </div>
                    </div>}
                    {(mediaTypes & MediaType.Video) === MediaType.Video &&
                    <div className={css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile: null)}>
                        <div className={css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone: null)} onClick={() => {
                            if (detectMobile.isMobile()) {
                                videoInput.click();
                            } else {
                                setRTC(true);
                                setMode(CameraMode.Video);
                            }
                        }}>
                            <input ref={(elt) => { videoInput = elt; }} type="file" accept="video/*" capture onChange={() =>
                                //mobile call
                                addFileMobile(videoInput)} />
                            <Icon iconName="Video" />
                        </div>
                    </div>}
                </React.Fragment>
            }
            {
                RTC &&

                <Dialog hidden={false}
                    onDismiss={() => { setRTC(false); }}         
                    modalProps={{
                        
                        isBlocking: false,
                        responsiveMode: ResponsiveMode.large,
                        containerClassName: css( styles.dialogOuter, cssClasses && cssClasses.dialogContainer ? cssClasses.dialogContainer: null)
                    }}>

                    <React.Fragment>
                        <div className={css(styles.cameraRow, cssClasses && cssClasses.cameraRow ? cssClasses.cameraRow: null)}>
                            <div className={css(styles.videoView, cssClasses && cssClasses.videoView ? cssClasses.videoView: null)} style={angle === 90 || angle === 270 ? {height: "80vh"}: undefined} >
                                <div style={angle !== 0 ? {transform: `rotate(${angle}deg)`, height: "100%", width: "100%", alignItems: "center", justifyContent: "center", display: "flex" } : undefined}>
                                    <Webcam
                                        audio={false}
                                        height={(window.innerHeight
                                            || document.documentElement.clientHeight
                                            || document.body.clientHeight) - 150}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        width={(window.innerWidth
                                            || document.documentElement.clientWidth
                                            || document.body.clientWidth) * 0.75}
                                        videoConstraints={videoConstraints}

                                        forceScreenshotSourceSize={false}
                                        imageSmoothing={true}
                                        mirrored={false}
    
                                        screenshotQuality={1}
                                        onUserMedia={() => { }}
                                        onUserMediaError={() => { }}

                                    />
                                </div>
                            </div>
                            <div className={css(styles.cameraActionsRow, cssClasses && cssClasses.cameraActionsRow ? cssClasses.cameraActionsRow: null)}>                                
                                <div className={css(styles.cameraActions, cssClasses && cssClasses.cameraActions ? cssClasses.cameraActions: null)}>
                                    <DefaultButton 
                                        className={cssClasses ? cssClasses.cancelButton : undefined} 
                                        onClick={() => { setRTC(false); }} 
                                        text={strings.cancelButtonLabel}
                                        iconProps={ icons && icons.cancel ? {iconName: icons.cancel} : undefined}
                                        />
                                    {
                                        mode == CameraMode.Picture &&
                                        <PrimaryButton
                                            className={cssClasses ? cssClasses.primaryButton : undefined}
                                            text={strings.takePicture}
                                            onClick={capture}
                                            iconProps={ icons && icons.picture ? {iconName: icons.picture} : undefined}
                                        />
                                    }
                                    {
                                        mode == CameraMode.Video &&
                                        <PrimaryButton
                                            className={cssClasses ? cssClasses.primaryButton : undefined}
                                            text={!videoRecorder ? strings.startVideo : strings.stopVideo}
                                            onClick={capture}
                                            iconProps={ !videoRecorder && icons && icons.startVideo ? {iconName: icons.startVideo} : (videoRecorder && icons && icons.stopVideo ? {iconName: icons.stopVideo} : undefined)}
                                        />
                                    }


                                    {
                                        devices.length > 1 && <React.Fragment>
                                            <PrimaryButton
                                                className={cssClasses ? cssClasses.primaryButton : undefined}
                                                text="Switch camera"
                                                onClick={() => {
                                                    if (camera == CameraFacing.Environnement) {
                                                        setCamera(CameraFacing.User);
                                                        setVideoCosntraints({
                                                            width: window.innerWidth
                                                                || document.documentElement.clientWidth
                                                                || document.body.clientWidth,
                                                            height: (window.innerHeight
                                                                || document.documentElement.clientHeight
                                                                || document.body.clientHeight),
                                                            facingMode: "user"
                                                        });

                                                    } else {
                                                        setCamera(CameraFacing.Environnement);
                                                        setVideoCosntraints({
                                                            width: window.innerWidth
                                                                || document.documentElement.clientWidth
                                                                || document.body.clientWidth,
                                                            height: (window.innerHeight
                                                                || document.documentElement.clientHeight
                                                                || document.body.clientHeight),
                                                            facingMode: { exact: "environment" }
                                                        });
                                                    }
                                                }}
                                                iconProps={ icons && icons.switchCamera ? {iconName: icons.switchCamera} : undefined}
                                            />

                                        </React.Fragment>
                                    }                                    
                                </div>
                            </div>    
                        </div>

                    </React.Fragment>
                </Dialog>
            }

        </React.Fragment >
    );
};

