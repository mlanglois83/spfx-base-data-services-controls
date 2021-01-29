import { assign, cloneDeep, find } from '@microsoft/sp-lodash-subset';
import { stringIsNullOrEmpty } from '@pnp/common';
import * as strings from 'ControlsStrings';
import { IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMediaSelectorProps, MediaType } from './interfaces/IMediaSelectorProps';
import { IContentUrl, IMediaSelectorState } from './interfaces/IMediaSelectorState';
import styles from './MediaSelector.module.scss';
import { IBaseFile, UtilsService } from 'spfx-base-data-services';

import { Camera } from './Camera';
import { css, Dialog, ResponsiveMode } from 'office-ui-fabric-react';

export class MediaSelector<T extends IBaseFile> extends React.Component<IMediaSelectorProps<T>, IMediaSelectorState<T>> { 


    public constructor(props: IMediaSelectorProps<T>) {
        super(props);
        this.state = {
            files: [],
            cachedUrls: [],
            videoRecorder: null,
            preview: null
        };
    }

    public async componentDidMount() {
        this.loadFilesFromProps();
    }

    public async componentDidUpdate(prevProps, prevState) {
        if (this.props.online !== prevProps.online && !this.props.online) {
            this.loadCachedUrls();
        }
        if (JSON.stringify(this.props.files) !== JSON.stringify(prevProps.files)) {
            this.loadFilesFromProps();
        }
    }

    private async loadFilesFromProps() {
        let filesCopy = cloneDeep(this.props.files);
        let stateFiles = await Promise.all(filesCopy.map(async (f) => {
            let file = assign(f, { contentUrl: undefined });
            if (file.content) {
                file.contentUrl = await UtilsService.getOfflineFileUrl(UtilsService.arrayBufferToBlob(file.content, file.mimeType));
            }
            return file;
        }));
        this.setState({ files: stateFiles });
    }

    private async loadCachedUrls() {
        let cached = [];
        await Promise.all(this.state.files.map(async (f) => {
            if(f.serverRelativeUrl) {
                let isInCache = false;
                if(!stringIsNullOrEmpty(this.props.cacheKey)) {
                    isInCache = await UtilsService.isUrlInCache(f.serverRelativeUrl, this.props.cacheKey);
                } 
                if (isInCache) {
                    cached.push(f.serverRelativeUrl);
                }
            }
        }));
        this.setState({ cachedUrls: cached });
    }

    public render() {
        const {preview, previewRatio} = this.state;
        const {cssClasses, mediaTypes, icons, customFilesAccept} = this.props;
        const attachments: JSX.Element = this.renderFiles();

        let previewUrl = "";
        if(preview){
            previewUrl = (
                (this.props.online && !preview.content) || (!this.props.online && find(this.state.cachedUrls, (c) => { return c === preview.serverRelativeUrl; }) && !preview.content)
                ?
                preview.serverRelativeUrl
                :
                preview.contentUrl
            );
        }

        return <div className={css(styles.attachmentsSelector, cssClasses && cssClasses.container ? cssClasses.container : null)}>
            {this.props.editMode &&
                <React.Fragment>

                    {!this.props.disabled && <Camera 
                        fileConstructor={this.props.fileConstructor}
                        onChanged={(newFile: T) => {
                            let filesCopy = cloneDeep(this.state.files);
                            let existing = find(filesCopy, (f) => { return f.title === newFile.title; });
                            if (existing) {
                                existing = newFile;
                            }
                            else {
                                filesCopy.push(newFile);
                            }

                            this.props.onFileAdded(newFile);

                        }}  
                        cssClasses={cssClasses} 
                        mediaTypes={mediaTypes || MediaType.All}
                        icons={icons}
                        customFilesAccept={customFilesAccept}
                    />}

                </React.Fragment>
            }
            {attachments}
            {preview &&                 
                <Dialog
                    hidden={false} 
                    onDismiss={() => { this.setState({preview:null}); }}         
                    modalProps={{                        
                        isBlocking: false,
                        responsiveMode: ResponsiveMode.large,
                        containerClassName: css( styles.dialogOuter, cssClasses && cssClasses.dialogContainer ? cssClasses.dialogContainer: null)
                    }}>
                        <React.Fragment>
                            <style dangerouslySetInnerHTML={{__html: `
                                .${styles.dialogOuter} {  
                                    max-width: min(100%, calc((100vh - 132px) * ${previewRatio || 0}) + 56px);
                                }
                            `}}/>
                            <div className={styles.previewContainer}>
                                {preview.mimeType.indexOf("image/") === 0 &&
                                    <img 
                                        src={previewUrl} 
                                        alt={preview.title} 
                                        style={{maxWidth: `min(100%, calc((100vh - 132px) * ${previewRatio || 0}))`}}
                                    />
                                }
                                {preview.mimeType.indexOf("video/") === 0 &&
                                    <video 
                                        controls
                                        style={{maxWidth: `min(100%, calc((100vh - 132px) * ${previewRatio || 0}))`}}
                                    >
                                        <source src={previewUrl}
                                            type={preview.mimeType} />
                                    </video>
                                }
                            </div>                            
                            <div className={styles.previewActions}>
                                <PrimaryButton text={strings.download} iconProps={{iconName: "Download"}} onClick={()=>{ this.downloadFile(preview); }}/>
                            </div>
                        </React.Fragment>
                    </Dialog>}
        </div>;
    }





