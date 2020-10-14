
import * as React from 'react';
import { IItemDropdownProps } from './interfaces/IItemDropdownProps';
import { IItemDropdownState } from './interfaces/IItemDropdownState';
import { TagPicker, ITag, IconButton, Panel, PanelType, PrimaryButton, DefaultButton, Checkbox, css, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { isArray, stringIsNullOrEmpty } from '@pnp/common';
import { find, cloneDeep, findIndex } from '@microsoft/sp-lodash-subset';
import { TaxonomyTerm, UtilsService, ServicesConfiguration, IBaseItem } from 'spfx-base-data-services';

export class ItemDropdown<T extends IBaseItem> extends React.Component<IItemDropdownProps<T>, IItemDropdownState<T>> {
    constructor(props: IItemDropdownProps<T>) {
        super(props);
        this.state = {
            selectedItems: props.selectedItems,
            allItems: []
        };

    }


    public async componentDidMount() {
        let service = ServicesConfiguration.configuration.serviceFactory.create(this.props.modelName);
        let items = await service.getAll();
        if (!this.props.showDeprecated) {
            items = items.filter((t) => { 
                return ((t instanceof TaxonomyTerm)  && !t.isDeprecated) || (!(t instanceof TaxonomyTerm)); 
            });
        }
        this.setState({ allItems: items as T[] });
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
        const {label, multiSelect, placeholder, disabled, defaultOption, className} = this.props;
        const {selectedItems, allItems} = this.state;
        return <Dropdown 
            className={className}
            label={label}
            multiSelect={multiSelect}
            disabled={disabled}
            onChange={this.onChange}
            placeholder={placeholder}
            options={(!stringIsNullOrEmpty(defaultOption) ? [{id: "", title: defaultOption} as T] : []).concat(allItems).map(item => this.getOption(item))}
            selectedKeys={selectedItems ? (isArray(selectedItems) ? (selectedItems as T[]).map(i => i.id.toString()) : [(selectedItems as T).id.toString()] ) : []}
        />;
    }

    private onChange = (event, option?: IDropdownOption) => {
        if(option) {
            //Test if multiselect then add item to selection or remove it if present (unchecked)
            if (!this.props.multiSelect) {
                if (!option.selected) {
                    this.setState({ selectedItems: null }, () => {
                        this.props.onChanged(this.state.selectedItems);
                    });
                }
                else {
                    this.setState({ selectedItems: find(this.state.allItems, i => i.id.toString() === option.key.toString()) }, () => {
                        this.props.onChanged(this.state.selectedItems);
                    });
                }
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