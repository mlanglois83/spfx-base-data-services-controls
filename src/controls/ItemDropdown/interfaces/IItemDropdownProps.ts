import { IBaseItem } from 'spfx-base-data-services';

export interface IItemDropdownProps<T extends IBaseItem> {
    modelName: string;
    onFilterItems?: (allItems: Array<T>) => Array<T>;
    selectedItems?: T[] | T;
    onChanged?: (value?: T[] | T) => void;
    label?: string;
    placeholder?: string;
    defaultOption?: string;
    disabled?: boolean;
    multiSelect?: boolean;
    className?: string;
    required?: boolean;
    /**
     * Taxo only
     */
    showFullPath?: boolean;
    baseLevel?: number;
    showLevel?: number;
    showDeprecated?: boolean;
}