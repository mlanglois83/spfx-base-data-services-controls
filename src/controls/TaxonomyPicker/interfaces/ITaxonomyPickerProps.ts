import { TaxonomyTerm } from 'spfx-base-data-services';

export interface ITaxonomyPickerProps<T extends TaxonomyTerm> {
    showFullPath?: boolean;
    modelName: string;
    selectedTerm?: T[] | T;
    onChanged?: (value?: T[] | T) => void;
    onGetErrorMessage?: (value?: T[] | T ) => string;
    required?: boolean;
    label?: string;
    panelTitle?: string;
    disabled?: boolean;
    multiSelect?: boolean;
    baseLevel?: number;
    showDeprecated?: boolean;

}