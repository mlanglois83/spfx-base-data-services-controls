import { IBaseItem, TaxonomyTerm } from 'spfx-base-data-services';

export interface IItemPickerState<T extends IBaseItem> {
    keyProperty: string;
    selectedItems?: T[] | T;
    query: string;
    error: string;
    allItems: T[];
}