
import * as React from 'react';
import { ITaxonomyPickerProps } from './interfaces/ITaxonomyPickerProps';
import { ITaxonomyPickerState } from './interfaces/ITaxonomyPickerState';
import { TagPicker, ITag, IconButton, Panel, PanelType, PrimaryButton, DefaultButton, Checkbox, css } from 'office-ui-fabric-react';
import { stringIsNullOrEmpty } from '@pnp/common';
import { find, cloneDeep, findIndex } from '@microsoft/sp-lodash-subset';
import styles from './TaxonomyPicker.module.scss';
import * as strings from "ControlsStrings";
import { TaxonomyTerm, UtilsService, ServicesConfiguration } from 'spfx-base-data-services';

export class TaxonomyPicker<T extends TaxonomyTerm> extends React.Component<ITaxonomyPickerProps<T>, ITaxonomyPickerState<T>> {
    private get termTags(): ITag[] {
        return this.state.allTerms ? this.state.allTerms.map((term) => {
            return { key: term.id, name: this.props.showFullPath ? term.path.replace(/;/g, " > ") : term.title };
        }) : [];
    }
    constructor(props: ITaxonomyPickerProps<T>) {
        super(props);
        this.state = {
            error: null,
            selectedTerm: props.selectedTerm,
            panelSelection: [],
            termQuery: "",
            displayPanel: false,
            allTerms: []
        };

    }

    private getOrderedChildTerms(term: T, allTerms: Array<T>): Array<T> {
        // sort allready done by service on customsortorder
        let result = [];
        let childterms = allTerms.filter((t) => { return t.path.indexOf(term.path) == 0; });
        let level = term.path.split(";").length;
        let directChilds = childterms.filter((ct) => { return ct.path.split(";").length === level + 1; });
        directChilds.forEach((dc) => {
            result.push(dc);
            let dcchildren = this.getOrderedChildTerms(dc, childterms);
            if (dcchildren.length > 0) {
                result.push(...dcchildren);
            }
        });
        return result;
    }

    public async componentDidMount() {
        let service = ServicesConfiguration.configuration.serviceFactory.create(this.props.modelName);
        let items = await service.getAll();
        if (!this.props.showDeprecated) {
            items = items.filter((t) => { return !(t as TaxonomyTerm).isDeprecated; });
        }
        let error = null;
        if (this.props.onGetErrorMessage) {
            error = this.props.onGetErrorMessage(this.state.selectedTerm);
        }
        this.setState({ allTerms: items as T[], error: error });
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: ITaxonomyPickerProps<T>) {
        if (JSON.stringify(nextProps.selectedTerm) !== JSON.stringify(this.props.selectedTerm)) {
            this.setState({ selectedTerm: nextProps.selectedTerm });
        }
    }

    public render() {
        return <div className={styles.taxonomyPicker}>
            {this.props.label &&
                <label className={this.props.required ? styles.required : ""}>{this.props.label}</label>
            }
            <div className={styles.pickerContainer}>
                <div className={css(styles.picker, !stringIsNullOrEmpty(this.state.error) ? styles.invalid : null)}>
                    <TagPicker
                        disabled={this.props.disabled}
                        onDismiss={() => {
                            let error = null;
                            if (this.props.onGetErrorMessage) {
                                error = this.props.onGetErrorMessage(this.state.selectedTerm);
                            }
                            this.setState({ error: error });
                        }}
                        selectedItems={this.BuildITag(this.state.selectedTerm)}
                        onResolveSuggestions={this.onFilterChanged}
                        getTextFromItem={this.getTextFromItem}
                        pickerSuggestionsProps={{
                            suggestionsHeaderText: strings.TaxonomyPickerSuggestedTerms,
                            noResultsFoundText: strings.TaxonomyPickerNoTerm
                        }}
                        itemLimit={this.props.multiSelect ? undefined : 1}
                        onChange={this.onTermChanged}
                        onRenderSuggestionsItem={this.renderSuggestionTerm}
                    />
                </div>
                <div className={styles.btn}>
                    <IconButton disabled={this.props.disabled} iconProps={{ iconName: "Tag" }} onClick={() => { this.setState({ displayPanel: true, panelSelection: this.state.selectedTerm }); }} />
                </div>
            </div>
            {!stringIsNullOrEmpty(this.state.error) &&
                <div className={styles.errorMessage}>
                    {this.state.error}
                </div>
            }
            {this.state.displayPanel && <Panel
                headerText={this.props.panelTitle}
                type={PanelType.medium}
                isOpen={this.state.displayPanel}
                isLightDismiss={true}
                isFooterAtBottom={true}
                onDismiss={() => { this.setState({ displayPanel: false }); }}
                onRenderFooterContent={this.onRenderPanelFooter}
            >
                <div className={styles.panelContent}>
                    {this.state.allTerms.map((term) => {
                        let pathparts = term.path.split(";");
                        return <div className={styles.panelItem} style={{ marginLeft: ((pathparts.length - 1 - (this.props.baseLevel || 0)) * 30) + "px" }}>
                            <Checkbox checked={this.state.panelSelection ? Array.isArray(this.state.panelSelection) ? findIndex(this.state.panelSelection as T[], (i) => { return i.id == term.id; }) != -1 : (this.state.panelSelection as T).id == term.id : false} label={term.title} onChange={(evt, checked?) => { this.onCheckChange(checked === true, term); }} />
                        </div>;
                    })}
                </div>
            </Panel>}
        </div>;
    }

