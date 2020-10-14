import { IBaseItem } from 'spfx-base-data-services';

export interface IItemDropdownProps<T extends IBaseItem> {
    modelName: string;
    selectedItems?: T[] | T;
    onChanged?: (value?: T[] | T) => void;
    label?: string;
    placeholder?: string;
    defaultOption?: string;
    disabled?: boolean;
    multiSelect?: boolean;
    className?: string;
    /**
     * Taxo only
     */
    showFullPath?: boolean;
    baseLevel?: number;
    showDeprecated?: boolean;
}