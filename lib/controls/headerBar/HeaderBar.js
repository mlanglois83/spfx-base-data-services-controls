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
import * as strings from 'ControlsStrings';
import { IconButton, Icon, css } from 'office-ui-fabric-react';
import * as React from 'react';
import styles from './HeaderBar.module.scss';
import { HashRouter, Switch, Route } from "react-router-dom";
import { SynchroNotifications } from "./components/synchroNotifications/SynchroNotifications";
import { stringIsNullOrEmpty } from '@pnp/common';
/**
 * Control to select disable state and associated dates of a risk
 */
var HeaderBar = /** @class */ (function (_super) {
    __extends(HeaderBar, _super);
    /**
     * Construct RiskStateSelector control
     * @param props control properties (see IRiskStateSelectorProps)
     */
    function HeaderBar(props) {
        var _this = _super.call(this, props) || this;
        _this.setTitle = function (event) {
            _this.setState({ title: event.detail });
        };
        _this.onToggleFullscreenClick = function () {
            if (!document["fullscreenElement"] && /* Standard syntax */
                !document['webkitFullscreenElement'] && /* Chrome, Safari and Opera syntax */
                !document['mozFullScreenElement'] && /* Firefox syntax */
                !document['msFullscreenElement'] /* IE/Edge syntax */) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                }
                else if (document.documentElement["mozRequestFullScreen"]) {
                    document.documentElement["mozRequestFullScreen"]();
                }
                else if (document.documentElement["webkitRequestFullScreen"]) {
                    document.documentElement["webkitRequestFullScreen"]();
                }
                else if (document.documentElement["msRequestFullscreen"]) {
                    document.documentElement["msRequestFullscreen"]();
                }
            }
            else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document["webkitExitFullscreen"]) {
                    document["webkitExitFullscreen"]();
                }
                else if (document["mozCancelFullScreen"]) {
                    document["mozCancelFullScreen"]();
                }
                else if (document["msExitFullscreen"]) {
                    document["msExitFullscreen"]();
                }
            }
        };
        _this.isFullScreen = function () {
            var maxHeight = window.screen.height, maxWidth = window.screen.width, curHeight = window.innerHeight, curWidth = window.innerWidth;
            return maxWidth == curWidth && maxHeight == curHeight;
        };
        _this.onWindowResize = function () {
            var fullscreen = _this.isFullScreen();
            if (fullscreen !== _this.state.fullscreen) {
                _this.adaptDomElements(fullscreen);
                _this.setState({ fullscreen: fullscreen }, function () {
                    if (_this.props.onFullscreenChanged) {
                        _this.props.onFullscreenChanged(fullscreen);
                    }
                });
            }
        };
        _this.onWindowKeypress = function (event) {
            // override f11
            if (event.which === 122) {
                event.preventDefault();
                _this.onToggleFullscreenClick();
            }
        };
        _this.adaptDomElements = function (fullscreen) {
            if (fullscreen) {
                var suiteNavWrapper = document.getElementById("SuiteNavWrapper");
                if (suiteNavWrapper) {
                    suiteNavWrapper.style.display = "none";
                }
                var headerHost = document.querySelector("div[data-sp-feature-tag='Site header host']");
                if (headerHost) {
                    headerHost['style'].display = 'none';
                }
                var banner = document.querySelector('[role=banner]');
                if (banner) {
                    banner['style'].display = 'none';
                }
                var nav = document.getElementById("SuiteNavPlaceHolder");
                if (nav) {
                    nav.style.display = "none";
                }
                var commandBar = document.getElementsByClassName("commandBarWrapper");
                if (commandBar && commandBar.length > 0) {
                    commandBar[0]['style'].display = "none";
                }
                var CanvasZone = document.getElementsByClassName("CanvasZone");
                if (CanvasZone && CanvasZone.length > 0) {
                    CanvasZone[0]['style'].padding = "0";
                    CanvasZone[0]['style'].margin = "0";
                    CanvasZone[0]['style'].maxWidth = "100%";
                }
                var CanvasSection = document.getElementsByClassName("CanvasSection");
                if (CanvasSection && CanvasSection.length > 0) {
                    CanvasSection[0]['style'].padding = "0";
                    CanvasSection[0]['style'].margin = "0";
                }
                var ControlZone = document.getElementsByClassName("ControlZone");
                if (ControlZone && ControlZone.length > 0) {
                    ControlZone[0]['style'].padding = "0";
                    ControlZone[0]['style'].margin = "0";
                }
                if (_this.props.contentContainer) {
                    _this.props.contentContainer.style.height = "calc(100vh - 52px)";
                    _this.props.contentContainer.style.overflow = "auto";
                    var scrollDiv = document.querySelector("div[data-is-scrollable='true']");
                    if (scrollDiv) {
                        scrollDiv.style.overflow = "hidden";
                    }
                }
            }
            else {
                var suiteNavWrapper = document.getElementById("SuiteNavWrapper");
                if (suiteNavWrapper) {
                    suiteNavWrapper.style.display = "block";
                }
                var headerHost = document.querySelector("div[data-sp-feature-tag='Site header host']");
                if (headerHost) {
                    headerHost['style'].display = 'block';
                }
                var banner = document.querySelector('[role=banner]');
                if (banner) {
                    banner['style'].display = 'block';
                }
                var nav = document.getElementById("SuiteNavPlaceHolder");
                if (nav) {
                    nav.style.display = "block";
                }
                var commandBar = document.getElementsByClassName("commandBarWrapper");
                if (commandBar && commandBar.length > 0) {
                    commandBar[0]['style'].display = "block";
                }
                var CanvasZone = document.getElementsByClassName("CanvasZone");
                if (CanvasZone && CanvasZone.length > 0) {
                    CanvasZone[0]['style'].padding = null;
                    CanvasZone[0]['style'].margin = null;
                    CanvasZone[0]['style'].maxWidth = null;
                }
                var CanvasSection = document.getElementsByClassName("CanvasSection");
                if (CanvasSection && CanvasSection.length > 0) {
                    CanvasSection[0]['style'].padding = null;
                    CanvasSection[0]['style'].margin = null;
                }
                var ControlZone = document.getElementsByClassName("ControlZone");
                if (ControlZone && ControlZone.length > 0) {
                    ControlZone[0]['style'].padding = null;
                    ControlZone[0]['style'].margin = null;
                }
                if (_this.props.contentContainer) {
                    _this.props.contentContainer.style.height = "auto";
                    _this.props.contentContainer.style.overflow = null;
                    var scrollDiv = document.querySelector("div[data-is-scrollable='true']");
                    if (scrollDiv) {
                        scrollDiv.style.overflow = null;
                    }
                }
            }
        };
        // set initial state
        _this.state = {
            fullscreen: _this.isFullScreen(),
            title: ""
        };
        return _this;
    }
    HeaderBar.setTitle = function (newTitle) {
        var event = new CustomEvent('setHeaderTitle', { detail: newTitle });
        document.dispatchEvent(event);
    };
    HeaderBar.prototype.componentDidMount = function () {
        window.addEventListener("resize", this.onWindowResize);
        window.addEventListener('keydown', this.onWindowKeypress);
        document.addEventListener("setHeaderTitle", this.setTitle);
    };
    HeaderBar.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener("keydown", this.onWindowKeypress);
        document.removeEventListener("setHeaderTitle", this.setTitle);
    };
    /**
     * Render control
     */
    HeaderBar.prototype.render = function () {
        var _this = this;
        var title = this.state.title;
        return React.createElement("div", { className: styles.stickyHeader },
            React.createElement("div", { className: styles.headerLeftPanel },
                React.createElement(HashRouter, null,
                    React.createElement(Switch, null,
                        this.props.homeButtonHideUrls && this.props.homeButtonHideUrls.map(function (url) {
                            return React.createElement(Route, { path: url, component: function () { return React.createElement(React.Fragment, null); } });
                        }),
                        React.createElement(Route, { component: function (_a) {
                                var history = _a.history;
                                return React.createElement("div", { className: styles.panelItem },
                                    React.createElement(IconButton, { iconProps: { iconName: "Home" }, title: strings.NavHomeText, onClick: function () { history.push(_this.props.homeUrl); } }));
                            } }))),
                !stringIsNullOrEmpty(title) && React.createElement("div", { className: css(styles.panelItem, styles.titleBlock) },
                    React.createElement("div", { className: styles.headerTitle }, title))),
            React.createElement("div", { className: styles.headerRightPanel },
                React.createElement("div", { className: styles.panelItem },
                    React.createElement(SynchroNotifications, { syncErrors: this.props.syncErrors, transactions: this.props.transactions, syncRunning: this.props.syncRuning })),
                React.createElement("div", { className: styles.panelItem },
                    React.createElement(Icon, { iconName: this.props.isConnected ? "Streaming" : "StreamingOff" })),
                React.createElement("div", { className: styles.panelItem },
                    React.createElement(IconButton, { title: this.state.fullscreen ? strings.FullscreenLabel : strings.AbortFullScreenLabel, iconProps: { iconName: this.state.fullscreen ? "BackToWindow" : "FullScreen" }, onClick: this.onToggleFullscreenClick }))));
    };
    return HeaderBar;
}(React.Component));
export { HeaderBar };
//# sourceMappingURL=HeaderBar.js.map