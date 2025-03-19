import { Injectable } from '@angular/core';

// rxjs
import { filter, Observable, take } from 'rxjs';

// store
import { select, Store } from '@ngrx/store';

// models
import {
    ICreateCommentMetadata,
    IGetLoadListParam,
    IGetLoadTemplateParam,
    ILoadGridItem,
} from '@pages/load/pages/load-table/models/index';
import { ITableData } from '@shared/models/table-data.model';

import {
    Column,
    ICurrentSearchTableData,
    ITableColummn,
    ITableOptions,
} from '@shared/models';
import {
    BrokerByIdResponse,
    CreateCommentCommand,
    CreateLoadTemplateCommand,
    LoadListResponse,
    LoadModalResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
    LoadStatusType,
    LoadTemplateListResponse,
    RevertLoadStatusCommand,
    ShipperLoadModalResponse,
    UpdateLoadStatusCommand,
} from 'appcoretruckassist';
import { IActiveLoadModalData, Load } from '@pages/load/models';
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models';
import { BrokerContactExtended } from '@pages/customer/pages/broker-modal/models';

// selectors
import {
    activeLoadModalDataSelector,
    activeTableDataSelector,
    activeViewModeSelector,
    columnsSelector,
    getDispatcherListSelector,
    getStatusListSelector,
    getSelector,
    selectedTabSelector,
    staticModalDataSelector,
    tableDataSelector,
    tableOptionsSelector,
    viewDataSelector,
    loadDetailsSelector,
    isLoadDetailsLoadedSelector,
    activeLoadModalPossibleStatusesSelector,
} from '@pages/load/state/selectors/load.selector';

// constants
import { LoadStoreConstants } from '@pages/load/pages/load-table/utils/constants/index';

// enums
import { eActiveViewMode } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';

