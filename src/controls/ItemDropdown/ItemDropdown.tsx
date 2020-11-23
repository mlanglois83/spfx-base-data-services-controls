
import * as React from 'react';
import { IItemDropdownProps } from './interfaces/IItemDropdownProps';
import { IItemDropdownState } from './interfaces/IItemDropdownState';
import { TagPicker, ITag, IconButton, Panel, PanelType, PrimaryButton, DefaultButton, Checkbox, css, Dropdown, IDropdownOption, ComboBox } from 'office-ui-fabric-react';
import { isArray, stringIsNullOrEmpty } from '@pnp/common';
import { find, cloneDeep, findIndex } from '@microsoft/sp-lodash-subset';
import { TaxonomyTerm, UtilsService, ServicesConfiguration, IBaseItem, BaseDataService } from 'spfx-base-data-services';

export class ItemDropdown<T extends IBaseItem, K extends keyof T> extends React.Component<IItemDropdownProps<T, K>, IItemDropdownState<T>> {
    constructor(props: IItemDropdownProps<T, K>) {
        super(props);
        this.state = {
            keyProperty: props.keyProperty?.toString() || "id",
            selectedItems: this.getSelected([], props.selectedItems),
            allItems: []
        };

    }


    public async componentDidMount() {
        let service = ServicesConfiguration.configuration.serviceFactory.create(this.props.model["name"]) as BaseDataService<T>;
        let items = await service.getAll();
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
    public componentWillReceiveProps(nextProps: IItemDropdownProps<T, K>) {
        if (JSON.stringify(nextProps.selectedItems) !== JSON.stringify(this.props.selectedItems)) {
            this.setState({ selectedItems: this.getSelected(this.state.allItems, nextProps.selectedItems) });
        }
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

    public render() {
        const {label, multiSelect, placeholder, disabled, defaultOption, className, required} = this.props;
        const {selectedItems, allItems, keyProperty} = this.state;        
        const displayControl: "Combobox" | "Dropdown" = this.props.displayControl || "Dropdown";
        const displayedItems = this.getDisplayedItems(allItems);
        const defaultOptionObj: T = new this.props.model();
        defaultOptionObj[keyProperty] = "";
        let selectedKeys;
        if(multiSelect) {
            if(selectedItems) {
                selectedKeys = isArray(selectedItems) ? (selectedItems as T[]).map(i => i[keyProperty].toString()) : [(selectedItems as T)[keyProperty].toString()]; 
            }
            else {
                selectedKeys = [];
            }
        }
        else {
            if(selectedItems) {
                (selectedItems as T)[keyProperty].toString();
            }
            else {
                selectedKeys = "";
            }
        }
        if(displayControl === "Dropdown") {
            return <Dropdown
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
            />;
        }
        else {
            return <ComboBox className={className}
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
                let tempSelection = this.state.selectedItems ? cloneDeep(this.state.selectedItems) as T[] : [];
                if (!option.selected) {
                    let idxToRemove = findIndex(this.state.selectedItems as T[], i => i[keyProperty].toString() === option.key);
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
                        )
            };
        }
        return result;
    }
}