declare interface ISpfxBaseDataServicesControlsStrings {
    PropertyPaneDescription: string;
    BasicGroupName: string;
    DescriptionFieldLabel: string; 
    FullscreenLabel: string; 
    AbortFullScreenLabel: string; SynchronisationErrorFormat: string; SPFileLabel: string; AddLabel: string; UpdateLabel: string; DeleteLabel: string; 
    UploadLabel: string; 
    IndexedDBNotDefined: string; 
    NetworkUnavailable: string; 
    versionHigherErrorMessage: string;
}

declare module 'SpfxBaseDataServicesControlsStrings' {
    const strings: ISpfxBaseDataServicesControlsStrings;
    export = strings;
}