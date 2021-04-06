import { BaseItem } from 'spfx-base-data-services';

export interface IItemPickerState<T extends BaseItem> {
    keyProperty: string;
    selectedItems?: T[] | T;
    query: string;
    error: string;
    allItems: T[];
}