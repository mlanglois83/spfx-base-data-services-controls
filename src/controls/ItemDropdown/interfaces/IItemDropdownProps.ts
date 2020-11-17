import { IBaseItem } from 'spfx-base-data-services';

export interface IItemDropdownProps<T extends IBaseItem, K extends keyof T> {
    model: new() => T;
    onFilterItems?: (allItems: Array<T>) => Array<T>;
    selectedItems?: T[] | T | ((allItems: Array<T>) => (Array<T> | T));
    onChanged?: (value?: T[] | T) => void;
    label?: string;
    placeholder?: string;
    defaultOption?: string;
    disabled?: boolean | ((allItems: Array<T>) => boolean);
    multiSelect?: boolean;
    className?: string;
    required?: boolean;
    keyProperty?: K;
    /**
     * Taxo only
     */
    showFullPath?: boolean;
    baseLevel?: number;
    showLevel?: number;
    showDeprecated?: boolean;
}