import * as React from 'react';
import { IMediaSelectorProps } from './interfaces/IMediaSelectorProps';
import { IMediaSelectorState } from './interfaces/IMediaSelectorState';
export declare class MediaSelector extends React.Component<IMediaSelectorProps, IMediaSelectorState> {
    constructor(props: IMediaSelectorProps);
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: any, prevState: any): Promise<void>;
    private loadFilesFromProps;
    private loadCachedUrls;
    render(): JSX.Element;
    private renderFiles;
    private onFileRemove;
}
//# sourceMappingURL=MediaSelector.d.ts.map