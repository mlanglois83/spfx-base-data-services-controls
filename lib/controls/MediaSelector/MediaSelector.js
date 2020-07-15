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
import { assign, cloneDeep, find } from '@microsoft/sp-lodash-subset';
import { stringIsNullOrEmpty } from '@pnp/common';
import * as strings from 'ControlsStrings';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import styles from './MediaSelector.module.scss';
import { UtilsService } from 'spfx-base-data-services';
import { Camera } from './Camera';
import { css } from 'office-ui-fabric-react';
var MediaSelector = /** @class */ (function (_super) {
    __extends(MediaSelector, _super);
    function MediaSelector(props) {
        var _this = _super.call(this, props) || this;
        _this.onFileRemove = function (idx) {
            var file = cloneDeep(_this.state.files[idx]);
            var filesCopy = cloneDeep(_this.state.files);
            filesCopy.splice(idx, 1);
            _this.setState({ files: filesCopy }, function () {
                _this.props.onFileRemoved(file);
            });
        };
        _this.state = {
            files: [],
            cachedUrls: [],
            videoRecorder: null
        };
        return _this;
    }
    MediaSelector.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.loadFilesFromProps();
                return [2 /*return*/];
            });
        });
    };
    MediaSelector.prototype.componentDidUpdate = function (prevProps, prevState) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.props.online !== prevProps.online && !this.props.online) {
                    this.loadCachedUrls();
                }
                if (JSON.stringify(this.props.files) !== JSON.stringify(prevProps.files)) {
                    this.loadFilesFromProps();
                }
                return [2 /*return*/];
            });
        });
    };
    MediaSelector.prototype.loadFilesFromProps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filesCopy, stateFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filesCopy = cloneDeep(this.props.files);
                        return [4 /*yield*/, Promise.all(filesCopy.map(function (f) { return __awaiter(_this, void 0, void 0, function () {
                                var file, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            file = assign(f, { contentUrl: undefined });
                                            if (!file.content) return [3 /*break*/, 2];
                                            _a = file;
                                            return [4 /*yield*/, UtilsService.getOfflineFileUrl(UtilsService.arrayBufferToBlob(file.content, file.mimeType))];
                                        case 1:
                                            _a.contentUrl = _b.sent();
                                            _b.label = 2;
                                        case 2: return [2 /*return*/, file];
                                    }
                                });
                            }); }))];
                    case 1:
                        stateFiles = _a.sent();
                        this.setState({ files: stateFiles });
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaSelector.prototype.loadCachedUrls = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cached;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = [];
                        return [4 /*yield*/, Promise.all(this.state.files.map(function (f) { return __awaiter(_this, void 0, void 0, function () {
                                var isInCache;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            isInCache = false;
                                            if (!!stringIsNullOrEmpty(this.props.cacheKey)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, UtilsService.isUrlInCache(f.serverRelativeUrl, this.props.cacheKey)];
                                        case 1:
                                            isInCache = _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (isInCache) {
                                                cached.push(f.serverRelativeUrl);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        this.setState({ cachedUrls: cached });
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaSelector.prototype.render = function () {
        var _this = this;
        var cssClasses = this.props.cssClasses;
        var attachments = this.renderFiles();
        return React.createElement("div", { className: css(styles.attachmentsSelector, cssClasses && cssClasses.container ? cssClasses.container : null) },
            this.props.editMode &&
                React.createElement(React.Fragment, null, !this.props.disabled && React.createElement(Camera, { onChanged: function (newFile) {
                        var filesCopy = cloneDeep(_this.state.files);
                        var existing = find(filesCopy, function (f) { return f.title === newFile.title; });
                        if (existing) {
                            existing = newFile;
                        }
                        else {
                            filesCopy.push(newFile);
                        }
                        _this.props.onFileAdded(newFile);
                    }, cssClasses: cssClasses })),
            attachments);
    };
    MediaSelector.prototype.renderFiles = function () {
        var _this = this;
        var cssClasses = this.props.cssClasses;
        var result = (this.state.files || []).filter(function (testfile) {
            var isImage = testfile.mimeType.indexOf("image/") === 0;
            var isVideo = testfile.mimeType.indexOf("video/") === 0;
            var isFile = !isVideo && !isImage;
            return (isImage || isVideo || isFile) &&
                (!stringIsNullOrEmpty(testfile.contentUrl) ||
                    _this.props.online ||
                    (!_this.props.online && find(_this.state.cachedUrls, function (c) { return c == testfile.serverRelativeUrl; })));
        }).map(function (file, i) {
            var url = ((_this.props.online && !file.content) || (!_this.props.online && find(_this.state.cachedUrls, function (c) { return c == file.serverRelativeUrl; }) && !file.content)
                ?
                    file.serverRelativeUrl
                :
                    file.contentUrl);
            var isImage = file.mimeType.indexOf("image/") === 0;
            var isVideo = file.mimeType.indexOf("video/") === 0;
            var isFile = !isVideo && !isImage;
            return (React.createElement("div", { className: css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile : null) },
                React.createElement("div", { className: css(styles.media, cssClasses && cssClasses.media ? cssClasses.media : null, styles.uploaded, cssClasses && cssClasses.uploaded ? cssClasses.uploaded : null, (_this.props.disabled ? styles.disabled : null), (_this.props.disabled && cssClasses && cssClasses.disabled ? cssClasses.disabled : null)), onClick: function () { if (file.serverRelativeUrl && !_this.props.disabled) {
                        window.open(file.serverRelativeUrl + "?web=1", '_blank');
                    } } },
                    React.createElement("div", { className: css(styles.preview, cssClasses && cssClasses.preview ? cssClasses.preview : null) },
                        isFile &&
                            React.createElement("div", { className: css(styles.filePreview, cssClasses && cssClasses.filePreview ? cssClasses.filePreview : null) },
                                React.createElement("label", null, file.name)),
                        isImage &&
                            React.createElement("img", { src: url, alt: file.name }),
                        isVideo &&
                            React.createElement("video", { controls: true },
                                React.createElement("source", { src: url, type: file.mimeType }))),
                    _this.props.editMode && React.createElement("div", { className: css(styles.actions, cssClasses && cssClasses.tileActions ? cssClasses.tileActions : null) },
                        React.createElement(IconButton, { disabled: _this.props.disabled, iconProps: { iconName: "StatusErrorFull" }, ariaLabel: strings.removeButtonLabel, onClick: function (e) { e.stopPropagation(); _this.onFileRemove(i); } })))));
        });
        return (result.length > 0 ? React.createElement(React.Fragment, null, result) : (!this.props.editMode ? React.createElement("div", { className: css(styles.noTiles, cssClasses && cssClasses.noTiles ? cssClasses.noTiles : null) }, strings.NoMediaMessage) : null));
    };
    return MediaSelector;
}(React.Component));
export { MediaSelector };
//# sourceMappingURL=MediaSelector.js.map