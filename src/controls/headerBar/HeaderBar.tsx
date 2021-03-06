import * as strings from 'ControlsStrings';
import { IconButton, Icon, css } from 'office-ui-fabric-react';
import * as React from 'react';
import { IHeaderBarProps } from "./interfaces/IHeaderBarProps";
import { IActionsGroup, IHeaderBarState } from "./interfaces/IHeaderBarState";
import styles from './HeaderBar.module.scss';
import { HashRouter, Switch, Route, WithRouter } from "react-router-dom";
import { SynchroNotifications } from "./components/synchroNotifications/SynchroNotifications";
import { stringIsNullOrEmpty } from '@pnp/common';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { Semaphore, SemaphoreInterface } from "async-mutex";
export interface IActionsEvent {
  key: string;
  actions: () => Array<JSX.Element | "separator">; 
  order?:number;
}
/**
 * Control to select disable state and associated dates of a risk
 */
export class HeaderBar extends React.Component<IHeaderBarProps, IHeaderBarState> {


  private semaphore = new Semaphore(1);
  private semacq: [number, SemaphoreInterface.Releaser] = null;

  public static setTitle(newTitle: string){
    var event = new CustomEvent<string>('setHeaderTitle', {detail: newTitle});
    document.dispatchEvent(event);
  }

  public static setActions(...actionsGroups: IActionsEvent[]){
    var event = new CustomEvent<Array<IActionsGroup>>('setHeaderActions', {detail: actionsGroups});
    document.dispatchEvent(event);
  }
  public static removeActions(...keys: string[]){
    var event = new CustomEvent<Array<string>>('removeHeaderActions', {detail: keys});
    document.dispatchEvent(event);
  }

  private get orderedActionGroups(): Array<() => Array<JSX.Element | "separator">> {
    const groups: Array<IActionsGroup> = [];
    this.state.actions?.forEach(value => { groups.push(value); });
    groups.sort((a: IActionsGroup, b: IActionsGroup) =>{ 
      const anum = (a.order === undefined || a.order === null ? -1 : a.order);
      const bnum = (b.order === undefined || b.order === null ? -1 : b.order);
      return bnum - anum; // reverse order (right to left)
    });
    return groups.map(r => r.actions);
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
    this.adaptDomElements(this.state.fullscreen);
  }

  public componentDidUpdate(prevprops: IHeaderBarProps) {
    if(prevprops.contentContainer !== this.props.contentContainer) {
      this.adaptDomElements(this.state.fullscreen);
    }
  }

  public componentDidMount() {
    document.addEventListener("fullscreenchange", this.onFullScreenChanged);
    document.addEventListener("mozfullscreenchange", this.onFullScreenChanged);
    document.addEventListener("webkitfullscreenchange", this.onFullScreenChanged);
    document.addEventListener("msfullscreenchange", this.onFullScreenChanged);
    window.addEventListener("resize", this.onWindowResize);
    window.addEventListener('keydown', this.onWindowKeypress);
    document.addEventListener("setHeaderTitle", this.setTitle);
    document.addEventListener("setHeaderActions", this.setActions);
    document.addEventListener("removeHeaderActions", this.removeActions);
  }
  public componentWillUnmount() {    
    document.removeEventListener("fullscreenchange", this.onFullScreenChanged);
    document.removeEventListener("mozfullscreenchange", this.onFullScreenChanged);
    document.removeEventListener("webkitfullscreenchange", this.onFullScreenChanged);
    document.removeEventListener("msfullscreenchange", this.onFullScreenChanged);
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("keydown", this.onWindowKeypress);
    document.removeEventListener("setHeaderTitle", this.setTitle);
    document.removeEventListener("setHeaderActions", this.setActions);
    document.removeEventListener("removeHeaderActions", this.removeActions);
  }

