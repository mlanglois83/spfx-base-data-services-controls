import { SPFile } from "spfx-base-data-services";
import { ICameraClasses, IIcons } from "../Camera";

export interface IMediaSelectorProps {  
    /**
     * Use sp.utility.stripInvalidFileFolderChars from @pnp/sp before set
     */  
    cacheKey?: string;
    files: Array<SPFile>;
    disabled?: boolean;
    editMode: boolean;
    title?: string;
    online: boolean;
    onFileAdded: (file: SPFile) => void;
    onBeforeFileRemove?: (file: SPFile) => Promise<boolean> | boolean;
    onFileRemoved: (file: SPFile) => void;
    cssClasses?: IMediaSelectorClassNames;
    mediaTypes?: MediaType;
    icons?: IIcons;
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