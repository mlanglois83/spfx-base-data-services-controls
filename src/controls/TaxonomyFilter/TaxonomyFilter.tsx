
import * as React from 'react';
import { ITaxonomyFilterProps } from './interfaces/ITaxonomyFilterProps';
import { ITaxonomyFilterState } from './interfaces/ITaxonomyFilterState';
import { TaxonomyTerm } from 'spfx-base-data-services';
import { Dropdown, IDropdownOption, find, css, findIndex } from '@fluentui/react';
import { stringIsNullOrEmpty } from '@pnp/common/util';
import * as strings from 'ControlsStrings';
import styles from './TaxonomyFilter.module.scss';

export class TaxonomyFilter<T extends TaxonomyTerm> extends React.Component<ITaxonomyFilterProps<T>, ITaxonomyFilterState<T>> {
    constructor(props: ITaxonomyFilterProps<T>) {
        super(props);
        this.state = {
            orderedTerms: this.getOrderedTerms(props.terms),
            selectedTerm: props.selectedTerm,
            selectedTerms: props.selectedTerms
        };
    }

    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    public componentWillReceiveProps(nextProps: ITaxonomyFilterProps<T>): void {
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
        if (JSON.stringify(nextProps.selectedTerms) !== JSON.stringify(this.props.selectedTerms)) {
            newState = (newState ? newState : {});
            newState = { ...newState, selectedTerms: nextProps.selectedTerms };
        }
        if (newState) {
            this.setState({ ...newState });
        }
    }

