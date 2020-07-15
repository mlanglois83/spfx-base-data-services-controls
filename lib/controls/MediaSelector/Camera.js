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
var _this = this;
import * as React from 'react';
import Webcam from "react-webcam";
import RecordRTC from 'recordrtc';
import useMobileDetect from 'use-mobile-detect-hook';
import { Icon, Dialog, css, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import styles from './MediaSelector.module.scss';
import { SPFile, UtilsService } from 'spfx-base-data-services';
import { assign } from '@microsoft/sp-lodash-subset';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import * as strings from 'ControlsStrings';
export var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["Video"] = 0] = "Video";
    CameraMode[CameraMode["Picture"] = 1] = "Picture";
})(CameraMode || (CameraMode = {}));
export var CameraFacing;
(function (CameraFacing) {
    CameraFacing[CameraFacing["User"] = 0] = "User";
    CameraFacing[CameraFacing["Environnement"] = 1] = "Environnement";
})(CameraFacing || (CameraFacing = {}));
export var Camera = function (props) {
    var detectMobile = useMobileDetect();
    var _a = React.useState({
        width: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth,
        height: (window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight),
        facingMode: "user"
    }), videoConstraints = _a[0], setVideoCosntraints = _a[1];
    var _b = React.useState(CameraMode.Picture), mode = _b[0], setMode = _b[1];
    var _c = React.useState(CameraFacing.User), camera = _c[0], setCamera = _c[1];
    var _d = React.useState(false), RTC = _d[0], setRTC = _d[1];
    var _e = React.useState(null), videoRecorder = _e[0], setVideoRecorder = _e[1];
    var _f = React.useState([]), devices = _f[0], setDevices = _f[1];
    var webcamRef = React.useRef(null);
    var handleDevices = React.useCallback(function (mediaDevices) {
        return setDevices(mediaDevices.filter(function (_a) {
            var kind = _a.kind;
            return kind === "videoinput";
        }));
    }, [setDevices]);
    React.useEffect(function () {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [handleDevices]);
    var addFileMobile = function (inputElement) { return __awaiter(void 0, void 0, void 0, function () {
        var file, newFile, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = inputElement.files[0];
                    newFile = assign(new SPFile(), { contentUrl: "" });
                    newFile.name = file.name;
                    newFile.mimeType = file.type;
                    _a = newFile;
                    return [4 /*yield*/, UtilsService.blobToArrayBuffer(file)];
                case 1:
                    _a.content = _c.sent();
                    _b = newFile;
                    return [4 /*yield*/, UtilsService.getOfflineFileUrl(file)];
                case 2:
                    _b.contentUrl = _c.sent();
                    inputElement.value = null;
                    props.onChanged(newFile);
                    return [2 /*return*/];
            }
        });
    }); };
    function formatDate(date) {
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    }
    var addFile = function (base64) { return __awaiter(void 0, void 0, void 0, function () {
        var newFile;
        return __generator(this, function (_a) {
            newFile = assign(new SPFile(), { contentUrl: "" });
            if (mode == CameraMode.Picture) {
                newFile.name = "Picture-" + formatDate(new Date()) + ".jpeg";
                newFile.mimeType = "image/jpeg";
            }
            if (mode == CameraMode.Video) {
                newFile.name = "Video-" + formatDate(new Date()) + ".webm";
                newFile.mimeType = "video/webm";
            }
            newFile.content = convertDataURIToBinary(base64);
            newFile.contentUrl = base64;
            setRTC(false);
            props.onChanged(newFile);
            return [2 /*return*/];
        });
    }); };
    var capture = React.useCallback(function () {
        if (mode == CameraMode.Video) {
            if (!videoRecorder) {
                var temp = RecordRTC(webcamRef.current.stream, {
                    type: 'video',
                    video: {
                        width: 640,
                        height: 480
                    },
                    canvas: {
                        width: 640,
                        height: 480
                    }
                });
                temp.startRecording();
                setVideoRecorder(temp);
            }
            else {
                videoRecorder.stopRecording(function (url) {
                    videoRecorder.getDataURL(function (data) {
                        addFile(data);
                        console.log(data);
                        setVideoRecorder(null);
                    });
                });
            }
        }
        if (mode == CameraMode.Picture) {
            var imageSrc = webcamRef.current.getScreenshot();
            addFile(imageSrc);
        }
    }, [webcamRef, videoRecorder, mode]);
    var BASE64_MARKER = ';base64,';
    function convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
    var videoInput;
    var photoInput;
    var fileInput;
    var cssClasses = props.cssClasses;
    return (React.createElement(React.Fragment, null,
        !RTC &&
            React.createElement(React.Fragment, null,
                React.createElement("div", { className: css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile : null) },
                    React.createElement("div", { className: css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone : null), onClick: function () {
                            fileInput.click();
                        } },
                        React.createElement("input", { ref: function (elt) { fileInput = elt; }, type: "file", accept: ".doc,.docx,.csv,.xlsx,.xls,.ppt,.pptx,text/plain,.pdf", capture: true, onChange: function () { return addFileMobile(_this.fileInput); } }),
                        React.createElement(Icon, { iconName: "Page" }))),
                React.createElement("div", { className: css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile : null) },
                    React.createElement("div", { className: css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone : null), onClick: function () {
                            if (detectMobile.isMobile()) {
                                photoInput.click();
                            }
                            else {
                                setRTC(true);
                                setMode(CameraMode.Picture);
                            }
                        } },
                        React.createElement("input", { ref: function (elt) { photoInput = elt; }, type: "file", accept: "image/*", capture: true, onChange: function () {
                                //mobile call
                                return addFileMobile(photoInput);
                            } }),
                        React.createElement(Icon, { iconName: "Camera" }))),
                React.createElement("div", { className: css(styles.tile, cssClasses && cssClasses.tile ? cssClasses.tile : null) },
                    React.createElement("div", { className: css(styles.Addzone, cssClasses && cssClasses.addzone ? cssClasses.addzone : null), onClick: function () {
                            if (detectMobile.isMobile()) {
                                videoInput.click();
                            }
                            else {
                                setRTC(true);
                                setMode(CameraMode.Video);
                            }
                        } },
                        React.createElement("input", { ref: function (elt) { videoInput = elt; }, type: "file", accept: "video/*", capture: true, onChange: function () {
                                //mobile call
                                return addFileMobile(videoInput);
                            } }),
                        React.createElement(Icon, { iconName: "Video" })))),
        RTC &&
            React.createElement(Dialog, { hidden: false, onDismiss: function () { setRTC(false); }, modalProps: {
                    isBlocking: false,
                    responsiveMode: ResponsiveMode.large,
                    containerClassName: css(styles.dialogOuter, cssClasses && cssClasses.dialogContainer ? cssClasses.dialogContainer : null)
                } },
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: css(styles.cameraRow, cssClasses && cssClasses.cameraRow ? cssClasses.cameraRow : null) },
                        React.createElement("div", { className: css(styles.videoView, cssClasses && cssClasses.videoView ? cssClasses.videoView : null) },
                            React.createElement(Webcam, { audio: false, height: (window.innerHeight
                                    || document.documentElement.clientHeight
                                    || document.body.clientHeight) - 150, ref: webcamRef, screenshotFormat: "image/jpeg", width: (window.innerWidth
                                    || document.documentElement.clientWidth
                                    || document.body.clientWidth) * 0.75, videoConstraints: videoConstraints, forceScreenshotSourceSize: false, imageSmoothing: true, mirrored: false, screenshotQuality: 1, onUserMedia: function () { }, onUserMediaError: function () { } })),
                        React.createElement("div", { className: css(styles.cameraActionsRow, cssClasses && cssClasses.cameraActionsRow ? cssClasses.cameraActionsRow : null) },
                            React.createElement("div", { className: css(styles.cameraActions, cssClasses && cssClasses.cameraActions ? cssClasses.cameraActions : null) },
                                mode == CameraMode.Picture &&
                                    React.createElement(PrimaryButton, { text: strings.takePicture, onClick: capture }),
                                mode == CameraMode.Video &&
                                    React.createElement(PrimaryButton, { text: !videoRecorder ? strings.startVideo : strings.stopVideo, onClick: capture }),
                                devices.length > 1 && React.createElement(React.Fragment, null,
                                    React.createElement(PrimaryButton, { text: "Switch camera", onClick: function () {
                                            if (camera == CameraFacing.Environnement) {
                                                setCamera(CameraFacing.User);
                                                setVideoCosntraints({
                                                    width: window.innerWidth
                                                        || document.documentElement.clientWidth
                                                        || document.body.clientWidth,
                                                    height: (window.innerHeight
                                                        || document.documentElement.clientHeight
                                                        || document.body.clientHeight),
                                                    facingMode: "user"
                                                });
                                            }
                                            else {
                                                setCamera(CameraFacing.Environnement);
                                                setVideoCosntraints({
                                                    width: window.innerWidth
                                                        || document.documentElement.clientWidth
                                                        || document.body.clientWidth,
                                                    height: (window.innerHeight
                                                        || document.documentElement.clientHeight
                                                        || document.body.clientHeight),
                                                    facingMode: { exact: "environment" }
                                                });
                                            }
                                        } })),
                                React.createElement(DefaultButton, { onClick: function () { setRTC(false); } }, strings.cancelButtonLabel))))))));
};
//# sourceMappingURL=Camera.js.map