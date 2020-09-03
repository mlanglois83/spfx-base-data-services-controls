import { TaxonomyTerm } from 'spfx-base-data-services';
export interface ITaxonomyPickerState<T extends TaxonomyTerm> {
    selectedTerm?: T[] | T;
    termQuery: string;
    error: string;
    displayPanel: boolean;
    allTerms: T[];
    panelSelection: T[] | T;
}
//# sourceMappingURL=ITaxonomyPickerState.d.ts.map