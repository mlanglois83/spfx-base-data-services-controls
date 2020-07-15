import { SPFile } from 'spfx-base-data-services';
export interface ICameraClasses {
    tile?: string;
    addzone?: string;
    dialogContainer?: string;
    cameraRow?: string;
    cameraActionsRow?: string;
    cameraActions?: string;
    videoView?: string;
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
}
export declare const Camera: (props: ICameraProps) => JSX.Element;
//# sourceMappingURL=Camera.d.ts.map