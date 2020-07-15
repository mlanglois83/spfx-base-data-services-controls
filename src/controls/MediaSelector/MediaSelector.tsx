import { assign, cloneDeep, find } from '@microsoft/sp-lodash-subset';
import { stringIsNullOrEmpty } from '@pnp/common';
import * as strings from 'ControlsStrings';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMediaSelectorProps } from './interfaces/IMediaSelectorProps';
import { IContentUrl, IMediaSelectorState } from './interfaces/IMediaSelectorState';
import styles from './MediaSelector.module.scss';
import { SPFile, UtilsService } from 'spfx-base-data-services';

import { Camera } from './Camera';
import { css } from 'office-ui-fabric-react';

export class MediaSelector extends React.Component<IMediaSelectorProps, IMediaSelectorState> { 


    public constructor(props: IMediaSelectorProps) {
        super(props);
        this.state = {
            files: [],
            cachedUrls: [],
            videoRecorder: null
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
            let isInCache = false;
            if(!stringIsNullOrEmpty(this.props.cacheKey)) {
                isInCache = await UtilsService.isUrlInCache(f.serverRelativeUrl, this.props.cacheKey);
            } 
            if (isInCache) {
                cached.push(f.serverRelativeUrl);
            }
        }));
        this.setState({ cachedUrls: cached });
    }

    public render() {
        const {cssClasses} = this.props;
        const attachments: JSX.Element = this.renderFiles();

        return <div className={css(styles.attachmentsSelector, cssClasses && cssClasses.container ? cssClasses.container : null)}>
            {this.props.editMode &&
                <React.Fragment>

                    {!this.props.disabled && <Camera onChanged={(newFile: SPFile) => {
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
                    cssClasses={cssClasses}></Camera>}

                </React.Fragment>
            }
            {attachments}
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
        }).map((file: SPFile & IContentUrl, i: number) => {
            const url = (
                (this.props.online && !file.content) || (!this.props.online && find(this.state.cachedUrls, (c) => { return c == file.serverRelativeUrl; }) && !file.content)
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
                    <div className={css(styles.media, cssClasses && cssClasses.media ? cssClasses.media : null,styles.uploaded, cssClasses && cssClasses.uploaded ? cssClasses.uploaded : null,(this.props.disabled ? styles.disabled : null), (this.props.disabled && cssClasses && cssClasses.disabled ? cssClasses.disabled : null))} onClick={() => { if (file.serverRelativeUrl && !this.props.disabled) { window.open(file.serverRelativeUrl+"?web=1", '_blank'); } }} >
                        <div className={css(styles.preview, cssClasses && cssClasses.preview ? cssClasses.preview : null)}>
                            {isFile &&
                                <div className={css(styles.filePreview, cssClasses && cssClasses.filePreview ? cssClasses.filePreview : null)}>
                                    {/* <a href={url} target="_blank"> </a> */}
                                    <label>{file.name}</label>
                                </div>
                            }
                            {isImage &&
                                <img src={url} alt={file.name} />
                            }
                            {isVideo &&
                                <video controls>
                                    <source src={url}
                                        type={file.mimeType} />
                                </video>
                            }
                        </div>
                        {this.props.editMode && <div className={css(styles.actions, cssClasses && cssClasses.tileActions ? cssClasses.tileActions : null)}>
                            <IconButton disabled={this.props.disabled} iconProps={{ iconName: "StatusErrorFull" }} ariaLabel={strings.removeButtonLabel} onClick={(e) => { e.stopPropagation(); this.onFileRemove(i); }} />
                        </div>}
                    </div>
                </div>);
        });
        return (result.length > 0 ? <React.Fragment>{result}</React.Fragment> : (!this.props.editMode ? <div className={css(styles.noTiles, cssClasses && cssClasses.noTiles ? cssClasses.noTiles : null)}>{strings.NoMediaMessage}</div> : null));
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
