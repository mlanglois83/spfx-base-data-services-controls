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
import { PeoplePicker } from "../../../controls/PeoplePicker/PeoplePicker";
import { TaxonomyPicker } from "../../../controls/TaxonomyPicker/TaxonomyPicker";
import { TaxonomyFilter } from "../../../controls/TaxonomyFilter/TaxonomyFilter";
import { MediaSelector } from "../../../controls/MediaSelector/MediaSelector";
import * as React from 'react';
import { ServicesConfiguration } from "spfx-base-data-services";
import { cloneDeep, findIndex } from "@microsoft/sp-lodash-subset";
import { FakeTermsService } from "../../../services/taxonomy/FakeTermsService";
import { AssetsService } from "../../../services/sp/AssetsService";
var Test = /** @class */ (function (_super) {
    __extends(Test, _super);
    function Test(props) {
        var _this = _super.call(this, props) || this;
        _this.assetsService = null;
        _this.state = {
            selectedUsers: [],
            selectedTerms: [],
            selectedTerm: null,
            allTerms: [],
            files: []
        };
        _this.assetsService = new AssetsService();
        return _this;
    }
    Test.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fakeService, allTerms, assets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeService = new FakeTermsService();
                        return [4 /*yield*/, fakeService.getAll()];
                    case 1:
                        allTerms = _a.sent();
                        return [4 /*yield*/, this.assetsService.getAll()];
                    case 2:
                        assets = _a.sent();
                        this.setState({ allTerms: allTerms, files: assets });
                        return [2 /*return*/];
                }
            });
        });
    };
    Test.prototype.render = function () {
        var _this = this;
        return React.createElement(React.Fragment, null,
            React.createElement("div", null,
                React.createElement(PeoplePicker, { label: "people picker", selectedItems: this.state.selectedUsers, onChange: function (users) {
                        _this.setState({ selectedUsers: (users ? cloneDeep(users) : []) });
                    } })),
            React.createElement("div", null,
                React.createElement(TaxonomyPicker, { label: "taxonomy picker", modelName: "FakeTerm", multiSelect: true, onChanged: function (value) {
                        _this.setState({ selectedTerms: (value ? (Array.isArray(value) ? cloneDeep(value) : [value]) : []) });
                    } })),
            React.createElement("div", null,
                React.createElement(TaxonomyFilter, { terms: this.state.allTerms, onFilterChanged: function (term) {
                        _this.setState({ selectedTerm: term });
                    }, selectedTerm: this.state.selectedTerm })),
            React.createElement("div", null,
                React.createElement(MediaSelector, { editMode: true, files: this.state.files, onFileAdded: function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var copy;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    file.id = ServicesConfiguration.context.pageContext.web.serverRelativeUrl +
                                        "/SiteAssets/" + file.title;
                                    copy = cloneDeep(this.state.files);
                                    return [4 /*yield*/, this.assetsService.addOrUpdateItem(file)];
                                case 1:
                                    _a.sent();
                                    copy.push(file);
                                    this.setState({ files: copy });
                                    return [2 /*return*/];
                            }
                        });
                    }); }, onFileRemoved: function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var copy, idx;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    copy = cloneDeep(this.state.files);
                                    idx = findIndex(copy, function (f) { return f.id === file.id; });
                                    return [4 /*yield*/, this.assetsService.deleteItem(file)];
                                case 1:
                                    _a.sent();
                                    copy.splice(idx, 1);
                                    this.setState({ files: copy });
                                    return [2 /*return*/];
                            }
                        });
                    }); }, online: true })));
    };
    return Test;
}(React.Component));
export { Test };
//# sourceMappingURL=Test.js.map