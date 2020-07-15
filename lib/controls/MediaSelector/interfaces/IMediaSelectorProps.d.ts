import { SPFile } from "spfx-base-data-services";
import { ICameraClasses } from "../Camera";
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
    onFileRemoved: (file: SPFile) => void;
    cssClasses?: IMediaSelectorClasses;
}
export interface IMediaSelectorClasses extends ICameraClasses {
    container?: string;
    media?: string;
    uploaded?: string;
    disabled?: string;
    preview?: string;
    filePreview?: string;
    tileActions?: string;
    noTiles?: string;
}
//# sourceMappingURL=IMediaSelectorProps.d.ts.map