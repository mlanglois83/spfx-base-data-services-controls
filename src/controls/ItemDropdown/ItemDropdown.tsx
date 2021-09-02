
import { ComboBox, Dropdown, IComboBoxProps, IDropdownOption, IDropdownProps } from '@fluentui/react';
import { cloneDeep, find, findIndex } from '@microsoft/sp-lodash-subset';
import { isArray, stringIsNullOrEmpty } from '@pnp/common/util';
import * as React from 'react';
import { BaseItem, ServiceFactory, TaxonomyTerm, UtilsService } from 'spfx-base-data-services';
import { IItemDropdownProps } from './interfaces/IItemDropdownProps';
import { IItemDropdownState } from './interfaces/IItemDropdownState';

export class ItemDropdown<T extends BaseItem, K extends keyof T> extends React.Component<IItemDropdownProps<T, K>, IItemDropdownState<T>> {
    constructor(props: IItemDropdownProps<T, K>) {
        super(props);
        this.state = {
            keyProperty: props.keyProperty?.toString() || "id",
            selectedItems: this.getSelected([], props.selectedItems),
            allItems: []
        };

    }


    public async componentDidMount(): Promise<void> {
        return this.loadItems();
    }

    private async loadItems() {
        const service = ServiceFactory.getService(this.props.model);
        let items: T[];
        if(this.props.getItemsQuery) {
            items = await service.get(this.props.getItemsQuery);
        }
        else {
            items = await service.getAll();
        }
        
        if (!this.props.showDeprecated) {
            items = items.filter((t) => { 
                return ((t instanceof TaxonomyTerm)  && !t.isDeprecated) || (!(t instanceof TaxonomyTerm)); 
            });
        }        
        this.setState({ allItems: items, selectedItems: this.getSelected(items, this.props.selectedItems) });
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: IItemDropdownProps<T, K>): void {        
        if(JSON.stringify(nextProps.getItemsQuery) !== JSON.stringify(this.props.getItemsQuery)) {
            this.loadItems();
        }
        else if (JSON.stringify(nextProps.selectedItems) !== JSON.stringify(this.props.selectedItems)) {
            this.setState({ selectedItems: this.getSelected(this.state.allItems, nextProps.selectedItems) });
        }
    }

    private getSelected(allItems: T[], selectedItems: T | T[] | ((allitems: T[]) => T | T[])) {
        if(typeof(selectedItems) === "function") {
            const items = this.getDisplayedItems(allItems);
            return selectedItems(items);
        }
        else {
            return selectedItems;
        }
    }

    public render(): React.ReactElement<IItemDropdownProps<T, K>> {
        const {label, multiSelect, placeholder, disabled, defaultOption, className, required} = this.props;
        const {selectedItems, allItems, keyProperty} = this.state;        
        const displayControl: "Combobox" | "Dropdown" = this.props.displayControl || "Dropdown";
        const displayedItems = this.getDisplayedItems(allItems);
        const defaultOptionObj: T = new this.props.model();
        defaultOptionObj[keyProperty] = "";
        const selected = typeof(this.props.selectedItems) === "function" ? this.props.selectedItems(displayedItems) :selectedItems;
        let selectedKeys;
        if(multiSelect) {
            if(selected) {
                selectedKeys = isArray(selected) ? (selected as T[]).map(i => i[keyProperty].toString()) : [(selected as T)[keyProperty].toString()]; 
            }
            else {
                selectedKeys = [];
            }
        }
        else {
            if(selected) {
                selectedKeys = (selected as T)[keyProperty].toString();
            }
            else {
                selectedKeys = "";
            }
        }
        if(displayControl === "Dropdown") {
            return <Dropdown
                {...(this.props.controlProps as Partial<IDropdownProps>)}
                className={className}
                label={label}
                required={required}
                multiSelect={multiSelect}
                disabled={typeof(disabled) === "function" ? disabled(displayedItems) : disabled}
                onChange={this.onChange}
                placeholder={placeholder}
                options={(!stringIsNullOrEmpty(defaultOption) ? [defaultOptionObj] : []).concat(displayedItems).map(item => this.getOption(item))}
                selectedKeys={multiSelect ? selectedKeys : undefined}
                selectedKey={!multiSelect ? selectedKeys : undefined}
                onRenderOption={this.props.onRenderOption}
                onRenderTitle={this.props.onRenderTitle}
            />;
        }
        else {
            return <ComboBox                 
                {...(this.props.controlProps as Partial<IComboBoxProps>)}
                className={className}
                openOnKeyboardFocus
                allowFreeform
                label={label}
                required={required}
                multiSelect={multiSelect}
                disabled={typeof(disabled) === "function" ? disabled(displayedItems) : disabled}
                onChange={this.onChange}
                placeholder={placeholder}
                options={(!stringIsNullOrEmpty(defaultOption) ? [defaultOptionObj] : []).concat(displayedItems).map(item => this.getOption(item))}
                selectedKey={selectedKeys}
                onRenderOption={this.props.onRenderOption}
            />;
        }
        
    }

