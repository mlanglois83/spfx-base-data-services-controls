import * as React from "react";
import { OfflineTransaction } from "spfx-base-data-services";

export interface IHeaderBarProps {  
    className?: string;  
    homeButtonHideUrls?: Array<string>;
    homeUrl?: string;
    disableOfflineActions?: boolean;
    isConnected?: boolean;
    transactions?: Array<OfflineTransaction>;
    syncErrors?: Array<string>;
    syncRuning?: boolean;    
    contentContainer: HTMLDivElement | React.RefObject<HTMLDivElement>;    
    onFullscreenChanged?: (fullscreen: boolean) => void;
}