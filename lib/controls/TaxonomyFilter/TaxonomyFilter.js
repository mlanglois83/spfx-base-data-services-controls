var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as React from 'react';
import { Dropdown, find, css } from 'office-ui-fabric-react';
import { stringIsNullOrEmpty } from '@pnp/common';
import * as strings from 'ControlsStrings';
import styles from './TaxonomyFilter.module.scss';
var TaxonomyFilter = /** @class */ (function (_super) {
    __extends(TaxonomyFilter, _super);
    function TaxonomyFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.onFilterChanged = function (event, option) {
            if (option) {
                if (!stringIsNullOrEmpty(option.key)) {
                    var term_1 = find(_this.props.terms, function (t) {
                        if (option.key.charAt(option.key.length - 1) == ';') { // solution brutal mais besoin d'enlever le ; a la fin du path qui est en trop dans le cas de la selection du placeholder,
                            return t.path === option.key.substring(0, option.key.length - 1); // impossible de débuger (très pénible) pour ne pas ajouter ce ; a l'origine, perdu trop de temps pour un ;
                        }
                        else {
                            return t.path === option.key;
                        }
                    });
                    _this.setState({ selectedTerm: term_1 }, function () {
                        if (_this.props.onFilterChanged) {
                            _this.props.onFilterChanged(term_1);
                        }
                    });
                }
                else {
                    _this.setState({ selectedTerm: null }, function () {
                        if (_this.props.onFilterChanged) {
                            _this.props.onFilterChanged(null);
                        }
                    });
                }
            }
        };
        _this.state = {
            orderedTerms: _this.getOrderedTerms(props.terms),
            selectedTerm: props.selectedTerm
        };
        return _this;
    }
    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    TaxonomyFilter.prototype.componentWillReceiveProps = function (nextProps) {
        var newState = null;
        if (JSON.stringify(nextProps.terms) !== JSON.stringify(this.props.terms)) {
            newState = {
                orderedTerms: (this.getOrderedTerms(nextProps.terms))
            };
        }
        if (JSON.stringify(nextProps.selectedTerm) !== JSON.stringify(this.props.selectedTerm)) {
            newState = (newState ? newState : {});
            newState = __assign(__assign({}, newState), { selectedTerm: nextProps.selectedTerm });
        }
        if (newState) {
            this.setState(__assign({}, newState));
        }
    };
    TaxonomyFilter.prototype.render = function () {
        var _this = this;
        var orderedTerms = this.state.orderedTerms;
        var _a = this.props, placeholders = _a.placeholders, classNames = _a.classNames;
        return React.createElement("div", { className: css(styles.container, classNames && classNames.containerClassname ? classNames.containerClassname : null) }, orderedTerms.map(function (terms, idx) {
            var options = _this.getOptions(terms, idx);
            var selectedKey = "";
            var selectedOpt = find(options, function (opt) { return opt.selected === true; });
            if (selectedOpt) {
                selectedKey = selectedOpt.key.toString();
            }
            options.forEach(function (o) {
                o.selected = false;
            });
            return React.createElement("div", { className: css(styles.dropdownContainer, classNames && classNames.dropdownContainerClassName ? classNames.dropdownContainerClassName : null) },
                React.createElement(Dropdown, { className: classNames && classNames.dropdownClassName ? classNames.dropdownClassName : null, disabled: _this.props.disabled, selectedKey: selectedKey, options: options, placeholder: placeholders && placeholders.length > idx ? placeholders[idx] : strings.selectTermLabel, onChange: _this.onFilterChanged }));
        }));
    };
    TaxonomyFilter.prototype.getOptions = function (terms, idx) {
        var selectedTerm = this.state.selectedTerm;
        var placeholders = this.props.placeholders;
        var result = new Array();
        if (idx === 0 && terms.length > 0) {
            result = __spreadArrays([{
                    text: placeholders && placeholders.length > idx ? placeholders[idx] : strings.selectTermLabel,
                    key: "*"
                }], terms.map(function (t) {
                return {
                    key: t.path,
                    text: t.title,
                    selected: selectedTerm != undefined && selectedTerm != null && (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)
                };
            }));
        }
        else if (selectedTerm) {
            var path_1 = this.getLevelBasePath((this.props.baseLevel ? this.props.baseLevel + idx : idx));
            path_1 = path_1 + ";";
            var related = terms.filter(function (t) {
                return t.path.indexOf(path_1) === 0 && !stringIsNullOrEmpty(path_1);
            });
            if (related.length > 0) {
                result = __spreadArrays([{
                        text: placeholders && placeholders.length > idx ? placeholders[idx] : "",
                        key: path_1
                    }], related.map(function (t) {
                    return {
                        key: t.path,
                        text: t.title,
                        selected: selectedTerm != undefined && selectedTerm != null && (selectedTerm.path === t.path || selectedTerm.path.indexOf(t.path + ";") === 0)
                    };
                }));
            }
        }
        return result;
    };
    TaxonomyFilter.prototype.getLevelBasePath = function (level) {
        var selectedTerm = this.state.selectedTerm;
        var result = "";
        var parts = selectedTerm.path.split(";");
        if (parts.length >= level) {
            parts.splice(level);
            result = parts.join(";");
        }
        return result;
    };
    TaxonomyFilter.prototype.getOrderedTerms = function (terms) {
        var result = new Array();
        var level = (this.props.baseLevel ? this.props.baseLevel + 1 : 1);
        var count = 0;
        while (count < terms.length) {
            var currentTerms = terms.filter(function (t) {
                return t.path.split(";").length === level;
            });
            if (currentTerms.length > 0) {
                result.push(currentTerms);
                count += currentTerms.length;
                level++;
            }
            else {
                level++;
            }
        }
        return result;
    };
    return TaxonomyFilter;
}(React.Component));
export { TaxonomyFilter };
//# sourceMappingURL=TaxonomyFilter.js.map