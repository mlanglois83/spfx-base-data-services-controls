
import * as React from 'react';
import { IItemDropdownProps } from './interfaces/IItemDropdownProps';
import { IItemDropdownState } from './interfaces/IItemDropdownState';
import { TagPicker, ITag, IconButton, Panel, PanelType, PrimaryButton, DefaultButton, Checkbox, css, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { isArray, stringIsNullOrEmpty } from '@pnp/common';
import { find, cloneDeep, findIndex } from '@microsoft/sp-lodash-subset';
import { TaxonomyTerm, UtilsService, ServicesConfiguration, IBaseItem, BaseDataService } from 'spfx-base-data-services';

export class ItemDropdown<T extends IBaseItem> extends React.Component<IItemDropdownProps<T>, IItemDropdownState<T>> {
    constructor(props: IItemDropdownProps<T>) {
        super(props);
        this.state = {
            selectedItems: props.selectedItems,
            allItems: []
        };

    }


    public async componentDidMount() {
        let service = ServicesConfiguration.configuration.serviceFactory.create(this.props.modelName) as BaseDataService<T>;
        let items = await service.getAll();
        if (!this.props.showDeprecated) {
            items = items.filter((t) => { 
                return ((t instanceof TaxonomyTerm)  && !t.isDeprecated) || (!(t instanceof TaxonomyTerm)); 
            });
        }
        let selection = this.state.selectedItems;
        if(this.props.onGetSelectedItems) {
            selection = this.props.onGetSelectedItems(items);
        }
        this.setState({ allItems: items, selectedItems:selection });
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: IItemDropdownProps<T>) {
        if (JSON.stringify(nextProps.selectedItems) !== JSON.stringify(this.props.selectedItems)) {
            this.setState({ selectedItems: nextProps.selectedItems });
        }
    }

    public render() {
        const {label, multiSelect, placeholder, disabled, defaultOption, className, required} = this.props;
        const {selectedItems, allItems} = this.state;
        const displayedItems = this.getDisplayedItems(allItems);
        let selection = selectedItems;
        if(this.props.onGetSelectedItems) {
            selection = this.props.onGetSelectedItems(displayedItems);
        }
        let isdisabled = disabled;
        if(this.props.onGetDisabled) {
            isdisabled = this.props.onGetDisabled(displayedItems);
        }
        return <Dropdown
            className={className}
            label={label}
            required={required}
            multiSelect={multiSelect}
            disabled={disabled}
            onChange={this.onChange}
            placeholder={placeholder}
            options={(!stringIsNullOrEmpty(defaultOption) ? [{id: "", title: defaultOption} as T] : []).concat(displayedItems).map(item => this.getOption(item))}
            selectedKeys={selection && multiSelect ? (isArray(selection) ? (selection as T[]).map(i => i.id.toString()) : [(selection as T).id.toString()] ) : undefined}
            selectedKey={selection && !multiSelect ? (selection as T).id.toString() : undefined }
        />;
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
        if(option) {
            //Test if multiselect then add item to selection or remove it if present (unchecked)
            if (!this.props.multiSelect) {
                this.setState({ selectedItems: find(this.state.allItems, i => i.id.toString() === option.key.toString()) }, () => {
                    this.props.onChanged(this.state.selectedItems);
                });
            }
            else {
                let tempSelection = this.state.selectedItems ? cloneDeep(this.state.selectedItems) as T[] : [];
                if (!option.selected) {
                    let idxToRemove = findIndex(this.state.selectedItems as T[], i => i.id.toString() === option.key);
                    if (idxToRemove > -1) {
                        tempSelection.splice(idxToRemove, 1);
                    }
                    this.setState({ selectedItems: tempSelection.length > 0 ? tempSelection : null }, () => {
                        this.props.onChanged(this.state.selectedItems);
                    });
                }
                else {
                    tempSelection.push(find(this.state.allItems, i => i.id.toString() === option.key.toString()));
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
        let result: IDropdownOption;
        if (item) {
            result = { 
                key: item.id.toString(), 
                text: 
                    this.props.showFullPath  && item instanceof(TaxonomyTerm) ? 
                    UtilsService.getTermFullPathString(item, this.state.allItems as unknown[] as TaxonomyTerm[], this.props.baseLevel || 0) : 
                    item.title 
            };
        }
        return result;
    }
}