import { TaxonomyTerm } from 'spfx-base-data-services';

export interface ITaxonomyPickerProps<T extends TaxonomyTerm> {
    showFullPath?: boolean;
    model?: (new (data?) => T) | string;
    /**
     * @deprecated use model
     */
    modelName?: string;

    onFilterItems?: (allItems: Array<T>) => Array<T>;
    selectedItems?: T[] | T | ((allItems: Array<T>) => (Array<T> | T));
    /**
     * @deprecated use selectedItems
     */
    selectedTerm?: T[] | T;
    onChanged?: (value?: T[] | T) => void;
    onGetErrorMessage?: (value?: T[] | T ) => string;
    required?: boolean;
    label?: string;
    panelTitle?: string;
    disabled?: boolean | ((allItems: Array<T>) => boolean);
    multiSelect?: boolean;
    baseLevel?: number;
    showDeprecated?: boolean;
    panelDisabled?: boolean;
    allOptionsOnFocus?: boolean;
    placeholder?: string;
    hideSuggestionsTitle?: boolean;
}