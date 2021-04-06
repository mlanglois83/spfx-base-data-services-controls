export interface IHeaderBarState {
    className?: string;
    fullscreen: boolean;
    title: string;
    actions?: Map<string,IActionsGroup>;
}

export interface IActionsGroup {
    order?: number;
    actions:  () => Array<JSX.Element | "separator">;    
}