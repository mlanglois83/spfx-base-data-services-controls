
import * as React from 'react';
import { ITaxonomyFilterProps } from './interfaces/ITaxonomyFilterProps';
import { ITaxonomyFilterState } from './interfaces/ITaxonomyFilterState';
import { TaxonomyTerm } from 'spfx-base-data-services';
import { Dropdown, IDropdownOption, find, css } from 'office-ui-fabric-react';
import { stringIsNullOrEmpty } from '@pnp/common';
import * as strings from 'ControlsStrings';
import styles from './TaxonomyFilter.module.scss';

export class TaxonomyFilter<T extends TaxonomyTerm> extends React.Component<ITaxonomyFilterProps<T>, ITaxonomyFilterState<T>> {
    constructor(props: ITaxonomyFilterProps<T>) {
        super(props);
        this.state = {
            orderedTerms: this.getOrderedTerms(props.terms),
            selectedTerm: props.selectedTerm
        };
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: ITaxonomyFilterProps<T>) {
        let newState = null;
        if (JSON.stringify(nextProps.terms) !== JSON.stringify(this.props.terms)) {
            newState = {
                orderedTerms: (this.getOrderedTerms(nextProps.terms))
            };
        }
        if (JSON.stringify(nextProps.selectedTerm) !== JSON.stringify(this.props.selectedTerm)) {
            newState = (newState ? newState : {});
            newState = { ...newState, selectedTerm: nextProps.selectedTerm };
        }
        if (newState) {
            this.setState({ ...newState });
        }
    }

    public render() {
        const { orderedTerms } = this.state;
        const { classNames, overrideContainers } = this.props;
        if(overrideContainers) {
            if(overrideContainers.container) {
                return React.createElement(overrideContainers.container, {className: (classNames && classNames.containerClassname ? classNames.containerClassname : null)}, orderedTerms.map(this.renderLevel));
            }
            else {
                return <>
                    {orderedTerms.map(this.renderLevel)}
                </>;
            }
        }
        else {
            return <div className={css(styles.container, classNames && classNames.containerClassname ? classNames.containerClassname : null)}>
                {orderedTerms.map(this.renderLevel)}
            </div>;
        }
    }

    private renderLevel = (terms: T[], idx: number) => {     
        const { classNames, overrideContainers } = this.props;        
        if(overrideContainers) {
            if(overrideContainers.dropdownContainer) {
                return React.createElement(overrideContainers.dropdownContainer, {className: (classNames && classNames.dropdownContainerClassName ? classNames.dropdownContainerClassName : null)},
                    this.renderDropdown(terms, idx)
                );
            }
            else {
                return this.renderDropdown(terms, idx);
            }
        }
        else {
            return  <div  className={css(styles.dropdownContainer, classNames && classNames.dropdownContainerClassName ? classNames.dropdownContainerClassName : null)}>
                {this.renderDropdown(terms, idx)}
            </div>;
        }
        
    }

    private renderDropdown = (terms: T[], idx: number) => {        
        const { placeholders, classNames, labels } = this.props;
        let options = this.getOptions(terms, idx);
        let selectedKey = "";
        let selectedOpt = find(options, (opt) => { return opt.selected === true; });
        if (selectedOpt) {
            selectedKey = selectedOpt.key.toString();
        }
        options.forEach((o) => {
            o.selected = false;
        });
        return <Dropdown                     
            label={labels &&  labels.length > idx ? labels[idx] : undefined}
            className={classNames && classNames.dropdownClassName ? classNames.dropdownClassName : null}
            disabled={this.props.disabled}
            selectedKey={selectedKey} 
            options={options} 
            placeholder={placeholders && placeholders.length > idx ? placeholders[idx] : strings.selectTermLabel} 
            onChange={this.onFilterChanged}/>;
    }

    private onFilterChanged = (event, option?) => {
        if (option) {
            if (!stringIsNullOrEmpty(option.key)) {
                let term = find(this.props.terms, (t) => {
                    if (option.key.charAt(option.key.length - 1) == ';'){  // solution brutal mais besoin d'enlever le ; a la fin du path qui est en trop dans le cas de la selection du placeholder,
                        return t.path === option.key.substring(0, option.key.length - 1); // impossible de débuger (très pénible) pour ne pas ajouter ce ; a l'origine, perdu trop de temps pour un ;
                    }
                    else
                    {return t.path === option.key;}
                });
                this.setState({ selectedTerm: term }, () => {
                    if (this.props.onFilterChanged) {
                        this.props.onFilterChanged(term);
                    }
                });
            }
            else {
                this.setState({ selectedTerm: null }, () => {
                    if (this.props.onFilterChanged) {
                        this.props.onFilterChanged(null);
                    }
                });
            }
        }
    }

    private getOptions(terms: T[], idx: number) {
        const { selectedTerm } = this.state;
        const { placeholders } = this.props;
        let result: IDropdownOption[] = new Array<IDropdownOption>();
        if (idx === 0 && terms.length > 0) {
            result = [{
                text: placeholders && placeholders.length > idx ? placeholders[idx] : strings.selectTermLabel,
                key: "*"

            }, ...terms.map((t) => {
                return {
                    key: t.path,
                    text: t.title,
                    selected: selectedTerm != undefined && selectedTerm != null && (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)
                };
            })];
        }
        else if (selectedTerm) {
            let path = this.getLevelBasePath((this.props.baseLevel ? this.props.baseLevel + idx : idx));
            path = path + ";";
            let related = terms.filter((t) => {
                return t.path.indexOf(path) === 0 && !stringIsNullOrEmpty(path);
            });
            if (related.length > 0) {
                result = [{
                    text: placeholders && placeholders.length > idx ? placeholders[idx] : "",
                    key: path
                }, ...related.map((t) => {
                    return {
                        key: t.path,
                        text: t.title,
                        selected: selectedTerm != undefined && selectedTerm != null && (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)
                    };
                })];
            }
        }
        return result;
    }

    private getLevelBasePath(level: number): string {
        const { selectedTerm } = this.state;
        let result = "";
        let parts = selectedTerm.path.split(";");
        if (parts.length >= level) {
            parts.splice(level);
            result = parts.join(";");
        }

        return result;
    }

    private getOrderedTerms(terms: T[]): T[][] {
        let result = new Array<Array<T>>();
        let level = (this.props.baseLevel ? this.props.baseLevel + 1 : 1);
        let count = 0;
        while (count < terms.length) {
            let currentTerms = terms.filter((t) => {
                return t.path.split(";").length === level;
            });
            if (currentTerms.length > 0) {
                result.push(currentTerms);
                level++;
            }
            else {
                level++;
            }            
            count += currentTerms.length;
        }
        return result;
    }
}