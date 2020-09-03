import * as React from 'react';
import { ISynchroNotificationsProps } from "./interfaces/ISynchroNotificationsProps";
import { ISynchroNotificationsState } from "./interfaces/ISynchroNotificationsState";
/**
 * Control to select disable state and associated dates of a risk
 */
export declare class SynchroNotifications extends React.Component<ISynchroNotificationsProps, ISynchroNotificationsState> {
    private calloutButtonElement;
    private columns;
    /**
     * Construct RiskStateSelector control
     * @param props control properties (see IRiskStateSelectorProps)
     */
    constructor(props: ISynchroNotificationsProps);
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: any): void;
    /**
     * Render control
     */
    render(): React.ReactElement<ISynchroNotificationsProps>;
    private onRenderRow;
    private renderErrors;
    /**
     * close callout
     */
    private onCalloutDismiss;
}
//# sourceMappingURL=SynchroNotifications.d.ts.map