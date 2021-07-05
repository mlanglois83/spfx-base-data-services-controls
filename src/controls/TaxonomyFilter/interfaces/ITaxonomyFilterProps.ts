import { IDropdownProps } from '@fluentui/react';
import { TaxonomyTerm } from 'spfx-base-data-services';

export interface ITaxonomyFilterProps<T extends TaxonomyTerm> {
    dropdownProps?: Partial<IDropdownProps>;
    labels?: string[];
    terms: T[];
    selectedTerm?: T;
    placeholders?: string[];
    onFilterChanged?: (term: T) => void;
    disabled?: boolean;
    baseLevel?: number;
    classNames?: ITaxonomyFilterClassNames;
    overrideContainers?: ITaxonomyFilterContainers;
}
export interface ITaxonomyFilterClassNames {
    containerClassname?: string;
    dropdownClassName?: string;
    dropdownContainerClassName?: string;
}
export interface ITaxonomyFilterContainers {
    container?: string;
    dropdownContainer?: string;
}