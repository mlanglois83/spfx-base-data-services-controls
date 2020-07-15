import { IPersonaProps } from "office-ui-fabric-react";

export interface IPeoplePickerState {
    selectedItems: IPersonaProps[];
    error?: string;
}