    public render(): React.ReactElement<ITaxonomyFilterProps<T>> {
        const { orderedTerms } = this.state;
        const { classNames, overrideContainers } = this.props;
        if(overrideContainers) {
            if(overrideContainers.container) {
                return React.createElement(overrideContainers.container, {... this.props, className: (classNames && classNames.containerClassname ? classNames.containerClassname : null)}, orderedTerms.map(this.renderLevel));
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
                    this.props.multiSelect ? this.renderDropdownMulti(terms, idx) : this.renderDropdown(terms, idx)
                );
            }
            else {
                return this.props.multiSelect ? this.renderDropdownMulti(terms, idx) : this.renderDropdown(terms, idx);
            }
        }
        else {
            return  <div  className={css(styles.dropdownContainer, classNames && classNames.dropdownContainerClassName ? classNames.dropdownContainerClassName : null)}>
                {this.props.multiSelect ? this.renderDropdownMulti(terms, idx) : this.renderDropdown(terms, idx)}
            </div>;
        }
        
    }

    private renderDropdown = (terms: T[], idx: number) => {        
        const { placeholders, classNames, labels } = this.props;
        const options = this.getOptions(terms, idx);
        let selectedKey = "";
        const selectedOpt = find(options, (opt) => { return opt.selected === true; });
        if (selectedOpt) {
            selectedKey = selectedOpt.key.toString();
        }
        options.forEach((o) => {
            o.selected = false;
        });
        return <Dropdown        
            {...this.props.dropdownProps}           
            label={labels &&  labels.length > idx ? labels[idx] : undefined}
            className={classNames && classNames.dropdownClassName ? classNames.dropdownClassName : null}
            disabled={this.props.disabled}
            selectedKey={selectedKey} 
            options={options} 
            placeholder={placeholders && placeholders.length > idx ? placeholders[idx] : strings.selectTermLabel} 
            onChange={this.onFilterChanged}
        />;
    }

    private renderDropdownMulti = (terms: T[], idx: number) => {
        const { placeholders, classNames, labels } = this.props;
        const options = this.getOptionsMulti(terms, idx);
        let selectedKeys: Array<string> = [];
        const selectedOpts = options.filter((opt) => { return opt.selected === true; });
        if (selectedOpts?.length > 0) {
            selectedKeys = selectedOpts.map((opt) => opt.key.toString());
        }
        return <Dropdown
            {...this.props.dropdownProps}
            label={labels && labels.length > idx ? labels[idx] : undefined}
            className={classNames && classNames.dropdownClassName ? classNames.dropdownClassName : null}
            disabled={this.props.disabled}
            selectedKeys={selectedKeys}
            options={options}
            placeholder={placeholders && placeholders.length > idx ? placeholders[idx] : strings.selectTermLabel}
            onChange={this.onFilterChanged}
            multiSelect
        />;
    }

    private onFilterChanged = (event, option?) => {
        if (option) {
            if (!stringIsNullOrEmpty(option.key)) {
                const term = find(this.props.terms, (t) => {
                    if (option.key.charAt(option.key.length - 1) == ';'){  // solution brutal mais besoin d'enlever le ; a la fin du path qui est en trop dans le cas de la selection du placeholder,
                        return t.path === option.key.substring(0, option.key.length - 1); // impossible de débuger (très pénible) pour ne pas ajouter ce ; a l'origine, perdu trop de temps pour un ;
                    }
                    else
                    {return t.path === option.key;}
                });
                if (this.props.multiSelect) {
                    let terms = this.state.selectedTerms.concat();
                    if (option.selected === true)
                        terms.push(term);
                    else
                        terms = terms.filter(_term => _term.path !== option.key);

                    this.setState({ selectedTerms: terms }, () => {
                        if (this.props.onFiltersChanged) {
                            this.props.onFiltersChanged(terms);
                        }
                    });
                }
                else {                    
                    this.setState({ selectedTerm: term }, () => {
                        if (this.props.onFilterChanged) {
                            this.props.onFilterChanged(term);
                        }
                    });
                }
            }
            else {
                if (this.props.multiSelect) {
                    this.setState({ selectedTerms: [] }, () => {
                        if (this.props.onFiltersChanged) {
                            this.props.onFiltersChanged([]);
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
                    selected: selectedTerm && (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)
                };
            })];
        }
        else if (selectedTerm) {
            let path = this.getLevelBasePath((this.props.baseLevel ? this.props.baseLevel + idx : idx));
            path = path + ";";
            const related = terms.filter((t) => {
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
                        selected: selectedTerm && (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)

                    };
                })];
            }
        }
        return result;
    }

    private getOptionsMulti(terms: T[], idx: number) {
        const { selectedTerm, selectedTerms } = this.state;

        let result: IDropdownOption[] = new Array<IDropdownOption>();

        if (idx === 0 && terms.length > 0) {
            result = terms.map((t) => {
                return {
                    key: t.path,
                    text: t.title,
                    selected: selectedTerms.length > 0 && findIndex(selectedTerms, selectedTerm => (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)) > -1
                };
            });
        }
        else if (selectedTerm || selectedTerms.length > 0) {
            let paths = this.getLevelBasePaths((this.props.baseLevel ? this.props.baseLevel + idx : idx));
            paths = paths.map((path) => path + ";");

            const related = terms.filter((t) => {
                return findIndex(paths, path => t.path.indexOf(path) === 0 && !stringIsNullOrEmpty(path)) > -1;
            });
            if (related.length > 0) {
                result = related.map((t) => {
                    return {
                        key: t.path,
                        text: t.title,
                        selected: selectedTerms.length > 0 && findIndex(selectedTerms, selectedTerm => (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)) > -1
                    };
                });
            }
        }
        return result;
    }

    private getLevelBasePath(level: number): string {
        const { selectedTerm } = this.state;
        let result = "";
        const parts = selectedTerm.path.split(";");
        if (parts.length >= level) {
            parts.splice(level);
            result = parts.join(";");
        }

        return result;
    }

    private getLevelBasePaths(level: number): string[] {
        const { selectedTerms } = this.state;
        const results: string[] = [];

        selectedTerms.forEach((selectedTerm: T) => {
            const parts = selectedTerm.path.split(";");
            if (parts.length >= level) {
                parts.splice(level);
                results.push(parts.join(";"));
            }
        });

        return results;
    }

    private getOrderedTerms(terms: T[]): T[][] {
        const result = new Array<Array<T>>();
        let level = (this.props.baseLevel ? this.props.baseLevel + 1 : 1);
        let count = 0;
        while (count < terms.length) {
            const currentTerms = terms.filter((t) => {
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