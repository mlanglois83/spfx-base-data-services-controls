import * as React from 'react';
import { ITaxonomyPickerProps } from './interfaces/ITaxonomyPickerProps';
import { ITaxonomyPickerState } from './interfaces/ITaxonomyPickerState';
import { TaxonomyTerm } from 'spfx-base-data-services';
export declare class TaxonomyPicker<T extends TaxonomyTerm> extends React.Component<ITaxonomyPickerProps<T>, ITaxonomyPickerState<T>> {
    private get termTags();
    constructor(props: ITaxonomyPickerProps<T>);
    private getOrderedChildTerms;
    componentDidMount(): Promise<void>;
    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    componentWillReceiveProps(nextProps: ITaxonomyPickerProps<T>): void;
    render(): JSX.Element;
    private BuildITag;
    private onCheckChange;
    /**
       * Display panel footer with action buttons
       */
    private onRenderPanelFooter;
    private validatePanelSelection;
    private renderSuggestionTerm;
    private onTermChanged;
    private getTextFromItem;
    private onFilterChanged;
    private listContainsTag;
}
//# sourceMappingURL=TaxonomyPicker.d.ts.map