import * as React from 'react';
import { IHeaderBarProps } from "./interfaces/IHeaderBarProps";
import { IHeaderBarState } from "./interfaces/IHeaderBarState";
/**
 * Control to select disable state and associated dates of a risk
 */
export declare class HeaderBar extends React.Component<IHeaderBarProps, IHeaderBarState> {
    static setTitle(newTitle: string): void;
    /**
     * Construct RiskStateSelector control
     * @param props control properties (see IRiskStateSelectorProps)
     */
    constructor(props: IHeaderBarProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private setTitle;
    /**
     * Render control
     */
    render(): React.ReactElement<IHeaderBarProps>;
    private onToggleFullscreenClick;
    private isFullScreen;
    private onWindowResize;
    private onWindowKeypress;
    private adaptDomElements;
}
//# sourceMappingURL=HeaderBar.d.ts.map