  private setTitle = async (event: CustomEvent<string>) => {
    this.semacq = await this.semaphore.acquire();
    this.setState({title: event.detail}, () => {
      this.semacq[1]();
    });
  }
  private setActions = async (event: CustomEvent<Array<IActionsEvent>>) => {
    this.semacq = await this.semaphore.acquire();
    const actions: Map<string, IActionsGroup> = this.state.actions ? cloneDeep(this.state.actions) : new Map<string, IActionsGroup>();
    if(event.detail) {
      event.detail.forEach(ag => {
          actions.set(ag.key, {
          actions: ag.actions,
          order: ag.order
        });
      });
    }
    this.setState({actions: actions}, () => {
      this.semacq[1]();
    });
  }
  private removeActions = async (event: CustomEvent<Array<string>>) => {   
    this.semacq = await this.semaphore.acquire(); 
    const actions: Map<string, IActionsGroup> = this.state.actions ? cloneDeep(this.state.actions) : new Map<string, IActionsGroup>();
    if(event.detail) {
      event.detail.forEach(key => {
        actions.delete(key);
      });
    }    
    this.setState({actions: actions}, () => {
      this.semacq[1]();
    });
  }

  /**
   * Render control
   */
  public render(): React.ReactElement<IHeaderBarProps> {
    const {title} = this.state;
    const actions = this.orderedActionGroups;
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
        {!stringIsNullOrEmpty(title) && <>
          <div className={styles.separator}></div>
          <div className={css(styles.panelItem, styles.titleBlock)}>          
            <div className={styles.headerTitle}>
              {title}
            </div>
          </div>
        </>}
      </div>
      <div className={styles.headerRightPanel}>    
        {actions && actions.length > 0 &&
          <>
            {actions.map(ag=> {
              const agControls = ag();
              if(agControls && agControls.length > 0) {
                return <>
                  {agControls.map(a => {
                    return  a ? 
                    <>
                      {a === "separator" ?
                        <div className={styles.separator}></div>
                      :
                        <div className={styles.panelItem}>
                          {a}
                        </div>
                      }
                    </>
                    : null;
                  })}
                  <div className={styles.separator}></div>
                </>;
              }
              else {
                return null;
              }   
            })}
            
          </>
        }
        <div className={styles.panelItem}>
          <SynchroNotifications syncErrors={this.props.syncErrors} transactions={this.props.transactions} syncRunning={this.props.syncRuning} />
        </div>
        <div className={styles.panelItem}>
          <Icon iconName={this.props.isConnected ? "Streaming" : "StreamingOff"} />
        </div>
        <div className={styles.panelItem}>
          <IconButton
            title={this.state.fullscreen ? strings.AbortFullScreenLabel: strings.FullscreenLabel}
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
    return (document["fullscreenElement"] !== null && document["fullscreenElement"] !== undefined)|| /* Standard syntax */
    (document['webkitFullscreenElement'] !== null && document["webkitFullscreenElement"] !== undefined)|| /* Chrome, Safari and Opera syntax */
    (document['mozFullScreenElement'] !== null && document["mozFullScreenElement"] !== undefined) ||/* Firefox syntax */
    (document['msFullscreenElement'] !== null && document["msFullscreenElement"] !== undefined);/* IE/Edge syntax */
  }
  private onWindowResize = async () => {    
    const fullscreen = this.isFullScreen();
    if(fullscreen !== this.state.fullscreen) {      
      this.semacq = await this.semaphore.acquire(); 
      this.adaptDomElements(fullscreen);
      this.setState({fullscreen: fullscreen}, () =>{        
        this.semacq[1]();
        if(this.props.onFullscreenChanged) {
          this.props.onFullscreenChanged(fullscreen);
        }
      });
    }
  }
  private onFullScreenChanged = async () => {    
    const fullscreen = this.isFullScreen();
    if(fullscreen !== this.state.fullscreen) {      
      this.semacq = await this.semaphore.acquire(); 
      this.adaptDomElements(fullscreen);
      this.setState({fullscreen: fullscreen}, () =>{
        this.semacq[1]();
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
      document.body.className = this.addClass(document.body.className, "fullscreen");
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
      document.body.className = this.removeClass(document.body.className, "fullscreen");
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
  private addClass(classProperty: string, className: string) {
    className = className.trim();
    if(stringIsNullOrEmpty(classProperty)) {
      return className;
    }
    else {
      return this.removeClass(classProperty, className) + " " + className;
    }
  }
  private removeClass(classProperty: string, className: string) {
    className = className.trim();
    if(stringIsNullOrEmpty(classProperty)) {
      return classProperty;
    }
    else {
      classProperty = classProperty.replace(/\s+/g, " ");
      const splited = classProperty.split(" ");      
      let idx = splited.indexOf(className);
      while(idx !== -1)
      {
          splited.splice(idx, 1);
          idx = splited.indexOf(className);
      }
      return splited.join(" ");
    }
  }

}