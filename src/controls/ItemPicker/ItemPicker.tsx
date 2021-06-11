
import { cloneDeep, find } from '@microsoft/sp-lodash-subset';
import { stringIsNullOrEmpty } from '@pnp/common';
import * as strings from "ControlsStrings";
import { css, ITag, TagPicker } from 'office-ui-fabric-react';
import * as React from 'react';
import { BaseDataService, BaseItem, ServiceFactory, TaxonomyTerm, UtilsService } from 'spfx-base-data-services';
import { IItemPickerProps } from './interfaces/IItemPickerProps';
import { IItemPickerState } from './interfaces/IItemPickerState';
import styles from './ItemPicker.module.scss';

export class ItemPicker<T extends BaseItem, K extends keyof T> extends React.Component<IItemPickerProps<T, K>, IItemPickerState<T>> {
    private get termTags(): ITag[] {
        return this.state.allItems ? this.getDisplayedItems(this.state.allItems).map((item) => {
            return this.BuildSingleITag(item);
        }) : [];
    }
    constructor(props: IItemPickerProps<T, K>) {
        super(props);
        this.state = {
            keyProperty: props.keyProperty?.toString() || "id",
            error: null,
            selectedItems: this.getSelected([], props.selectedItems),
            query: "",
            allItems: []
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
        let modelName = (typeof(this.props.model) === "string" ? this.props.model : this.props.model["name"]);
        if(!stringIsNullOrEmpty(modelName)) {
            let service = ServiceFactory.getServiceByModelName(modelName) as BaseDataService<T>;
            let items = await service.getAll();
            if (!this.props.showDeprecated) {
                items = items.filter((t) => { 
                    return ((t instanceof TaxonomyTerm)  && !t.isDeprecated) || (!(t instanceof TaxonomyTerm)); 
                });
            }
            let error = null;
            if (this.props.onGetErrorMessage) {
                error = this.props.onGetErrorMessage(this.state.selectedItems);
            }
            this.setState({ allItems: items, error: error, selectedItems: this.getSelected(items, this.props.selectedItems) });
        }
        else {
            console.warn("Please provide associated model for tag picker");
        }
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: IItemPickerProps<T, K>) {
        if (JSON.stringify(nextProps.selectedItems) !== JSON.stringify(this.props.selectedItems)) {
            this.setState({ selectedItems: this.getSelected(this.state.allItems, nextProps.selectedItems) });
        }
    }

    public render() {
        const displayedItems = this.getDisplayedItems(this.state.allItems);
        const disabled = typeof(this.props.disabled) === "function" ? this.props.disabled(displayedItems) : this.props.disabled;
        return <div className={css(styles.itemPicker, this.props.className)}>
            {this.props.label &&
                <label className={this.props.required ? styles.required : ""}>{this.props.label}</label>
            }
            <div className={styles.pickerContainer}>
                <div className={css(styles.picker, styles.full, !stringIsNullOrEmpty(this.state.error) ? styles.invalid : null)}>
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
                                error = this.props.onGetErrorMessage(this.state.selectedItems);
                            }
                            this.setState({ error: error });
                        }}
                        selectedItems={this.BuildITag(this.state.selectedItems)}
                        onResolveSuggestions={this.onFilterChanged}
                        getTextFromItem={this.getTextFromItem}
                        pickerSuggestionsProps={{
                            suggestionsHeaderText: this.props.hideSuggestionsTitle ? undefined : strings.ItemPickerSuggestedTerms,
                            noResultsFoundText: strings.ItemPickerNoTerm
                        }}
                        itemLimit={this.props.multiSelect ? undefined : 1}
                        onChange={this.onTermChanged}
                        onRenderSuggestionsItem={this.renderSuggestionTerm}
                    />
                </div>
            </div>
            {!stringIsNullOrEmpty(this.state.error) &&
                <div className={styles.errorMessage}>
                    {this.state.error}
                </div>
            }
        </div>;
    }
    private BuildSingleITag = (item: T): ITag => {
        let result: ITag = null;
        if (item) {
            result = { 
                key: item[this.state.keyProperty].toString(), 
                name: this.props.showFullPath && item instanceof(TaxonomyTerm) 
                ? 
                UtilsService.getTermFullPathString(item, this.state.allItems as unknown[] as TaxonomyTerm[], this.props.baseLevel || 0) 
                : 
                (this.props.onGetItemText ? this.props.onGetItemText(item) : item.title)
            };
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

    private renderSuggestionTerm = (tag: ITag, itemProps) => {
        let item = find(this.state.allItems, (i) => { return i[this.state.keyProperty].toString() === tag.key.toString(); });
        let title = this.props.onGetItemText ? this.props.onGetItemText(item) : item.title;
        let parentPath = "";
        if(item instanceof TaxonomyTerm) {
            let parent = find(this.state.allItems as unknown[] as TaxonomyTerm[], (t) => { return t instanceof TaxonomyTerm && t.isParentOf(item as unknown as TaxonomyTerm); });          
            if(parent) {
                parentPath = UtilsService.getTermFullPathString(parent, this.state.allItems as unknown[] as TaxonomyTerm[], this.props.baseLevel || 0);
            }
        }

        
        return <div className={styles.suggestionItem}>
            <div className={styles.termLabel}>
                {title}
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
                result = find(this.state.allItems, (t) => { return t[this.state.keyProperty].toString() === terms[0].key.toString(); });
            else
                terms.forEach(term => (result as T[]).push(find(this.state.allItems, (t) => { return t[this.state.keyProperty].toString() === term.key.toString(); })));
        }
        if (this.props.onGetErrorMessage) {
            error = this.props.onGetErrorMessage(result);
        }
        this.setState({ selectedItems: result, error: error }, () => {
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