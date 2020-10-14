import { IBaseItem } from 'spfx-base-data-services';

export interface IItemDropdownState<T extends IBaseItem> {
    selectedItems?: T[] | T;
    allItems: T[];
}