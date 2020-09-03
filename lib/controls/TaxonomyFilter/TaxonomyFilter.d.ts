import * as React from 'react';
import { ITaxonomyFilterProps } from './interfaces/ITaxonomyFilterProps';
import { ITaxonomyFilterState } from './interfaces/ITaxonomyFilterState';
import { TaxonomyTerm } from 'spfx-base-data-services';
export declare class TaxonomyFilter<T extends TaxonomyTerm> extends React.Component<ITaxonomyFilterProps<T>, ITaxonomyFilterState<T>> {
    constructor(props: ITaxonomyFilterProps<T>);
    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    componentWillReceiveProps(nextProps: ITaxonomyFilterProps<T>): void;
    render(): JSX.Element;
    private onFilterChanged;
    private getOptions;
    private getLevelBasePath;
    private getOrderedTerms;
}
//# sourceMappingURL=TaxonomyFilter.d.ts.map