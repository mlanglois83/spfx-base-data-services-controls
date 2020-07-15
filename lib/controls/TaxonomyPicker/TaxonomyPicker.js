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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import { TagPicker, IconButton, Panel, PanelType, PrimaryButton, DefaultButton, Checkbox, css } from 'office-ui-fabric-react';
import { stringIsNullOrEmpty } from '@pnp/common';
import { find, cloneDeep, findIndex } from '@microsoft/sp-lodash-subset';
import styles from './TaxonomyPicker.module.scss';
import * as strings from "ControlsStrings";
import { UtilsService, ServicesConfiguration } from 'spfx-base-data-services';
var TaxonomyPicker = /** @class */ (function (_super) {
    __extends(TaxonomyPicker, _super);
    function TaxonomyPicker(props) {
        var _this = _super.call(this, props) || this;
        _this.BuildITag = function (selectedTerm) {
            var result = [];
            if (selectedTerm) {
                if (Array.isArray(selectedTerm)) {
                    selectedTerm.forEach(function (term) {
                        if (term) {
                            result.push({ key: term.id, name: _this.props.showFullPath ? UtilsService.getTermFullPathString(term, _this.state.allTerms, _this.props.baseLevel || 0) : term.title });
                        }
                    });
                }
                else
                    result.push({ key: selectedTerm.id, name: _this.props.showFullPath ? UtilsService.getTermFullPathString(selectedTerm, _this.state.allTerms, _this.props.baseLevel || 0) : selectedTerm.title });
            }
            return result;
        };
        _this.onCheckChange = function (checked, item) {
            //Test if multiselect then add item to selection or remove it if present (unchecked)
            if (!_this.props.multiSelect) {
                if (!checked) {
                    _this.setState({ panelSelection: null });
                }
                else {
                    _this.setState({ panelSelection: item });
                }
            }
            else {
                var tempSelection = _this.state.panelSelection ? cloneDeep(_this.state.panelSelection) : [];
                if (!checked) {
                    var idxToRemove = findIndex(_this.state.panelSelection, function (i) { return i.id == item.id; });
                    if (idxToRemove > -1)
                        tempSelection.splice(idxToRemove, 1);
                    tempSelection.length > 0 ? _this.setState({ panelSelection: tempSelection }) : _this.setState({ panelSelection: null });
                }
                else {
                    tempSelection.push(item);
                    _this.setState({ panelSelection: tempSelection });
                }
            }
        };
        /**
           * Display panel footer with action buttons
           */
        _this.onRenderPanelFooter = function () {
            var panelSelection = _this.state.panelSelection;
            return (React.createElement("div", { className: styles.panelActions },
                React.createElement(PrimaryButton, { className: styles.panelActionsButton, onClick: _this.validatePanelSelection }, strings.saveButtonLabel),
                React.createElement(DefaultButton, { className: styles.panelActionsButton, onClick: function () { _this.setState({ displayPanel: false }); } }, strings.cancelButtonLabel)));
        };
        _this.validatePanelSelection = function () {
            var error = null;
            if (_this.props.onGetErrorMessage) {
                error = _this.props.onGetErrorMessage(_this.state.panelSelection);
            }
            _this.setState({ displayPanel: false, selectedTerm: _this.state.panelSelection, error: error }, function () {
                if (_this.props.onChanged) {
                    _this.props.onChanged(cloneDeep(_this.state.selectedTerm));
                }
            });
        };
        _this.renderSuggestionTerm = function (tag, itemProps) {
            var term = find(_this.state.allTerms, function (t) { return t.id === tag.key; });
            var pathparts = term.path.split(";");
            if (_this.props.baseLevel) {
                for (var index = 0; index < _this.props.baseLevel; index++) {
                    pathparts.shift();
                }
            }
            var parentPath = (pathparts.length > 1 ? pathparts.slice(0, pathparts.length - 1).join(" > ") : "");
            return React.createElement("div", { className: styles.suggestionItem },
                React.createElement("div", { className: styles.termLabel }, term.title),
                !stringIsNullOrEmpty(parentPath) && React.createElement("div", { className: styles.termLocation }, strings.TaxonomyPickerTermLocationPrefix + parentPath));
        };
        _this.onTermChanged = function (terms) {
            var error = null;
            var result = [];
            if (terms && terms.length > 0) {
                if (!_this.props.multiSelect)
                    result = find(_this.state.allTerms, function (t) { return t.id === terms[0].key; });
                else
                    terms.forEach(function (term) { return result.push(find(_this.state.allTerms, function (t) { return t.id === term.key; })); });
            }
            if (_this.props.onGetErrorMessage) {
                error = _this.props.onGetErrorMessage(result);
            }
            _this.setState({ selectedTerm: result, error: error }, function () {
                if (_this.props.onChanged) {
                    _this.props.onChanged(cloneDeep(result));
                }
            });
        };
        _this.onFilterChanged = function (filterText, tagList) {
            return filterText
                ? _this.termTags
                    .filter(function (tag) {
                    return tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1 &&
                        !_this.listContainsTag(tag, tagList);
                })
                : [];
        };
        _this.state = {
            error: null,
            selectedTerm: props.selectedTerm,
            panelSelection: [],
            termQuery: "",
            displayPanel: false,
            allTerms: []
        };
        return _this;
    }
    Object.defineProperty(TaxonomyPicker.prototype, "termTags", {
        get: function () {
            var _this = this;
            return this.state.allTerms ? this.state.allTerms.map(function (term) {
                return { key: term.id, name: _this.props.showFullPath ? term.path.replace(/;/g, " > ") : term.title };
            }) : [];
        },
        enumerable: false,
        configurable: true
    });
    TaxonomyPicker.prototype.getOrderedChildTerms = function (term, allTerms) {
        var _this = this;
        // sort allready done by service on customsortorder
        var result = [];
        var childterms = allTerms.filter(function (t) { return t.path.indexOf(term.path) == 0; });
        var level = term.path.split(";").length;
        var directChilds = childterms.filter(function (ct) { return ct.path.split(";").length === level + 1; });
        directChilds.forEach(function (dc) {
            result.push(dc);
            var dcchildren = _this.getOrderedChildTerms(dc, childterms);
            if (dcchildren.length > 0) {
                result.push.apply(result, dcchildren);
            }
        });
        return result;
    };
    TaxonomyPicker.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, items, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = ServicesConfiguration.configuration.serviceFactory.create(this.props.modelName);
                        return [4 /*yield*/, service.getAll()];
                    case 1:
                        items = _a.sent();
                        if (!this.props.showDeprecated) {
                            items = items.filter(function (t) { return !t.isDeprecated; });
                        }
                        error = null;
                        if (this.props.onGetErrorMessage) {
                            error = this.props.onGetErrorMessage(this.state.selectedTerm);
                        }
                        this.setState({ allTerms: items, error: error });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
       * New props have been received, not saved yet
       * @param nextProps New props object
       */
    TaxonomyPicker.prototype.componentWillReceiveProps = function (nextProps) {
        if (JSON.stringify(nextProps.selectedTerm) !== JSON.stringify(this.props.selectedTerm)) {
            this.setState({ selectedTerm: nextProps.selectedTerm });
        }
    };
    TaxonomyPicker.prototype.render = function () {
        var _this = this;
        return React.createElement("div", { className: styles.taxonomyPicker },
            this.props.label &&
                React.createElement("label", { className: this.props.required ? styles.required : "" }, this.props.label),
            React.createElement("div", { className: styles.pickerContainer },
                React.createElement("div", { className: css(styles.picker, !stringIsNullOrEmpty(this.state.error) ? styles.invalid : null) },
                    React.createElement(TagPicker, { disabled: this.props.disabled, onDismiss: function () {
                            var error = null;
                            if (_this.props.onGetErrorMessage) {
                                error = _this.props.onGetErrorMessage(_this.state.selectedTerm);
                            }
                            _this.setState({ error: error });
                        }, selectedItems: this.BuildITag(this.state.selectedTerm), onResolveSuggestions: this.onFilterChanged, getTextFromItem: this.getTextFromItem, pickerSuggestionsProps: {
                            suggestionsHeaderText: strings.TaxonomyPickerSuggestedTerms,
                            noResultsFoundText: strings.TaxonomyPickerNoTerm
                        }, itemLimit: this.props.multiSelect ? undefined : 1, onChange: this.onTermChanged, onRenderSuggestionsItem: this.renderSuggestionTerm })),
                React.createElement("div", { className: styles.btn },
                    React.createElement(IconButton, { disabled: this.props.disabled, iconProps: { iconName: "Tag" }, onClick: function () { _this.setState({ displayPanel: true, panelSelection: _this.state.selectedTerm }); } }))),
            !stringIsNullOrEmpty(this.state.error) &&
                React.createElement("div", { className: styles.errorMessage }, this.state.error),
            this.state.displayPanel && React.createElement(Panel, { headerText: this.props.panelTitle, type: PanelType.medium, isOpen: this.state.displayPanel, isLightDismiss: true, isFooterAtBottom: true, onDismiss: function () { _this.setState({ displayPanel: false }); }, onRenderFooterContent: this.onRenderPanelFooter },
                React.createElement("div", { className: styles.panelContent }, this.state.allTerms.map(function (term) {
                    var pathparts = term.path.split(";");
                    return React.createElement("div", { className: styles.panelItem, style: { marginLeft: ((pathparts.length - 1 - (_this.props.baseLevel || 0)) * 30) + "px" } },
                        React.createElement(Checkbox, { checked: _this.state.panelSelection ? Array.isArray(_this.state.panelSelection) ? findIndex(_this.state.panelSelection, function (i) { return i.id == term.id; }) != -1 : _this.state.panelSelection.id == term.id : false, label: term.title, onChange: function (evt, checked) { _this.onCheckChange(checked === true, term); } }));
                }))));
    };
    TaxonomyPicker.prototype.getTextFromItem = function (item) {
        return item.name;
    };
    TaxonomyPicker.prototype.listContainsTag = function (tag, tagList) {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.filter(function (compareTag) { return compareTag.key === tag.key; }).length > 0;
    };
    return TaxonomyPicker;
}(React.Component));
export { TaxonomyPicker };
//# sourceMappingURL=TaxonomyPicker.js.map