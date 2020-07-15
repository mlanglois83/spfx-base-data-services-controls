import * as React from 'react';
import Webcam from "react-webcam";
import RecordRTC from 'recordrtc';

import useMobileDetect from 'use-mobile-detect-hook';
import { Icon, Dialog, css, PrimaryButton, DialogType, DefaultButton } from 'office-ui-fabric-react';
import styles from './MediaSelector.module.scss';

import { SPFile, UtilsService } from 'spfx-base-data-services';
import { cloneDeep, find, assign } from '@microsoft/sp-lodash-subset';
import { IContentUrl } from '../MediaSelector/interfaces/IMediaSelectorState';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import * as strings from 'ControlsStrings';


export interface ICameraClasses {
    tile?: string;
    addzone?: string;
    dialogContainer?: string;
    cameraRow?: string;
    cameraActionsRow?: string;
    cameraActions?: string;
    videoView?: string;
}

export enum CameraMode {
    Video,
    Picture
}

export enum CameraFacing {
    User,
    Environnement
}

export interface ICameraProps {
    onChanged?: (file: SPFile) => void;
    cssClasses?: ICameraClasses;
}


export const Camera = (props: ICameraProps) => {

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

    const addFileMobile = async (inputElement: HTMLInputElement) => {
        const file = inputElement.files[0];

        let newFile: (SPFile & IContentUrl) = assign(new SPFile(), { contentUrl: "" });
        newFile.name = file.name;
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


        let newFile: (SPFile & IContentUrl) = assign(new SPFile(), { contentUrl: "" });
        if (mode == CameraMode.Picture) {
            newFile.name = "Picture-" + formatDate(new Date()) + ".jpeg";
            newFile.mimeType = "image/jpeg";
        }
        if (mode == CameraMode.Video) {
            newFile.name = "Video-" + formatDate(new Date()) + ".webm";
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
                            console.log(data);
                            setVideoRecorder(null);
                        });
                    });
                }

            }
            if (mode == CameraMode.Picture) {
                const imageSrc = webcamRef.current.getScreenshot();
                addFile(imageSrc);
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

    const {cssClasses} = props;

    return (
        <React.Fragment>
            {!RTC &&
                <React.Fragment>
                    <div className={css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile: null)}>
                        <div className={css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone: null)} onClick={() => {
                            fileInput.click();
                        }}>
                        <input ref={(elt) => { fileInput = elt; }} type="file" accept=".doc,.docx,.csv,.xlsx,.xls,.ppt,.pptx,text/plain,.pdf" capture onChange={() => addFileMobile(this.fileInput)} />
                            <Icon iconName="Page" />
                        </div>
                    </div>

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
                    </div>
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
                    </div>
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
                            <div className={css(styles.videoView, cssClasses && cssClasses.videoView ? cssClasses.videoView: null)}>
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
                            <div className={css(styles.cameraActionsRow, cssClasses && cssClasses.cameraActionsRow ? cssClasses.cameraActionsRow: null)}>                                
                                <div className={css(styles.cameraActions, cssClasses && cssClasses.cameraActions ? cssClasses.cameraActions: null)}>
                                    {
                                        mode == CameraMode.Picture &&
                                        <PrimaryButton
                                            text={strings.takePicture}
                                            onClick={capture}
                                        />
                                    }
                                    {
                                        mode == CameraMode.Video &&
                                        <PrimaryButton
                                            text={!videoRecorder ? strings.startVideo : strings.stopVideo}
                                            onClick={capture}
                                        />
                                    }


                                    {
                                        devices.length > 1 && <React.Fragment>
                                            <PrimaryButton
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
                                            />

                                        </React.Fragment>
                                    }
                                    <DefaultButton onClick={() => { setRTC(false); }} >{strings.cancelButtonLabel}</DefaultButton>
                                </div>
                            </div>    
                        </div>

                    </React.Fragment>
                </Dialog>
            }

        </React.Fragment >
    );
};

