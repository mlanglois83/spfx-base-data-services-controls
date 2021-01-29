import { IBaseFile } from "spfx-base-data-services";
import { ICameraClasses, IIcons } from "../Camera";

export interface IMediaSelectorProps<T extends IBaseFile> {  
    /**
     * Use sp.utility.stripInvalidFileFolderChars from @pnp/sp before set
     */  
    fileConstructor: new (data?: any) => T;
    cacheKey?: string;
    files: Array<T>;
    disabled?: boolean;
    editMode: boolean;
    title?: string;
    online: boolean;
    onFileAdded: (file: T) => void;
    onBeforeFileRemove?: (file: T) => Promise<boolean> | boolean;
    onFileRemoved: (file: T) => void;
    cssClasses?: IMediaSelectorClassNames;
    mediaTypes?: MediaType;
    icons?: IIcons;
    customFilesAccept?: string;
}
export interface IMediaSelectorClassNames extends ICameraClasses {
    container?: string;
    media?: string;
    uploaded?: string;
    disabled?: string;
    preview?: string;
    filePreview?: string;
    tileActions?: string;
    noTiles?: string;
}
export enum MediaType {
    None = 0,
    File = 1,
    Photo = 2,
    Video = 4,
    All = 7
}