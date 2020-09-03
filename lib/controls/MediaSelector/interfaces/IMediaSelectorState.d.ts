import { SPFile } from 'spfx-base-data-services';
export interface IContentUrl {
    contentUrl?: string;
}
export interface IMediaSelectorState {
    files: (SPFile & IContentUrl)[];
    cachedUrls: string[];
    videoRecorder: any;
}
//# sourceMappingURL=IMediaSelectorState.d.ts.map