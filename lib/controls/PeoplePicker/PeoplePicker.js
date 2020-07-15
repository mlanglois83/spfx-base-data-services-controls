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
import { NormalPeoplePicker, css, Icon } from "office-ui-fabric-react/lib";
import { User, UserService, ServicesConfiguration, UtilsService } from 'spfx-base-data-services';
import * as React from "react";
import * as strings from 'ControlsStrings';
import { stringIsNullOrEmpty } from "@pnp/common";
import styles from './PeoplePicker.module.scss';
var PeoplePicker = /** @class */ (function (_super) {
    __extends(PeoplePicker, _super);
    function PeoplePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.suggestionProps = {
            suggestionsHeaderText: strings.PeoplePickerSuggestion,
            noResultsFoundText: strings.PeoplePickerNoResults,
            loadingText: strings.PeoplePickerLoading,
            showRemoveButtons: true
        };
        _this.onFilterPeopleChanged = function (filterText, currentPersonas, limitResults) {
            if (filterText) {
                return new Promise(function (resolve, reject) {
                    _this.userService.getByDisplayName(filterText)
                        .then(function (users) { return __awaiter(_this, void 0, void 0, function () {
                        var personas, filteredPersonas;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    personas = new Array();
                                    return [4 /*yield*/, Promise.all(users.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                            var pictureUrl, isInCache;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        pictureUrl = UserService.getPictureUrl(user);
                                                        if (!!stringIsNullOrEmpty(pictureUrl)) return [3 /*break*/, 3];
                                                        isInCache = false;
                                                        if (!!stringIsNullOrEmpty(this.props.cacheKey)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, UtilsService.isUrlInCache(pictureUrl, this.props.cacheKey)];
                                                    case 1:
                                                        isInCache = _a.sent();
                                                        _a.label = 2;
                                                    case 2:
                                                        if (!ServicesConfiguration.configuration.lastConnectionCheckResult && !isInCache) {
                                                            pictureUrl = null;
                                                        }
                                                        _a.label = 3;
                                                    case 3:
                                                        personas.push({
                                                            text: user.title,
                                                            secondaryText: user.mail,
                                                            tertiaryText: user.id.toString(),
                                                            optionalText: user.userPrincipalName,
                                                            imageUrl: stringIsNullOrEmpty(pictureUrl) ? undefined : pictureUrl
                                                        });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 1:
                                    _a.sent();
                                    filteredPersonas = this.removeDuplicates(personas, currentPersonas);
                                    resolve(filteredPersonas);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        reject();
                    });
                });
            }
            else {
                // Return nothing if no search
                return [];
            }
        };
        _this.state = {
            selectedItems: props.selectedItems.map(function (u) {
                return {
                    text: u.title,
                    secondaryText: u.mail,
                    tertiaryText: u.id.toString(),
                    optionalText: u.userPrincipalName,
                    imageUrl: UserService.getPictureUrl(u)
                };
            })
        };
        _this.userService = new UserService(0);
        return _this;
    }
    PeoplePicker.prototype.componentDidUpdate = function (prevProps) {
        if (JSON.stringify(this.props.selectedItems) !== JSON.stringify(prevProps.selectedItems)) {
            this.setState({
                selectedItems: this.props.selectedItems.map(function (u) {
                    return {
                        text: u.title,
                        secondaryText: u.mail,
                        tertiaryText: u.id.toString(),
                        optionalText: u.userPrincipalName,
                        imageUrl: UserService.getPictureUrl(u)
                    };
                })
            });
        }
    };
    PeoplePicker.prototype.removeDuplicates = function (personas, possibleDupes) {
        var _this = this;
        return personas.filter(function (persona) { return !_this.listContainsPersona(persona, possibleDupes); });
    };
    PeoplePicker.prototype.listContainsPersona = function (persona, personas) {
        if (!personas || !personas.length || personas.length === 0) {
            return false;
        }
        return personas.filter(function (item) { return item.optionalText === persona.optionalText; }).length > 0;
    };
    PeoplePicker.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: styles.peoplePicker },
            this.props.label &&
                React.createElement("label", { className: this.props.required ? styles.required : "" }, this.props.label),
            React.createElement("div", { className: styles.peopleContainer },
                React.createElement("div", { className: css(styles.picker, !stringIsNullOrEmpty(this.state.error) ? styles.invalid : null) },
                    React.createElement(NormalPeoplePicker, { onResolveSuggestions: this.onFilterPeopleChanged, className: "ms-PeoplePicker", pickerSuggestionsProps: this.suggestionProps, key: "peoplepicker", selectedItems: this.state.selectedItems, onChange: function (items) {
                            if (_this.props.onChange) {
                                var users_1 = [];
                                if (items) {
                                    users_1 = items.map(function (item) {
                                        var user = new User();
                                        user.id = Number(item.tertiaryText);
                                        user.title = item.text;
                                        user.mail = item.secondaryText;
                                        user.userPrincipalName = item.optionalText;
                                        return user;
                                    });
                                }
                                var error = null;
                                if (_this.props.required && (!items || items.length === 0)) {
                                    error = strings.EmptyPeoplePicker;
                                }
                                _this.setState({
                                    error: error,
                                    selectedItems: items
                                }, function () { _this.props.onChange(users_1); });
                            }
                        }, onDismiss: function () {
                            var error = null;
                            if (_this.props.required && (!_this.props.selectedItems || _this.props.selectedItems.length === 0)) {
                                error = strings.EmptyPeoplePicker;
                            }
                            _this.setState({ error: error });
                        }, resolveDelay: 300, disabled: this.props.disabled, itemLimit: this.props.itemLimit }),
                    !stringIsNullOrEmpty(this.state.error) &&
                        React.createElement("div", { className: styles.errorMessage }, this.state.error)),
                React.createElement(Icon, { className: styles.pickerPeopleIcon, iconName: "ProfileSearch" /* ProfileSearch */ }))));
    };
    return PeoplePicker;
}(React.Component));
export { PeoplePicker };
//# sourceMappingURL=PeoplePicker.js.map