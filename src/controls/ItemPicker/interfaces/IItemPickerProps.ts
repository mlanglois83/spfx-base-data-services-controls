import { BaseItem, IQuery } from 'spfx-base-data-services';

export interface IItemPickerProps<T extends BaseItem, K extends keyof T> {
    showFullPath?: boolean;
    model: (new (data?) => T) | string;
    getItemsQuery?: IQuery<T>;
    onFilterItems?: (allItems: Array<T>) => Array<T>;
    selectedItems?: T[] | T | ((allItems: Array<T>) => (Array<T> | T));
    onChanged?: (value?: T[] | T) => void;
    onGetErrorMessage?: (value?: T[] | T ) => string;
    required?: boolean;
    label?: string;
    panelTitle?: string;
    disabled?: boolean | ((allItems: Array<T>) => boolean);
    multiSelect?: boolean;
    baseLevel?: number;
    showDeprecated?: boolean;
    allOptionsOnFocus?: boolean;
    placeholder?: string;
    hideSuggestionsTitle?: boolean;
    className?: string;
    keyProperty?: K;
    onGetItemText?: (item: T) => string;
}