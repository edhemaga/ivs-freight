import { createReducer, on } from '@ngrx/store';

// appcoretruckassist
import { CommentResponse, LoadListDto, LoadListResponse, LoadModalResponse, LoadResponse, LoadStatus, LoadStatusResponse, LoadTemplateResponse, TableType } from 'appcoretruckassist';

// models
import { ILoadState } from '@pages/load/pages/load-table/models/load-state.model';
import { ILoadGridItem, ILoadTemplateGridItem } from '@pages/load/pages/load-table/models/index';

// actions
import * as LoadActions from '@pages/load/pages/load-table/store/actions/load.action';

// enums
import { eActiveViewMode, eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// functions
import * as Functions from '@pages/load/pages/load-table/utils/functions/load-reducer.functions';

export const initialState: ILoadState = {
    data: [],

    modal: {},

    pendingCount: 0,
    activeCount: 0,
    closedCount: 0,
    templateCount: 0,

    canDeleteSelectedDataRows: false,
    selectedTab: eLoadStatusType.Active,
    activeViewMode: eActiveViewMode.List
};

export const loadReducer = createReducer(
    initialState,

// #region GET
    on(LoadActions.getLoadsPayload, (state) => {
        const { data } = state || {};
        const _data: ILoadGridItem[] = Functions.initializeLoadGridItems(data);

        const result: ILoadState = {
            ...state,
            data: _data
        };

        return result;
    }),
    on(LoadActions.getLoadsPayloadSuccess, (state, { data, templateCount, pendingCount, activeCount, closedCount, selectedTab, showMore }) => {
        const { data: stateData } = state || {};
        let _data: ILoadGridItem[] = Functions.initializeLoadGridItems(data);

        if (showMore) _data = [...stateData, ..._data];

        const result: ILoadState = { 
            ...state, 
            data: _data, 
            templateCount, 
            pendingCount, 
            activeCount, 
            closedCount, 
            selectedTab 
        };
        
        return result;
    }),
    on(LoadActions.getLoadsPayloadError, (state) => ({ ...state })),

    on(LoadActions.getTemplatesPayload, (state) => ({ ...state })),
    on(LoadActions.getTemplatesPayloadSuccess, (state, { data, templateCount, pendingCount, activeCount, closedCount, selectedTab }) => {
        const _data: ILoadTemplateGridItem[] = Functions.initializeLoadGridItems(data);

        const result: ILoadState = { 
            ...state, 
            data: _data, 
            templateCount, 
            pendingCount, 
            activeCount, 
            closedCount, 
            selectedTab 
        };
        
        return result;
    }),
    on(LoadActions.getTemplatesPayloadError, (state) => ({ ...state })),

    on(LoadActions.getLoadById, (state) => ({ ...state })),
    on(LoadActions.getLoadByIdSuccess, (state, { load }) => Functions.getLoadByIdSuccessResult(state, load)),
    on(LoadActions.getLoadByIdError, (state) => ({ ...state })),

    on(LoadActions.getEditLoadModalData, (state) => ({ ...state })),
    on(LoadActions.getEditLoadModalDataSuccess, (state, { load, modal }) => Functions.getLoadModalDataSuccessResult(state, modal, load)),
    on(LoadActions.getEditLoadModalDataError, (state) => ({ ...state })),

    on(LoadActions.getCreateLoadModalData, (state) => ({ ...state })),
    on(LoadActions.getCreateLoadModalDataSuccess, (state, { modal }) => Functions.getLoadModalDataSuccessResult(state, modal)),
    on(LoadActions.getCreateLoadModalDataError, (state) => ({ ...state })),

    on(LoadActions.getConvertToLoadModalData, (state) => ({ ...state })),
    on(LoadActions.getConvertToLoadModalDataSuccess, (state, { modal }) => ({ ...state, modal })),
    on(LoadActions.getConvertToLoadModalDataError, (state) => ({ ...state })),

    on(LoadActions.getConvertToLoadTemplateModalData, (state) => ({ ...state })),
    on(LoadActions.getConvertToLoadTemplateModalDataSuccess, (state, { modal }) => ({ ...state, modal })),
    on(LoadActions.getConvertToLoadTemplateModalDataError, (state) => ({ ...state })),
// #endregion

// #region CREATE
    on(LoadActions.createComment, (state) => ({ ...state })),
    on(LoadActions.createCommentSuccess, (state, { loadId, comment, metadata }) => Functions.createCommentSuccessResult(state, loadId, comment, metadata)),
    on(LoadActions.createCommentError, (state) => ({ ...state })),

    on(LoadActions.createLoad, (state) => ({ ...state })),
    on(LoadActions.createLoadSuccess, (state, { load }) => Functions.createLoadSuccessResult(state, load)),
    on(LoadActions.createLoadError, (state) => ({ ...state })),

    on(LoadActions.createLoadTemplate, (state) => ({ ...state })),
    on(LoadActions.createLoadTemplateSuccess, (state, { loadTemplate }) => Functions.createLoadTemplateSuccessResult(state, loadTemplate)),
    on(LoadActions.createLoadTemplateError, (state) => ({ ...state })),
// #endregion

// #region UPDATE
    on(LoadActions.updateLoadStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadStatusSuccess, (state, { loadId, status }) => Functions.updateLoadStatusSuccessResult(state, loadId, status)),
    on(LoadActions.updateLoadStatusError, (state) => ({ ...state })),

    on(LoadActions.updateLoadStatusSignalR, (state, { response }) => Functions.updateLoadStatusSignalRSuccess(state, response)),

    on(LoadActions.revertLoadStatus, (state) => ({ ...state })),
    on(LoadActions.revertLoadStatusSuccess, (state, { loadId, status }) => Functions.updateLoadStatusSuccessResult(state, loadId, status)),
    on(LoadActions.revertLoadStatusError, (state) => ({ ...state })),

    on(LoadActions.updateLoad, (state) => ({ ...state })),
    on(LoadActions.updateLoadSuccess, (state, { load }) => Functions.updateLoadAndTemplateSuccessResult(state, load)),
    on(LoadActions.updateLoadError, (state) => ({ ...state })),

    on(LoadActions.updateLoadTemplate, (state) => ({ ...state })),
    on(LoadActions.updateLoadTemplateSuccess, (state, { loadTemplate }) => Functions.updateLoadAndTemplateSuccessResult(state, loadTemplate)),
    on(LoadActions.updateLoadTemplateError, (state) => ({ ...state })),

    on(LoadActions.updateLoadAndStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadAndStatusSuccess, (state, { status, response }) => Functions.updateLoadAndUpdateOrRevertStatusSuccessResult(state, response, status)),
    on(LoadActions.updateLoadAndStatusError, (state) => (state)),

    on(LoadActions.updateLoadAndRevertStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadAndRevertStatusSuccess, (state, { status, response }) => Functions.updateLoadAndUpdateOrRevertStatusSuccessResult(state, response, status)),
    on(LoadActions.updateLoadAndRevertStatus, (state) => ({ ...state })),

    on(LoadActions.saveNote, (state, { entityId, value }) => Functions.saveNoteResult(state, entityId, value)),
// #endregion

// #region DELETE
    on(LoadActions.deleteCommentById, (state) => ({ ...state })),
    on(LoadActions.deleteCommentByIdSuccess, (state, { loadId, commentId }) => Functions.deleteCommentByIdSuccessResult(state, loadId, commentId)),
    on(LoadActions.deleteCommentByIdError, (state) => ({ ...state })),

    on(LoadActions.deleteLoadTemplateById, (state) => ({ ...state })),
    // TODO: Do filtering for success
    on(LoadActions.deleteLoadTemplateByIdSuccess, (state) => ({ ...state })),
    on(LoadActions.deleteCommentByIdError, (state) => ({ ...state })),

    on(LoadActions.deleteLoadById, (state) => ({ ...state })),
    on(LoadActions.deleteLoadByIdSuccess, (state, { loadId }) => Functions.deleteLoadByIdSuccessResult(state, loadId)),
    on(LoadActions.deleteLoadByIdError, (state) => ({ ...state })),

    on(LoadActions.deleteBulkLoad, (state) => ({ ...state })),
    on(LoadActions.deleteBulkLoadSuccess, (state, { ids }) => Functions.deleteBulkLoadSuccessResult(state, ids)),
    on(LoadActions.deleteBulkLoadError, (state) => ({ ...state })),
// #endregion

    on(LoadActions.selectedDataRowsChange, (state, { canDeleteSelectedDataRows, ids }) => Functions.selectedDataRowsChangeResult(state, canDeleteSelectedDataRows, ids)),
    on(LoadActions.tableColumnToggle, (state) => ({ ...state })),
    on(LoadActions.tableColumnReset, (state) => ({ ...state })),
    on(LoadActions.tableUnlockToggle, (state) => ({ ...state })),
    on(LoadActions.tableColumnResize, (state, { columns, width, index }) => Functions.tableColumnResizeResult(state, columns, width, index)),
    on(LoadActions.setActiveViewMode, (state, { activeViewMode }) => ({ ...state, activeViewMode }))
);