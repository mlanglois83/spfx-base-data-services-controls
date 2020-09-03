import * as strings from 'SpfxBaseDataServicesControlsStrings';
import * as React from 'react';

import { IconButton, Icon, Callout, DirectionalHint, List, SelectionMode, DetailsListLayoutMode, DetailsList, IDetailsRowProps, IDetailsRowStyles, DetailsRow, css } from 'office-ui-fabric-react';
import { ISynchroNotificationsProps } from "./interfaces/ISynchroNotificationsProps";
import { ISynchroNotificationsState } from "./interfaces/ISynchroNotificationsState";
import styles from "../HeaderBar.module.scss";
import { OfflineTransaction, SPFile,  IBaseItem, TransactionType, ServicesConfiguration } from 'spfx-base-data-services';
import { assign } from '@microsoft/sp-lodash-subset';

/**
 * Control to select disable state and associated dates of a risk
 */
export default class SynchroNotifications extends React.Component<ISynchroNotificationsProps, ISynchroNotificationsState> {
    private calloutButtonElement: HTMLDivElement;

    private columns = [
        {
            key: 'elementTypeCol',
            name: strings.ElementTypeColumnLabel,
            fieldName: 'itemType',
            minWidth: 80,
            isRowHeader: true,
            isResizable: false,
            isSorted: false,
            onRender: (item: OfflineTransaction) => {
                return <span>{ServicesConfiguration.configuration.translations.typeTranslations[item.itemType]}</span>;
            }
        },
        {
            key: 'operationCol',
            name: strings.OperationColumnLabel,
            fieldName: 'title',
            minWidth: 80,
            isRowHeader: true,
            isResizable: false,
            isSorted: false,
            onRender: (transaction: OfflineTransaction) => {
                let operationLabel: string;
                let itemType = ServicesConfiguration.configuration.serviceFactory.getItemTypeByName(transaction.itemType);
                let item = assign(new itemType(), transaction.itemData);
                switch (transaction.title) {
                    case TransactionType.AddOrUpdate:
                        if(item instanceof SPFile) {
                            operationLabel = strings.UploadLabel;
                        }
                        else if(item.id < 0) {
                            operationLabel = strings.AddLabel;
                        }
                        else {
                            operationLabel = strings.UpdateLabel;
                        }
                        break;
                    case TransactionType.Delete:
                        operationLabel = strings.DeleteLabel;                
                        break;
                    default: break;
                }
                return <span>{operationLabel}</span>;
            }
        },
        {
            key: 'titleColumn',
            name: strings.titleLabel,
            fieldName: 'itemData',
            minWidth: 250,
            isRowHeader: true,
            isResizable: false,
            isSorted: false,
            onRender: (item: OfflineTransaction) => {
                return <span>{item.itemData.title}</span>;
            }
        },
        {
            key: 'idColumn',
            name: strings.IdColumnLabel,
            fieldName: 'id',
            minWidth: 50,
            maxWidth: 50,
            isRowHeader: true,
            isResizable: false,
            isSorted: false,
            onRender: (item: OfflineTransaction) => {
                return (item.itemData.id > 0 ? <span>{item.itemData.id}</span> : null);
            }
        }
    ];

    /**
     * Construct RiskStateSelector control
     * @param props control properties (see IRiskStateSelectorProps)
     */
    constructor(props: ISynchroNotificationsProps) {
        super(props);
        // set initial state
        this.state = {
            isCalloutVisible: false
        };
    }

    public async componentDidMount() {
    }



    /**
     * Render control
     */
    public render(): React.ReactElement<ISynchroNotificationsProps> {        
        const {isCalloutVisible} = this.state;
        const {syncErrors, transactions, syncRunning} = this.props;
        return <div>   
           <div ref={(elt) => { this.calloutButtonElement = elt; }} className={styles.syncButtonContainer}>
                <IconButton iconProps={{iconName:"Sync"}} onClick={() => { this.setState({ isCalloutVisible: true }); }} className={syncRunning ? styles.synchronizing : ""} />
                {transactions && transactions.length > 0 &&
                 <div className={styles.transactionCount}><div className={styles.counterValue}>{transactions.length}</div></div>}
                 {syncErrors && syncErrors.length > 0 &&
                  <div className={styles.syncErrorsCount}><div className={styles.counterValue}>{syncErrors.length}</div></div>}
            </div>
            {isCalloutVisible ? (
                <Callout
                    onDismiss={this.onCalloutDismiss}
                    target={this.calloutButtonElement}
                    directionalHint={DirectionalHint.bottomRightEdge}
                    coverTarget={false}
                    isBeakVisible={true}
                    gapSpace={0}
                >
                    <div className={css(styles.callout, styles.syncNotifCallout)}>                        
                        <h3 className={styles.formTitle}>{strings.PendingTransactionsLabel}</h3>
                        <div className={styles.formField} >
                            {transactions && transactions.length ?                            
                            <DetailsList 
                                onRenderRow={this.onRenderRow}
                                items={transactions}
                                compact={true}
                                columns={this.columns}
                                selectionMode={SelectionMode.none}
                                layoutMode={DetailsListLayoutMode.justified}
                                isHeaderVisible={true}
                            />
                            :
                            <div className={styles.emptyMessage}>{strings.NoTransactionsLabel}</div>
                            }
                        </div>                    
                        <h3 className={styles.formTitle}>{strings.TransactionErrorsLabel}</h3>
                        <div className={styles.formField} >
                            {syncErrors && syncErrors.length ?
                            <List items={syncErrors} onRenderCell={this.renderErrors} /> :
                            <div className={styles.emptyMessage}>{strings.NoSyncErrorsLabel}</div> 
                            }
                        </div>
                    </div>
                </Callout>
            ) : null}
        </div>;
    }

    private onRenderRow = (props: IDetailsRowProps): JSX.Element => {
        const customStyles: Partial<IDetailsRowStyles> = {};
        if (props.itemIndex % 2 === 0) {
            // Every other row renders with a different background color
            customStyles.root = { backgroundColor: "white" };
        }

        return <DetailsRow {...props} styles={customStyles} />;
    }
    private renderErrors = (item?, index?: number) => {
        return <div className={styles.syncErrorRow + (index % 2 === 0 ? (" " + styles.alternateRow): "")} dangerouslySetInnerHTML={{__html:item}}>
            </div>;
    }
    /**
     * close callout
     */
    private onCalloutDismiss = () => {
        this.setState({ isCalloutVisible: false });
    }
}