import { IFilterDropdownList } from 'ca-components';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(private store: Store) {}

    public resolveInitialData$: Observable<
        LoadListResponse | LoadTemplateListResponse
    > = this.store.pipe(
        select(getSelector),
        filter((data) => !!data),
        take(1)
    );

    public viewData$: Observable<ILoadGridItem[]> = this.store.pipe(
        select(viewDataSelector)
    );

    public tableData$: Observable<ITableData[]> = this.store.pipe(
        select(tableDataSelector)
    );

    public columns$: Observable<ITableColummn[]> = this.store.pipe(
        select(columnsSelector)
    );

    public selectedTab$: Observable<eLoadStatusType> = this.store.pipe(
        select(selectedTabSelector)
    );

    public activeViewMode$: Observable<string> = this.store.pipe(
        select(activeViewModeSelector)
    );

    public tableOptions$: Observable<ITableOptions> = this.store.pipe(
        select(tableOptionsSelector)
    );

    public activeTableData$: Observable<ITableData> = this.store.pipe(
        select(activeTableDataSelector)
    );

    public dispatcherList$: Observable<IFilterDropdownList[]> = this.store.pipe(
        select(getDispatcherListSelector)
    );

    public statusList$: Observable<IFilterDropdownList[]> = this.store.pipe(
        select(getStatusListSelector)
    );

    public staticModalData$: Observable<LoadModalResponse> = this.store.pipe(
        select(staticModalDataSelector)
    );

    public activeLoadModalData$: Observable<IActiveLoadModalData> =
        this.store.pipe(select(activeLoadModalDataSelector));

    public activeLoadModalPossibleStatuses$: Observable<LoadPossibleStatusesResponse> =
        this.store.pipe(select(activeLoadModalPossibleStatusesSelector));

    public resolveLoadDetails$: Observable<LoadResponse> = this.store.pipe(
        select(loadDetailsSelector)
    );

    public isLoadDetailsLoaded$: Observable<boolean> = this.store.pipe(
        select(isLoadDetailsLoadedSelector)
    );

    public dispatchLoadList(
        apiParam: IGetLoadListParam,
        showMore?: boolean,
        onSearch?: ICurrentSearchTableData
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST,
            apiParam,
            showMore,
            onSearch,
        });
    }

    public dispatchLoadDetails(loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_LOAD_DETAILS_TO_UNLOAD,
        });

        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_DETAILS_BY_ID,
            loadId,
        });
    }

    public loadDispatchFilters(apiParam: IGetLoadListParam): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_DISPATCHER_LIST,
            loadStatusType: apiParam.loadStatusType,
        });

        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_STATUS_FILTER,
            loadStatusType: apiParam.loadStatusType,
        });
    }

    public dispatchLoadTemplateList(
        apiParam: IGetLoadTemplateParam,
        showMore?: boolean,
        onSearch?: ICurrentSearchTableData
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES,
            apiParam,
            showMore,
            onSearch,
        });
    }

    public dispatchGetList(
        apiParam: IGetLoadListParam | IGetLoadTemplateParam,
        selectedTab: eLoadStatusType,
        showMore?: boolean
    ): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchLoadTemplateList(apiParam, showMore);
        else this.dispatchLoadList(apiParam, showMore);
    }

    public dispatchGetLoadStatusFilter(apiParam: LoadStatusType): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_STATUS_FILTER,
            apiParam,
        });
    }

    public dispatchSelectedTab(selectedTab: eLoadStatusType): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_SELECTED_TAB,
            selectedTab,
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode,
        });
    }

    public dispatchUpdateLoadStatus(apiParam: UpdateLoadStatusCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
            apiParam,
        });
    }

    public dispatchUpdateloadStatusConfirmation(
        confirmation: ConfirmationActivation
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
            confirmation,
        });
    }

    public dispatchUpdateLoadStatusSignalR(response: LoadListResponse): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_SIGNALR,
            response,
        });
    }

    public dispatchRevertLoadStatus(apiParam: RevertLoadStatusCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_REVERT_LOAD_STATUS,
            apiParam,
        });
    }

    public dispatchUpdateOrRevertLoadStatus(
        param: UpdateLoadStatusCommand | RevertLoadStatusCommand,
        isRevert: boolean
    ): void {
        if (isRevert) this.dispatchRevertLoadStatus(param);
        else this.dispatchUpdateLoadStatus(param);
    }

    public dispatchSaveValueNote(entityId: number, value: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SAVE_NOTE,
            entityId,
            value,
        });
    }

    public dispatchDeleteCommentById(apiParam: number, loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_COMMENT_BY_ID,
            apiParam,
            loadId,
        });
    }

    public dispatchDeleteLoadTemplateById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_LOAD_TEMPLATE_BY_ID,
            apiParam: id,
        });
    }

    public dispatchDeleteLoadById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_LOAD_BY_ID,
            apiParam: id,
        });
    }

    public dispatchDeleteLoadOrTemplateById(
        id: number,
        selectedTab: eLoadStatusType
    ): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchDeleteLoadTemplateById(id);
        else this.dispatchDeleteLoadById(id);
    }

    public dispatchDeleteBulkLoadTemplates(ids: number[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_BULK_LOAD_TEMPLATE,
            apiParam: ids,
        });
    }

    public dispatchDeleteBulkLoads(ids: number[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_BULK_LOAD,
            apiParam: ids,
        });
    }

    public dispatchBulkDeleteBulkLoadsOrTemplates(
        ids: number[],
        selectedTab: eLoadStatusType
    ): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchDeleteBulkLoadTemplates(ids);
        else this.dispatchDeleteBulkLoads(ids);
    }

    public dsipatchCanDeleteSelectedDataRows(
        canDeleteSelectedDataRows: boolean,
        ids: number[]
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CAN_DELETE_SELECTED_DATA_ROWS,
            canDeleteSelectedDataRows,
            ids,
        });
    }

    public dispatchActionItemId(actionItemId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_BY_ID_LOCAL,
            actionItemId,
        });
    }

    public dispatchTableColumnToggled(column: Column): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TABLE_COLUMN_TOGGLE,
            column,
        });
    }

    public dispatchTableColumnReset(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESET_COLUMNS,
        });
    }

    public dispatchTableUnlockToggle(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TABLE_UNLOCK_TOGGLE,
        });
    }

    public dispatchTableColumnResize(
        columns: ITableColummn[],
        width: number,
        index: number
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESIZE_COLUMN,
            columns,
            width,
            index,
        });
    }

    public dispatchGetLoadById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_BY_ID,
            apiParam: id,
        });
    }

    public dispatchGetLoadTemplateById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_TEMPLATE_BY_ID,
            apiParam: id,
        });
    }

    public dispatchCreateLoad(apiParam: Load): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CREATE_LOAD,
            apiParam,
        });
    }

    public dispatchCreateLoadTemplate(
        apiParam: CreateLoadTemplateCommand
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CREATE_LOAD_TEMPLATE,
            apiParam,
        });
    }

    public dispatchCreateComment(
        apiParam: CreateCommentCommand,
        metadata: ICreateCommentMetadata
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CREATE_COMMENT,
            apiParam,
            metadata,
        });
    }

    public dispatchUpdateLoad(apiParam: Load): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD,
            apiParam,
        });
    }

    public dispatchUpdateLoadTemplate(
        apiParam: CreateLoadTemplateCommand
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_TEMPLATE,
            apiParam,
        });
    }

    public dispatchUpdateLoadAndStatus(
        apiParamLoad: Load,
        apiParamStatus: UpdateLoadStatusCommand
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_AND_STATUS,
            apiParamLoad,
            apiParamStatus,
        });
    }

    public dispatchRevertStatusAndUpdateLoad(
        apiParamLoad: Load,
        apiParamStatus: RevertLoadStatusCommand
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_AND_REVERT_STATUS,
            apiParamLoad,
            apiParamStatus,
        });
    }

    public dispatchUpdateOrRevertStatusAndUpdateLoad(
        apiParamStatus: UpdateLoadStatusCommand | RevertLoadStatusCommand,
        apiParamLoad: Load,
        isRevert?: boolean
    ) {
        if (isRevert)
            this.dispatchRevertStatusAndUpdateLoad(
                apiParamLoad,
                apiParamStatus
            );
        else this.dispatchUpdateLoadAndStatus(apiParamLoad, apiParamStatus);
    }

    public dispatchGetEditLoadModalData(
        apiParam: number,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_EDIT_LOAD_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType,
        });
    }

    public dispatchGetEditLoadTemplateModalData(
        apiParam: number,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType,
        });
    }

    public dispatchGetEditLoadOrTemplateModalData(
        apiParam: number,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchGetEditLoadTemplateModalData(
                apiParam,
                selectedTab,
                eventType
            );
        else
            this.dispatchGetEditLoadModalData(apiParam, selectedTab, eventType);
    }

    public dispatchGetCreateLoadModalData(
        brokerToAdd?: BrokerByIdResponse
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_CREATE_LOAD_MODAL_DATA,
            brokerToAdd,
        });
    }

    public dispatchGetConvertToLoadModalData(
        apiParam: number,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType,
        });
    }

    public dispatchGetConvertToLoadTemplateModalData(
        apiParam: number,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType,
        });
    }

    public dispatchGetConvertToLoadOrTemplateModalData(
        apiParam: number,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchGetConvertToLoadModalData(
                apiParam,
                selectedTab,
                eventType
            );
        else
            this.dispatchGetConvertToLoadTemplateModalData(
                apiParam,
                selectedTab,
                eventType
            );
    }

    public dispatchSetActiveLoadModalData(data: IActiveLoadModalData): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_ACTIVE_LOAD_MODAL_DATA,
            data,
        });
    }

    public dispatchAddNewBrokerToStaticModalData(
        broker: BrokerByIdResponse
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ADD_CREATED_BROKER_STATIC_MODAL_DATA,
            broker,
        });
    }

    public dispatchAddnewShipperToStaticModalData(
        shipper: ShipperLoadModalResponse
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ADD_CREATED_SHIPPER_STATIC_MODAL_DATA,
            shipper,
        });
    }

    public dispatchUpdateEditedBrokerStaticModalData(
        broker: BrokerByIdResponse,
        brokerContacts: BrokerContactExtended[]
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_EDITED_BROKER_STATIC_MODAL_DATA,
            broker,
            brokerContacts,
        });
    }
}
