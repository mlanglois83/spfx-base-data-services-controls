import { IComboBoxProps, IDropdownProps } from '@fluentui/react';
import { IDropdownOption, IRenderFunction, ISelectableOption } from 'office-ui-fabric-react';
import { BaseItem, IQuery } from 'spfx-base-data-services';

export interface IItemDropdownProps<T extends BaseItem, K extends keyof T> {
    displayControl?: "Combobox" | "Dropdown";
    controlProps?: Pick<IDropdownProps, keyof IDropdownProps> | Pick<IComboBoxProps, keyof IComboBoxProps>;
    model: new (data?: any) => T;
    getItemsQuery?: IQuery<T>;
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
    onGetItemText?: (item: T) => string;
    onGetItemData?: (item: T) => any;
    onRenderOption?: IRenderFunction<ISelectableOption>;
    /**
     * Dropdown only
     */
    onRenderTitle?: IRenderFunction<IDropdownOption[]>;
    /**
     * Taxo only
     */
    showFullPath?: boolean;
    baseLevel?: number;
    showLevel?: number;
    showDeprecated?: boolean;
}