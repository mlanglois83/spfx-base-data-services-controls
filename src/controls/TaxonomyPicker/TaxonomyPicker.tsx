
import { cloneDeep, find, findIndex } from '@microsoft/sp-lodash-subset';
import { stringIsNullOrEmpty } from '@pnp/common/util';
import * as strings from "ControlsStrings";
import { Checkbox, css, DefaultButton, IconButton, ITag, Panel, PanelType, PrimaryButton, TagPicker } from 'office-ui-fabric-react';
import * as React from 'react';
import { BaseDataService, ServiceFactory, TaxonomyTerm, UtilsService } from 'spfx-base-data-services';
import { ITaxonomyPickerProps } from './interfaces/ITaxonomyPickerProps';
import { ITaxonomyPickerState } from './interfaces/ITaxonomyPickerState';
import styles from './TaxonomyPicker.module.scss';

export class TaxonomyPicker<T extends TaxonomyTerm> extends React.Component<ITaxonomyPickerProps<T>, ITaxonomyPickerState<T>> {
    private get termTags(): ITag[] {
        return this.state.allTerms ? this.getDisplayedItems(this.state.allTerms).map((term) => {
            return this.BuildSingleITag(term);
        }) : [];
    }
    constructor(props: ITaxonomyPickerProps<T>) {
        super(props);
        this.state = {
            error: null,
            selectedTerm: props.selectedTerm ? props.selectedTerm: this.getSelected([], props.selectedItems),
            panelSelection: [],
            termQuery: "",
            displayPanel: false,
            allTerms: []
        };

    }

    private getSelected(allItems: T[], selectedItems: T | T[] | ((allitems: T[]) => T | T[])) {
        if(typeof(selectedItems) === "function") {
            const items = this.getDisplayedItems(allItems);
            return selectedItems(allItems);
        }
        else {
            return selectedItems;
        }
    }

    public getDisplayedItems(items: T[]): T[] {
        let result = cloneDeep(items || []);
        if(this.props.onFilterItems) {
            result = this.props.onFilterItems(items);
        }
        return result;
    }


    public async componentDidMount() {
        let modelName = this.props.modelName;
        if(this.props.model) {
            modelName = (typeof(this.props.model) === "string" ? this.props.model : this.props.model["name"]);
        }
        if(!stringIsNullOrEmpty(modelName)) {
            let service = ServiceFactory.getServiceByModelName(modelName) as BaseDataService<T>;
            let items = await service.getAll();
            if (!this.props.showDeprecated) {
                items = items.filter((t) => { return !(t as TaxonomyTerm).isDeprecated; });
            }
            let error = null;
            if (this.props.onGetErrorMessage) {
                error = this.props.onGetErrorMessage(this.state.selectedTerm);
            }
            this.setState({ allTerms: items, error: error, selectedTerm: this.props.selectedTerm ? this.props.selectedTerm: this.getSelected(items, this.props.selectedItems) });
        }
        else {
            console.warn("Please provide associated model for taxonomy picker");
        }
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: ITaxonomyPickerProps<T>) {
        if (JSON.stringify(nextProps.selectedTerm) !== JSON.stringify(this.props.selectedTerm) || JSON.stringify(nextProps.selectedItems) !== JSON.stringify(this.props.selectedItems)) {
            this.setState({ selectedTerm: nextProps.selectedTerm ? nextProps.selectedTerm : this.getSelected(this.state.allTerms, nextProps.selectedItems) });
        }
    }

    public render() {
        const displayedItems = this.getDisplayedItems(this.state.allTerms);
        const disabled = typeof(this.props.disabled) === "function" ? this.props.disabled(displayedItems) : this.props.disabled;
        return <div className={styles.taxonomyPicker}>
            {this.props.label &&
                <label className={this.props.required ? styles.required : ""}>{this.props.label}</label>
            }
            <div className={styles.pickerContainer}>
                <div className={css(styles.picker, this.props.panelDisabled ? styles.full : null , !stringIsNullOrEmpty(this.state.error) ? styles.invalid : null)}>
                    <TagPicker 
                        inputProps={{
                            placeholder: this.props.placeholder
                        }}
                        onEmptyResolveSuggestions= {(tagList: ITag[]) => {
                            return this.onFilterChanged("", tagList);
                        }}
                        disabled={disabled}
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
                            suggestionsHeaderText: this.props.hideSuggestionsTitle ? undefined : strings.TaxonomyPickerSuggestedTerms,
                            noResultsFoundText: strings.TaxonomyPickerNoTerm
                        }}
                        itemLimit={this.props.multiSelect ? undefined : 1}
                        onChange={this.onTermChanged}
                        onRenderSuggestionsItem={this.renderSuggestionTerm}
                    />
                </div>
                {!this.props.panelDisabled && <div className={styles.btn}>
                    <IconButton disabled={disabled} iconProps={{ iconName: "Tag" }} onClick={() => { this.setState({ displayPanel: true, panelSelection: this.state.selectedTerm }); }} />
                </div>}
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
                    {this.getDisplayedItems(this.state.allTerms).map((term) => {
                        let pathparts = term.path.split(";");
                        return <div className={styles.panelItem} style={{ marginLeft: ((pathparts.length - 1 - (this.props.baseLevel || 0)) * 30) + "px" }}>
                            <Checkbox checked={this.state.panelSelection ? Array.isArray(this.state.panelSelection) ? findIndex(this.state.panelSelection as T[], (i) => { return i.id == term.id; }) != -1 : (this.state.panelSelection as T).id == term.id : false} label={term.title} onChange={(evt, checked?) => { this.onCheckChange(checked === true, term); }} />
                        </div>;
                    })}
                </div>
            </Panel>}
        </div>;
    }
    private BuildSingleITag = (term: T): ITag => {
        let result: ITag = null;
        if (term) {
            result = { key: term.id, name: this.props.showFullPath ? UtilsService.getTermFullPathString(term, this.state.allTerms, this.props.baseLevel || 0) : term.title };
        }
        return result;
    }
    private BuildITag = (selectedTerm: T | T[]): ITag[] => {
        let result: ITag[] = [];
        if (selectedTerm) {
            if (Array.isArray(selectedTerm)) {
                selectedTerm.forEach(term => {
                    if (term) {
                        result.push(this.BuildSingleITag(term));
                    }
                });
            }
            else
                result.push(this.BuildSingleITag(selectedTerm));
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
            ? 
                this.termTags
                    .filter(tag => {
                        return tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1 &&
                            !this.listContainsTag(tag, tagList);
                    })
            : 
            (
                this.props.allOptionsOnFocus 
                ?
                this.termTags.filter(tag => {
                    return !this.listContainsTag(tag, tagList);
                })
                :
                []
            );
    }

    private listContainsTag(tag: ITag, tagList?: ITag[]): boolean {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
    }

}