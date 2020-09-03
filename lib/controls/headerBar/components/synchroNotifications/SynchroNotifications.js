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
import * as strings from 'ControlsStrings';
import * as React from 'react';
import { IconButton, Callout, DirectionalHint, List, SelectionMode, DetailsListLayoutMode, DetailsList, DetailsRow, css, CommandBar } from 'office-ui-fabric-react';
import styles from "../../HeaderBar.module.scss";
import { SPFile, TransactionType, ServicesConfiguration } from 'spfx-base-data-services';
import { assign } from '@microsoft/sp-lodash-subset';
/**
 * Control to select disable state and associated dates of a risk
 */
var SynchroNotifications = /** @class */ (function (_super) {
    __extends(SynchroNotifications, _super);
    /**
     * Construct RiskStateSelector control
     * @param props control properties (see IRiskStateSelectorProps)
     */
    function SynchroNotifications(props) {
        var _this = _super.call(this, props) || this;
        _this.columns = [
            {
                key: 'elementTypeCol',
                name: strings.ElementTypeColumnLabel,
                fieldName: 'itemType',
                minWidth: 80,
                isRowHeader: true,
                isResizable: false,
                isSorted: false,
                onRender: function (item) {
                    return React.createElement("span", null, ServicesConfiguration.configuration.translations.typeTranslations[item.itemType]);
                }
            },
            {
                key: 'operationCol',
                name: strings.OperationColumnLabel,
                fieldName: 'title',
                minWidth: 80,
                isRowHeader: true,
                isResizable: false,
                isSorted: false,
                onRender: function (transaction) {
                    var operationLabel;
                    var itemType = ServicesConfiguration.configuration.serviceFactory.getItemTypeByName(transaction.itemType);
                    var item = assign(new itemType(), transaction.itemData);
                    switch (transaction.title) {
                        case TransactionType.AddOrUpdate:
                            if (item instanceof SPFile) {
                                operationLabel = strings.UploadLabel;
                            }
                            else if (item.id < 0) {
                                operationLabel = strings.AddLabel;
                            }
                            else {
                                operationLabel = strings.UpdateLabel;
                            }
                            break;
                        case TransactionType.Delete:
                            operationLabel = strings.DeleteLabel;
                            break;
                        default: break;
                    }
                    return React.createElement("span", null, operationLabel);
                }
            },
            {
                key: 'titleColumn',
                name: strings.titleLabel,
                fieldName: 'itemData',
                minWidth: 250,
                isRowHeader: true,
                isResizable: false,
                isSorted: false,
                onRender: function (item) {
                    return React.createElement("span", null, item.itemData.title);
                }
            },
            {
                key: 'idColumn',
                name: strings.IdColumnLabel,
                fieldName: 'id',
                minWidth: 50,
                maxWidth: 50,
                isRowHeader: true,
                isResizable: false,
                isSorted: false,
                onRender: function (item) {
                    return (item.itemData.id > 0 ? React.createElement("span", null, item.itemData.id) : null);
                }
            }
        ];
        _this.onRenderRow = function (props) {
            var customStyles = {};
            if (props.itemIndex % 2 === 0) {
                // Every other row renders with a different background color
                customStyles.root = { backgroundColor: "white" };
            }
            return React.createElement(DetailsRow, __assign({}, props, { styles: customStyles }));
        };
        _this.renderErrors = function (item, index) {
            return React.createElement("div", { className: styles.syncErrorRow + (index % 2 === 0 ? (" " + styles.alternateRow) : ""), dangerouslySetInnerHTML: { __html: item } });
        };
        /**
         * close callout
         */
        _this.onCalloutDismiss = function () {
            _this.setState({ isCalloutVisible: false });
        };
        // set initial state
        _this.state = {
            isCalloutVisible: false,
            syncErrors: props.syncErrors
        };
        return _this;
    }
    SynchroNotifications.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    SynchroNotifications.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.syncErrors !== this.props.syncErrors) {
            this.setState({ syncErrors: this.props.syncErrors });
        }
    };
    /**
     * Render control
     */
    SynchroNotifications.prototype.render = function () {
        var _this = this;
        var _a = this.state, isCalloutVisible = _a.isCalloutVisible, syncErrors = _a.syncErrors;
        var _b = this.props, transactions = _b.transactions, syncRunning = _b.syncRunning;
        return React.createElement("div", null,
            React.createElement("div", { ref: function (elt) { _this.calloutButtonElement = elt; }, className: styles.syncButtonContainer },
                React.createElement(IconButton, { iconProps: { iconName: "Sync" }, onClick: function () { _this.setState({ isCalloutVisible: true }); }, className: syncRunning ? styles.synchronizing : "" }),
                transactions && transactions.length > 0 &&
                    React.createElement("div", { className: styles.transactionCount },
                        React.createElement("div", { className: styles.counterValue }, transactions.length)),
                syncErrors && syncErrors.length > 0 &&
                    React.createElement("div", { className: styles.syncErrorsCount },
                        React.createElement("div", { className: styles.counterValue }, syncErrors.length))),
            isCalloutVisible ? (React.createElement(Callout, { onDismiss: this.onCalloutDismiss, target: this.calloutButtonElement, directionalHint: DirectionalHint.bottomRightEdge, coverTarget: false, isBeakVisible: true, gapSpace: 0 },
                React.createElement("div", { className: css(styles.callout, styles.syncNotifCallout) },
                    React.createElement("h3", { className: styles.formTitle }, strings.PendingTransactionsLabel),
                    React.createElement("div", { className: styles.formField }, transactions && transactions.length ?
                        React.createElement(DetailsList, { onRenderRow: this.onRenderRow, items: transactions, compact: true, columns: this.columns, selectionMode: SelectionMode.none, layoutMode: DetailsListLayoutMode.justified, isHeaderVisible: true })
                        :
                            React.createElement("div", { className: styles.emptyMessage }, strings.NoTransactionsLabel)),
                    React.createElement("h3", { className: styles.formTitle }, strings.TransactionErrorsLabel),
                    React.createElement("div", { className: styles.formField }, syncErrors && syncErrors.length ? React.createElement(React.Fragment, null,
                        React.createElement(CommandBar, { items: [{
                                    key: "clear",
                                    iconOnly: false,
                                    iconProps: { iconName: "ErrorBadge" },
                                    title: strings.clearSyncErrors,
                                    text: strings.clearSyncErrors,
                                    onClick: function () {
                                        _this.setState({ syncErrors: [] });
                                    }
                                }] }),
                        React.createElement(List, { items: syncErrors, onRenderCell: this.renderErrors })) :
                        React.createElement("div", { className: styles.emptyMessage }, strings.NoSyncErrorsLabel))))) : null);
    };
    return SynchroNotifications;
}(React.Component));
export { SynchroNotifications };
//# sourceMappingURL=SynchroNotifications.js.map