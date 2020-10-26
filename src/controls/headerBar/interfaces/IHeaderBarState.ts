export interface IHeaderBarState {
    fullscreen: boolean;
    title: string;
    actions?: () => Array<JSX.Element | "separator">;
}