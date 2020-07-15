import { TaxonomyTerm } from 'spfx-base-data-services';

export interface ITaxonomyFilterState<T extends TaxonomyTerm> {
    selectedTerm: T;
    orderedTerms: T[][];
}