    public getDisplayedItems(items: T[]): T[] {
        let result = cloneDeep(items || []);
        if(items && items.length > 0 && items[0] instanceof TaxonomyTerm) {
            if(this.props.showLevel !== undefined && this.props.showLevel !== null) {
                result = items.filter((term: T) => { return term instanceof TaxonomyTerm && !stringIsNullOrEmpty(term.path) && term.path.split(';').length === this.props.showLevel;});
            }
        }
        if(this.props.onFilterItems) {
            result = this.props.onFilterItems(items);
        }
        return result;
    }

    private onChange = (event, option?: IDropdownOption) => {
        const {keyProperty} = this.state;
        if(option) {
            //Test if multiselect then add item to selection or remove it if present (unchecked)
            if (!this.props.multiSelect) {
                this.setState({ selectedItems: find(this.state.allItems, i => i[keyProperty].toString() === option.key.toString()) }, () => {
                    this.props.onChanged(this.state.selectedItems);
                });
            }
            else {
                const tempSelection = this.state.selectedItems ? cloneDeep(this.state.selectedItems) as T[] : [];
                if (!option.selected) {
                    const idxToRemove = findIndex(this.state.selectedItems as T[], i => i[keyProperty].toString() === option.key);
                    if (idxToRemove > -1) {
                        tempSelection.splice(idxToRemove, 1);
                    }
                    this.setState({ selectedItems: tempSelection.length > 0 ? tempSelection : null }, () => {
                        this.props.onChanged(this.state.selectedItems);
                    });
                }
                else {
                    tempSelection.push(find(this.state.allItems, i => i[keyProperty].toString() === option.key.toString()));
                    this.setState({ selectedItems: tempSelection }, () => {
                        this.props.onChanged(this.state.selectedItems);
                    });
                }
            }
        }
        else if(!this.props.multiSelect) {
            this.setState({ selectedItems: null }, () => {
                this.props.onChanged(this.state.selectedItems);
            });
        }
    }

    private getOption = (item: T): IDropdownOption => {
        const {keyProperty} = this.state;
        let result: IDropdownOption;
        if (item) {
            result = { 
                key: item[keyProperty].toString(), 
                text: 
                    stringIsNullOrEmpty(item[keyProperty].toString()) && this.props.defaultOption ? 
                        this.props.defaultOption 
                        :
                        (
                            this.props.showFullPath && item instanceof(TaxonomyTerm) 
                            ? 
                            UtilsService.getTermFullPathString(item, this.state.allItems as unknown[] as TaxonomyTerm[], this.props.baseLevel || 0) 
                            : 
                            (this.props.onGetItemText ? this.props.onGetItemText(item) : item.title)                                
                        ),
                data: this.props.onGetItemData?.call(this, item) 
            };
        }
        return result;
    }
}