import { TaxonomyTerm } from 'spfx-base-data-services';

export interface ITaxonomyFilterProps<T extends TaxonomyTerm> {
    terms: T[];
    selectedTerm?: T;
    placeholders?: string[];
    onFilterChanged?: (term: T) => void;
    disabled?: boolean;
    baseLevel?: number;
    classNames?: ITaxonomyFilterClassNames;
}
export interface ITaxonomyFilterClassNames {
    containerClassname?: string;
    dropdownClassName?: string;
    dropdownContainerClassName?: string;

}