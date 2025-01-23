import { Injectable } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

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
import { Column, ICurrentSearchTableData, ITableColummn, ITableOptions } from '@shared/models';
import { CreateCommentCommand, CreateLoadTemplateCommand, LoadListResponse, LoadStatusType, RevertLoadStatusCommand, UpdateLoadStatusCommand } from 'appcoretruckassist';
import { Load } from '@pages/load/models';
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models';

// selectors
import {
    activeTableDataSelector,
    activeViewModeSelector,
    columnsSelector,
    selectedTabSelector,
    tableDataSelector,
    tableOptionsSelector,
    viewDataSelector,
} from '@pages/load/store/selectors/load.selector';

// constants
import { LoadStoreConstants } from '@pages/load/pages/load-table/utils/constants/index';

// enums
import { eActiveViewMode, eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(private store: Store) {}
    
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

    public dispatchLoadList(apiParam: IGetLoadListParam, showMore?: boolean, onSearch?: ICurrentSearchTableData): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST,
            apiParam,
            showMore,
            onSearch
        });
    }

    public dispatchLoadTemplateList(apiParam: IGetLoadTemplateParam, showMore?: boolean, onSearch?: ICurrentSearchTableData): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES,
            apiParam,
            showMore,
            onSearch
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
            apiParam
        });
    }

    public dispatchSelectedTab(selectedTab: eLoadStatusType): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_SELECTED_TAB,
            selectedTab
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode
        });
    }

    public dispatchUpdateLoadStatus(apiParam: UpdateLoadStatusCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
            apiParam
        });
    }

    public dispatchUpdateloadStatusConfirmation(confirmation: ConfirmationActivation): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
            confirmation
        });
    }

    public dispatchUpdateLoadStatusSignalR(response: LoadListResponse): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_SIGNALR,
            response
        });
    }

    public dispatchRevertLoadStatus(apiParam: RevertLoadStatusCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_REVERT_LOAD_STATUS,
            apiParam
        });
    }

    public dispatchUpdateOrRevertLoadStatus(param: UpdateLoadStatusCommand | RevertLoadStatusCommand, isRevert: boolean): void {
        if (isRevert)
            this.dispatchRevertLoadStatus(param);
        else
            this.dispatchUpdateLoadStatus(param);
    }

    public dispatchSaveValueNote(entityId: number, value: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SAVE_NOTE,
            entityId,
            value
        })
    }

    public dispatchDeleteCommentById(apiParam: number, loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_COMMENT_BY_ID,
            apiParam,
            loadId
        });
    }

    public dispatchDeleteLoadTemplateById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_LOAD_TEMPLATE_BY_ID,
            apiParam: id
        });
    }

    public dispatchDeleteLoadById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_LOAD_BY_ID,
            apiParam: id
        });
    }

    public dispatchDeleteLoadOrTemplateById(id: number, selectedTab: eLoadStatusType): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchDeleteLoadTemplateById(id);
        else
            this.dispatchDeleteLoadById(id);
    }

    public dispatchDeleteBulkLoadTemplates(ids: number[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_BULK_LOAD_TEMPLATE,
            apiParam: ids
        });
    }

    public dispatchDeleteBulkLoads(ids: number[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DELETE_BULK_LOAD,
            apiParam: ids
        });
    }

    public dispatchBulkDeleteBulkLoadsOrTemplates(ids: number[], selectedTab: eLoadStatusType): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchDeleteBulkLoadTemplates(ids);
        else
            this.dispatchDeleteBulkLoads(ids);
    }

    public dsipatchCanDeleteSelectedDataRows(canDeleteSelectedDataRows: boolean, ids: number[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CAN_DELETE_SELECTED_DATA_ROWS,
            canDeleteSelectedDataRows,
            ids
        });
    }

    public dispatchActionItemId(actionItemId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_BY_ID_LOCAL,
            actionItemId
        });
    }

    public dispatchTableColumnToggled(column: Column): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TABLE_COLUMN_TOGGLE,
            column
        });
    }

    public dispatchTableColumnReset(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESET_COLUMNS
        })
    }

    public dispatchTableUnlockToggle(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TABLE_UNLOCK_TOGGLE
        })
    }

    public dispatchTableColumnResize(columns: ITableColummn[], width: number, index: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESIZE_COLUMN,
            columns,
            width,
            index
        })
    }

    public dispatchGetLoadById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_BY_ID,
            apiParam: id
        });
    }

    public dispatchGetLoadTemplateById(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_TEMPLATE_BY_ID,
            apiParam: id
        });
    }

    public dispatchCreateLoad(apiParam: Load): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CREATE_LOAD,
            apiParam
        });
    }

    public dispatchCreateLoadTemplate(apiParam: CreateLoadTemplateCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CREATE_LOAD_TEMPLATE,
            apiParam
        });
    }

    public dispatchCreateComment(apiParam: CreateCommentCommand, metadata: ICreateCommentMetadata): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_CREATE_COMMENT,
            apiParam,
            metadata
        });
    }

    public dispatchUpdateLoad(apiParam: Load): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD,
            apiParam
        });
    }

    public dispatchUpdateLoadTemplate(apiParam: CreateLoadTemplateCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_TEMPLATE,
            apiParam
        });
    }

    public dispatchUpdateLoadAndStatus(apiParamLoad: Load, apiParamStatus: UpdateLoadStatusCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_AND_STATUS,
            apiParamLoad,
            apiParamStatus
        })
    }

    public dispatchRevertStatusAndUpdateLoad(apiParamLoad: Load, apiParamStatus: RevertLoadStatusCommand): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_AND_REVERT_STATUS,
            apiParamLoad,
            apiParamStatus
        })
    }

    public dispatchUpdateOrRevertStatusAndUpdateLoad(apiParamStatus: UpdateLoadStatusCommand | RevertLoadStatusCommand, apiParamLoad: Load, isRevert?: boolean) {
        if (isRevert)
            this.dispatchRevertStatusAndUpdateLoad(apiParamLoad, apiParamStatus);
        else
            this.dispatchUpdateLoadAndStatus(apiParamLoad, apiParamStatus);
    }

    public dispatchGetEditLoadModalData(apiParam: number, selectedTab: eLoadStatusType, eventType: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_EDIT_LOAD_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType
        });
    }

    public dispatchGetEditLoadTemplateModalData(apiParam: number, selectedTab: eLoadStatusType, eventType: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType
        });
    }

    public dispatchGetEditLoadOrTemplateModalData(apiParam: number, selectedTab: eLoadStatusType, eventType: string): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchGetEditLoadTemplateModalData(apiParam, selectedTab, eventType);
        else 
            this.dispatchGetEditLoadModalData(apiParam, selectedTab, eventType);
    }

    public dispatchGetCreateLoadModalData(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_CREATE_LOAD_MODAL_DATA
        })
    }

    public dispatchGetConvertToLoadModalData(apiParam: number, selectedTab: eLoadStatusType, eventType: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType
        });
    }

    public dispatchGetConvertToLoadTemplateModalData(apiParam: number, selectedTab: eLoadStatusType, eventType: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA,
            apiParam,
            selectedTab,
            eventType
        })
    }

    public dispatchGetConvertToLoadOrTemplateModalData(apiParam: number, selectedTab: eLoadStatusType, eventType: string): void {
        if (selectedTab === eLoadStatusType.Template)
            this.dispatchGetConvertToLoadModalData(apiParam, selectedTab, eventType);
        else 
            this.dispatchGetConvertToLoadTemplateModalData(apiParam, selectedTab, eventType);
    }
}
