import { IPeoplePickerProps } from "./interfaces/IPeoplePickerProps";
import { IPeoplePickerState } from "./interfaces/IPeoplePickerState";
import * as React from "react";
export declare class PeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {
    private userService;
    constructor(props: IPeoplePickerProps);
    componentDidUpdate(prevProps: IPeoplePickerProps): void;
    private suggestionProps;
    private removeDuplicates;
    private listContainsPersona;
    private onFilterPeopleChanged;
    render(): JSX.Element;
}
//# sourceMappingURL=PeoplePicker.d.ts.map