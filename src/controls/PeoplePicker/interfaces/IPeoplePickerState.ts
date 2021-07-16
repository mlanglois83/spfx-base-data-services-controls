import { IPersonaProps } from "@fluentui/react";

export interface IPeoplePickerState {
    selectedItems: IPersonaProps[];
    error?: string;
}