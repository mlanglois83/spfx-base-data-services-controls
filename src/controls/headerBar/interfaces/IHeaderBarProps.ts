import { OfflineTransaction } from "spfx-base-data-services";

export interface IHeaderBarProps {  
    className?: string;  
    homeButtonHideUrls?: Array<string>;
    homeUrl: string;
    isConnected: boolean;
    transactions: Array<OfflineTransaction>;
    syncErrors: Array<string>;
    syncRuning: boolean;    
    contentContainer: HTMLDivElement;    
    selectedTeam?: string;
    location: any;
    onFullscreenChanged?: (fullscreen: boolean) => void;
}