    private BuildITag = (selectedTerm: T | T[]): ITag[] => {
        let result: ITag[] = [];
        if (selectedTerm) {
            if (Array.isArray(selectedTerm)) {
                selectedTerm.forEach(term => {
                    if (term) {
                        result.push({ key: term.id, name: this.props.showFullPath ? UtilsService.getTermFullPathString(term, this.state.allTerms, this.props.baseLevel || 0) : term.title });
                    }
                });
            }
            else
                result.push({ key: selectedTerm.id, name: this.props.showFullPath ? UtilsService.getTermFullPathString(selectedTerm, this.state.allTerms, this.props.baseLevel || 0) : selectedTerm.title });
        }
        return result;
    }

    private onCheckChange = (checked, item) => {
        //Test if multiselect then add item to selection or remove it if present (unchecked)

        if (!this.props.multiSelect) {
            if (!checked) {
                this.setState({ panelSelection: null });
            }
            else {
                this.setState({ panelSelection: item });
            }
        }
        else {
            let tempSelection = this.state.panelSelection ? cloneDeep(this.state.panelSelection) as T[] : [];
            if (!checked) {
                let idxToRemove = findIndex(this.state.panelSelection as T[], (i) => { return i.id == item.id; });

                if (idxToRemove > -1)
                    tempSelection.splice(idxToRemove, 1);

                tempSelection.length > 0 ? this.setState({ panelSelection: tempSelection }) : this.setState({ panelSelection: null });
            }
            else {
                tempSelection.push(item);
                this.setState({ panelSelection: tempSelection });
            }
        }
    }

    /**
       * Display panel footer with action buttons
       */
    private onRenderPanelFooter = () => {
        const { panelSelection } = this.state;
        return (
            <div className={styles.panelActions}>
                <PrimaryButton className={styles.panelActionsButton} onClick={this.validatePanelSelection} >{strings.saveButtonLabel}</PrimaryButton>
                <DefaultButton className={styles.panelActionsButton} onClick={() => { this.setState({ displayPanel: false }); }} >{strings.cancelButtonLabel}</DefaultButton>
            </div>
        );
    }

    private validatePanelSelection = () => {
        let error = null;
        if (this.props.onGetErrorMessage) {
            error = this.props.onGetErrorMessage(this.state.panelSelection);
        }
        this.setState({ displayPanel: false, selectedTerm: this.state.panelSelection, error: error }, () => {
            if (this.props.onChanged) {
                this.props.onChanged(cloneDeep(this.state.selectedTerm));
            }
        });
    }
    private renderSuggestionTerm = (tag, itemProps) => {
        let term = find(this.state.allTerms, (t) => { return t.id === tag.key; });
        let pathparts = term.path.split(";");
        if (this.props.baseLevel) {
            for (let index = 0; index < this.props.baseLevel; index++) {
                pathparts.shift();
            }
        }
        let parentPath = (pathparts.length > 1 ? pathparts.slice(0, pathparts.length - 1).join(" > ") : "");
        return <div className={styles.suggestionItem}>
            <div className={styles.termLabel}>
                {term.title}
            </div>
            {!stringIsNullOrEmpty(parentPath) && <div className={styles.termLocation}>
                {strings.TaxonomyPickerTermLocationPrefix + parentPath}
            </div>
            }
        </div>;
    }

    private onTermChanged = (terms?: ITag[]) => {
        let error = null;
        let result: T[] | T = [];
        if (terms && terms.length > 0) {
            if (!this.props.multiSelect)
                result = find(this.state.allTerms, (t) => { return t.id === terms[0].key; });
            else
                terms.forEach(term => (result as T[]).push(find(this.state.allTerms, (t) => { return t.id === term.key; })));
        }
        if (this.props.onGetErrorMessage) {
            error = this.props.onGetErrorMessage(result);
        }
        this.setState({ selectedTerm: result, error: error }, () => {
            if (this.props.onChanged) {
                this.props.onChanged(cloneDeep(result));
            }
        });
    }

    private getTextFromItem(item: ITag): string {
        return item.name;
    }

    private onFilterChanged = (filterText: string, tagList: ITag[]): ITag[] => {
        return filterText
            ? this.termTags
                .filter(tag => {
                    return tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1 &&
                        !this.listContainsTag(tag, tagList);
                })
            : [];
    }

    private listContainsTag(tag: ITag, tagList?: ITag[]): boolean {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
    }

}