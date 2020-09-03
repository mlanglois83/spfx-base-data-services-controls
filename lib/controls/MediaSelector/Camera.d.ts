import { SPFile } from 'spfx-base-data-services';
import { MediaType } from './interfaces/IMediaSelectorProps';
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
export declare enum CameraMode {
    Video = 0,
    Picture = 1
}
export declare enum CameraFacing {
    User = 0,
    Environnement = 1
}
export interface ICameraProps {
    onChanged?: (file: SPFile) => void;
    cssClasses?: ICameraClasses;
    mediaTypes: MediaType;
    icons?: IIcons;
}
export declare const Camera: (props: ICameraProps) => JSX.Element;
//# sourceMappingURL=Camera.d.ts.map