import * as strings from 'ControlsStrings';
import { IconButton, Icon, css } from 'office-ui-fabric-react';
import * as React from 'react';
import { IHeaderBarProps } from "./interfaces/IHeaderBarProps";
import { IHeaderBarState } from "./interfaces/IHeaderBarState";
import styles from './HeaderBar.module.scss';
import { HashRouter, Switch, Route, WithRouter } from "react-router-dom";
import { SynchroNotifications } from "./components/synchroNotifications/SynchroNotifications";
import { stringIsNullOrEmpty } from '@pnp/common';
/**
 * Control to select disable state and associated dates of a risk
 */
export class HeaderBar extends React.Component<IHeaderBarProps, IHeaderBarState> {

  public static setTitle(newTitle: string){
    var event = new CustomEvent<string>('setHeaderTitle', {detail: newTitle});
    document.dispatchEvent(event);
  }

  /**
   * Construct RiskStateSelector control
   * @param props control properties (see IRiskStateSelectorProps)
   */
  constructor(props: IHeaderBarProps) {
    super(props);
    // set initial state
    this.state = {
      fullscreen: this.isFullScreen(),
      title: ""
    };
  }

  

  public componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    window.addEventListener('keydown', this.onWindowKeypress);
    document.addEventListener("setHeaderTitle", this.setTitle);
  }
  public componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("keydown", this.onWindowKeypress);
    document.removeEventListener("setHeaderTitle", this.setTitle);
  }

  private setTitle = (event: CustomEvent) => {
    this.setState({title: event.detail});
  }

  /**
   * Render control
   */
  public render(): React.ReactElement<IHeaderBarProps> {
    const {title} = this.state;
    return <div className={styles.stickyHeader}>
      <div className={styles.headerLeftPanel}>
        <HashRouter>
          <Switch>
            {this.props.homeButtonHideUrls && this.props.homeButtonHideUrls.map((url) => {
              return <Route
                path={url}
                component={() => <></>}
              />;
            })}   
            <Route
              component={({ history }) => <div className={styles.panelItem}>
                <IconButton iconProps={{ iconName: "Home" }} title={strings.NavHomeText} onClick={() => { history.push(this.props.homeUrl); }} />
              </div>} />
          </Switch>
        </HashRouter>
        {!stringIsNullOrEmpty(title) && <div className={css(styles.panelItem, styles.titleBlock)}>
          <div className={styles.headerTitle}>
            {title}
          </div>
        </div>}
      </div>
      <div className={styles.headerRightPanel}>            
        <div className={styles.panelItem}>
          <SynchroNotifications syncErrors={this.props.syncErrors} transactions={this.props.transactions} syncRunning={this.props.syncRuning} />
        </div>
        <div className={styles.panelItem}>
          <Icon iconName={this.props.isConnected ? "Streaming" : "StreamingOff"} />
        </div>
        <div className={styles.panelItem}>
          <IconButton
            title={this.state.fullscreen ? strings.FullscreenLabel : strings.AbortFullScreenLabel}
            iconProps={{ iconName: this.state.fullscreen ? "BackToWindow" : "FullScreen" }}
            onClick={this.onToggleFullscreenClick} />
        </div>
      </div>
    </div>;
  }

  private onToggleFullscreenClick = () => {
    if (!document["fullscreenElement"] && /* Standard syntax */
      !document['webkitFullscreenElement'] && /* Chrome, Safari and Opera syntax */
      !document['mozFullScreenElement'] &&/* Firefox syntax */
      !document['msFullscreenElement'] /* IE/Edge syntax */) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement["mozRequestFullScreen"]) {
        document.documentElement["mozRequestFullScreen"]();
      } else if (document.documentElement["webkitRequestFullScreen"]) {
        document.documentElement["webkitRequestFullScreen"]();
      } else if (document.documentElement["msRequestFullscreen"]) {
        document.documentElement["msRequestFullscreen"]();
      }
    }
    else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document["webkitExitFullscreen"]) {
        document["webkitExitFullscreen"]();
      } else if (document["mozCancelFullScreen"]) {
        document["mozCancelFullScreen"]();
      } else if (document["msExitFullscreen"]) {
        document["msExitFullscreen"]();
      }      
    }
  }

  private isFullScreen = () => {
    var maxHeight = window.screen.height,
    maxWidth = window.screen.width,
    curHeight = window.innerHeight,
    curWidth = window.innerWidth;
    return maxWidth == curWidth && maxHeight == curHeight;
  }
  private onWindowResize = () => {
    const fullscreen = this.isFullScreen();
    if(fullscreen !== this.state.fullscreen) {
      this.adaptDomElements(fullscreen);
      this.setState({fullscreen: fullscreen}, () =>{
        if(this.props.onFullscreenChanged) {
          this.props.onFullscreenChanged(fullscreen);
        }
      });
    }
  }
  private onWindowKeypress = (event) => {
    // override f11
    if(event.which === 122) {
      event.preventDefault();
      this.onToggleFullscreenClick();
    }
  }

  private adaptDomElements = (fullscreen: boolean) => {
    if (fullscreen) {
      let suiteNavWrapper = document.getElementById("SuiteNavWrapper");
      if (suiteNavWrapper) {
        suiteNavWrapper.style.display = "none";
      }
      let headerHost = document.querySelector("div[data-sp-feature-tag='Site header host']");
      if(headerHost) {
        headerHost['style'].display = 'none';
      }
      let banner = document.querySelector('[role=banner]');
      if (banner) {
        banner['style'].display = 'none';
      }
      let nav = document.getElementById("SuiteNavPlaceHolder");
      if (nav) {
        nav.style.display = "none";
      }
      let commandBar = document.getElementsByClassName("commandBarWrapper");
      if (commandBar && commandBar.length > 0) {
        commandBar[0]['style'].display = "none";
      }
      let CanvasZone = document.getElementsByClassName("CanvasZone");
      if (CanvasZone && CanvasZone.length > 0) {
        CanvasZone[0]['style'].padding = "0";
        CanvasZone[0]['style'].margin = "0";
        CanvasZone[0]['style'].maxWidth = "100%";
      }
      let CanvasSection = document.getElementsByClassName("CanvasSection");
      if (CanvasSection && CanvasSection.length > 0) {
        CanvasSection[0]['style'].padding = "0";
        CanvasSection[0]['style'].margin = "0";
      }
      let ControlZone = document.getElementsByClassName("ControlZone");
      if (ControlZone && ControlZone.length > 0) {
        ControlZone[0]['style'].padding = "0";
        ControlZone[0]['style'].margin = "0";
      }
      if (this.props.contentContainer) {
        this.props.contentContainer.style.height = "calc(100vh - 52px)";
        this.props.contentContainer.style.overflow = "auto";
        let scrollDiv = document.querySelector("div[data-is-scrollable='true']") as HTMLDivElement;
        if (scrollDiv) {
          scrollDiv.style.overflow = "hidden";
        }
      }
    }
    else {
      let suiteNavWrapper = document.getElementById("SuiteNavWrapper");
      if (suiteNavWrapper) {
        suiteNavWrapper.style.display = "block";
      }
      let headerHost = document.querySelector("div[data-sp-feature-tag='Site header host']");
      if(headerHost) {
        headerHost['style'].display = 'block';
      }
      let banner = document.querySelector('[role=banner]');
      if (banner) {
        banner['style'].display = 'flex';
      }
      let nav = document.getElementById("SuiteNavPlaceHolder");
      if (nav) {
        nav.style.display = "block";
      }
      let commandBar = document.getElementsByClassName("commandBarWrapper");
      if (commandBar && commandBar.length > 0) {
        commandBar[0]['style'].display = "block";
      }

      let CanvasZone = document.getElementsByClassName("CanvasZone");
      if (CanvasZone && CanvasZone.length > 0) {
        CanvasZone[0]['style'].padding = null;
        CanvasZone[0]['style'].margin = null;
        CanvasZone[0]['style'].maxWidth = null;
      }
      let CanvasSection = document.getElementsByClassName("CanvasSection");
      if (CanvasSection && CanvasSection.length > 0) {
        CanvasSection[0]['style'].padding = null;
        CanvasSection[0]['style'].margin = null;
      }
      let ControlZone = document.getElementsByClassName("ControlZone");
      if (ControlZone && ControlZone.length > 0) {
        ControlZone[0]['style'].padding = null;
        ControlZone[0]['style'].margin = null;
      }
      if (this.props.contentContainer) {
        this.props.contentContainer.style.height = "auto";
        this.props.contentContainer.style.overflow = null;
        let scrollDiv = document.querySelector("div[data-is-scrollable='true']") as HTMLDivElement;
        if (scrollDiv) {
          scrollDiv.style.overflow = null;
        }
      }
    }
  }



}