    private renderFiles() {
        const {cssClasses} = this.props;
        let result = (this.state.files || []).filter((testfile) => {
            const isImage = testfile.mimeType.indexOf("image/") === 0;
            const isVideo = testfile.mimeType.indexOf("video/") === 0;
            const isFile = !isVideo && !isImage;

            return (isImage || isVideo || isFile) &&
                (
                    !stringIsNullOrEmpty(testfile.contentUrl) ||
                    this.props.online ||
                    (!this.props.online && find(this.state.cachedUrls, (c) => { return c == testfile.serverRelativeUrl; }))
                );
        }).map((file: T & IContentUrl, i: number) => {
            const url = (
                (this.props.online && !file.content) || (!this.props.online && find(this.state.cachedUrls, (c) => { return c === file.serverRelativeUrl; }) && !file.content)
                    ?
                    file.serverRelativeUrl
                    :
                    file.contentUrl
            );

            const isImage = file.mimeType.indexOf("image/") === 0;
            const isVideo = file.mimeType.indexOf("video/") === 0;
            const isFile = !isVideo && !isImage;
            return (
                <div className={css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile : null)}>
                    <div 
                        className={css(styles.media, cssClasses && cssClasses.media ? cssClasses.media : null,styles.uploaded, cssClasses && cssClasses.uploaded ? cssClasses.uploaded : null,(this.props.disabled ? styles.disabled : null), (this.props.disabled && cssClasses && cssClasses.disabled ? cssClasses.disabled : null))} 
                        onClick={() => { 
                            if (!this.props.disabled) { 
                                if(isFile) {
                                    if(file.serverRelativeUrl) { // open in new window
                                        window.open(file.serverRelativeUrl+"?web=1", '_blank'); 
                                    }
                                    else if(file.contentUrl) {
                                        this.downloadFile(file);
                                    }
                                }
                                else if(file.serverRelativeUrl || file.contentUrl) {
                                    if(isVideo) {
                                        const videoElt = document.createElement("video");
                                        videoElt.controls = true;
                                        videoElt.src = url;
                                        videoElt.style.visibility = "hidden";
                                        videoElt.onloadeddata = () => {
                                            const ratio = videoElt.clientWidth / videoElt.clientHeight;            
                                            document.body.removeChild(videoElt);
                                            this.setState({preview: file, previewRatio: ratio});
                                        };
                                        document.body.appendChild(videoElt);
                                    }
                                    else {
                                        const imgElt = document.createElement("img");
                                        imgElt.src = url;
                                        imgElt.style.visibility = "hidden";
                                        imgElt.onload = () => {
                                            const ratio = imgElt.clientWidth / imgElt.clientHeight;  
                                            document.body.removeChild(imgElt);
                                            this.setState({preview: file, previewRatio: ratio});
                                        };
                                        document.body.appendChild(imgElt);
                                    }
                                }                                
                            } 
                        }} >
                        <div className={css(styles.preview, cssClasses && cssClasses.preview ? cssClasses.preview : null)}>
                            {isFile &&
                                <div className={css(styles.filePreview, cssClasses && cssClasses.filePreview ? cssClasses.filePreview : null)}>
                                    <label>{file.title}</label>
                                </div>
                            }
                            {isImage &&
                                <img src={url} alt={file.title} />
                            }
                            {isVideo &&
                                <video controls>
                                    <source src={url}
                                        type={file.mimeType} />
                                </video>
                            }
                        </div>
                        {this.props.editMode && <div className={css(styles.actions, cssClasses && cssClasses.tileActions ? cssClasses.tileActions : null)}>
                            <IconButton disabled={this.props.disabled} iconProps={{ iconName: "StatusErrorFull" }} ariaLabel={strings.removeButtonLabel} onClick={async (e) => { 
                                e.stopPropagation(); 
                                let remove = true;
                                if(this.props.onBeforeFileRemove) {
                                    remove = await this.props.onBeforeFileRemove(this.state.files[i]);
                                }
                                if(remove) {
                                    this.onFileRemove(i); 
                                }
                                }} />
                        </div>}
                    </div>
                </div>);
        });
        return (result.length > 0 ? <React.Fragment>{result}</React.Fragment> : (!this.props.editMode ? <div className={css(styles.noTiles, cssClasses && cssClasses.noTiles ? cssClasses.noTiles : null)}>{strings.NoMediaMessage}</div> : null));
    }

    private downloadFile = (file: T & IContentUrl) => {
        const downloadLink = document.createElement("a");        
        downloadLink.href = file.contentUrl;
        downloadLink.download = file.title;
        downloadLink.click();
    }

    private onFileRemove = (idx: number) => {
        let file = cloneDeep(this.state.files[idx]);
        let filesCopy = cloneDeep(this.state.files);
        filesCopy.splice(idx, 1);
        this.setState({ files: filesCopy }, () => {
            this.props.onFileRemoved(file);
        });
    }


}
