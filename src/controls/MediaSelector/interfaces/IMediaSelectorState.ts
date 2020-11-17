import { IBaseFile } from 'spfx-base-data-services';

export interface IContentUrl {
    contentUrl?: string;
}
export interface IMediaSelectorState<T extends IBaseFile> {
    files: (T & IContentUrl)[];
    preview: (T & IContentUrl);
    previewRatio?: number;
    cachedUrls: string[];
    videoRecorder: any;
}

