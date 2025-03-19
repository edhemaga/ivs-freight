// store
import { createReducer, on } from '@ngrx/store';

// models
import { ILoadState } from '@pages/load/pages/load-table/models/load-state.model';

// actions
import * as LoadActions from '@pages/load/state/actions/load.action';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';
import { eActiveViewMode } from '@shared/enums';

// functions
import * as Functions from '@pages/load/pages/load-table/utils/functions/load-reducer.functions';

// #region initialState
export const initialState: ILoadState = {
    data: [],

    modal: null,
    activeModalData: null,
    activeModalPossibleStatuses: null,

    pendingCount: 0,
    activeCount: 0,
    closedCount: 0,
    templateCount: 0,

    canDeleteSelectedDataRows: false,
    selectedTab: eLoadStatusType.Active,
    activeViewMode: eActiveViewMode.List,

    dispatcherList: [],
    statusList: [],

    details: {},
    isLoadDetailsLoaded: false,
};
// #endregion

export const loadReducer = createReducer(
    initialState,

    // #region GET
    on(LoadActions.getLoadsPayload, (state) => ({ ...state })),
    on(
        LoadActions.getLoadsPayloadSuccess,
        (
            state,
            {
                data,
                templateCount,
                pendingCount,
                activeCount,
                closedCount,
                selectedTab,
                showMore,
            }
        ) =>
            Functions.getLoadsOrTemplatesPayloadSuccessResult(
                state,
                data,
                templateCount,
                pendingCount,
                activeCount,
                closedCount,
                selectedTab,
                showMore
            )
    ),
    on(LoadActions.getLoadsPayloadError, (state) => ({ ...state })),

    on(LoadActions.getTemplatesPayload, (state) => ({ ...state })),
    on(
        LoadActions.getTemplatesPayloadSuccess,
        (
            state,
            {
                data,
                templateCount,
                pendingCount,
                activeCount,
                closedCount,
                selectedTab,
                showMore,
            }
        ) =>
            Functions.getLoadsOrTemplatesPayloadSuccessResult(
                state,
                data,
                templateCount,
                pendingCount,
                activeCount,
                closedCount,
                selectedTab,
                showMore
            )
    ),
    on(LoadActions.getTemplatesPayloadError, (state) => ({ ...state })),

    on(LoadActions.getLoadById, (state) => ({ ...state })),
    on(LoadActions.getLoadByIdSuccess, (state, { load }) =>
        Functions.getLoadByIdSuccessResult(state, load)
    ),
    on(LoadActions.getLoadByIdError, (state) => ({ ...state })),

    on(LoadActions.getEditLoadModalData, (state) => ({ ...state })),
    on(
        LoadActions.getEditLoadModalDataSuccess,
        (state, { load, modal, possibleStatuses }) =>
            Functions.getLoadModalDataSuccessResult(
                state,
                modal,
                load as any,
                possibleStatuses
            )
    ), // leave as any for now
    on(LoadActions.getEditLoadModalDataError, (state) => ({ ...state })),

    on(LoadActions.getCreateLoadModalData, (state) => ({ ...state })),
    on(
        LoadActions.getCreateLoadModalDataSuccess,
        (state, { modal, activeLoadModalData }) =>
            Functions.getLoadModalDataSuccessResult(
                state,
                modal,
                activeLoadModalData
            )
    ),
    on(LoadActions.getCreateLoadModalDataError, (state) => ({ ...state })),

    on(LoadActions.getConvertToLoadModalData, (state) => ({ ...state })),
    on(LoadActions.getConvertToLoadModalDataSuccess, (state, { modal, load }) =>
        Functions.getLoadModalDataSuccessResult(state, modal, load as any)
    ), // leave as any for now
    on(LoadActions.getConvertToLoadModalDataError, (state) => ({ ...state })),

    on(LoadActions.getConvertToLoadTemplateModalData, (state) => ({
        ...state,
    })),
    on(
        LoadActions.getConvertToLoadTemplateModalDataSuccess,
        (state, { modal, loadTemplate }) =>
            Functions.getLoadModalDataSuccessResult(
                state,
                modal,
                loadTemplate as any
            )
    ), // leave as any for now
    on(LoadActions.getConvertToLoadTemplateModalDataError, (state) => ({
        ...state,
    })),

    on(LoadActions.getDispatcherList, (state) => ({ ...state })),
    on(LoadActions.getDispatcherListSuccess, (state, { dispatcherList }) =>
        Functions.mapDispatcherSuccessResult(state, dispatcherList)
    ),
    on(LoadActions.getDispatcherListError, (state) => ({ ...state })),

    on(LoadActions.getLoadStatusFilter, (state) => ({ ...state })),
    on(LoadActions.getLoadStatusFilterSuccess, (state, { statusList }) =>
        Functions.mapStatusFilterSuccessResult(state, statusList)
    ),
    on(LoadActions.getLoadStatusFilterError, (state) => ({ ...state })),

    on(LoadActions.getLoadDetails, (state, { details }) =>
        Functions.getLoadDetails(state, details)
    ),
    on(LoadActions.getLoadDetailsError, (state) => ({ ...state })),
    on(LoadActions.setLoadDetailsToUnload, (state) => ({
        ...state,
        isLoadDetailsLoaded: false,
    })),

    // #endregion

    // #region CREATE
    on(LoadActions.createComment, (state) => ({ ...state })),
    on(
        LoadActions.createCommentSuccess,
        (state, { loadId, comment, metadata }) =>
            Functions.createCommentSuccessResult(
                state,
                loadId,
                comment,
                metadata
            )
    ),
    on(LoadActions.createCommentError, (state) => ({ ...state })),

    on(LoadActions.createLoad, (state) => ({ ...state })),
    on(LoadActions.createLoadSuccess, (state, { load }) =>
        Functions.createLoadSuccessResult(state, load)
    ),
    on(LoadActions.createLoadError, (state) => ({ ...state })),

    on(LoadActions.createLoadTemplate, (state) => ({ ...state })),
    on(LoadActions.createLoadTemplateSuccess, (state, { loadTemplate }) =>
        Functions.createLoadTemplateSuccessResult(state, loadTemplate)
    ),
    on(LoadActions.createLoadTemplateError, (state) => ({ ...state })),
    // #endregion

    // #region UPDATE
    on(LoadActions.updateLoadStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadStatusSuccess, (state, { loadId, status }) =>
        Functions.updateLoadStatusSuccessResult(state, loadId, status)
    ),
    on(LoadActions.updateLoadStatusError, (state) => ({ ...state })),

    on(LoadActions.updateLoadStatusSignalR, (state, { response }) =>
        Functions.updateLoadStatusSignalRSuccess(state, response)
    ),

    on(LoadActions.revertLoadStatus, (state) => ({ ...state })),
    on(LoadActions.revertLoadStatusSuccess, (state, { loadId, status }) =>
        Functions.updateLoadStatusSuccessResult(state, loadId, status)
    ),
    on(LoadActions.revertLoadStatusError, (state) => ({ ...state })),

    on(LoadActions.updateLoad, (state) => ({ ...state })),
    on(LoadActions.updateLoadSuccess, (state, { load }) =>
        Functions.updateLoadAndTemplateSuccessResult(state, load)
    ),
    on(LoadActions.updateLoadError, (state) => ({ ...state })),

    on(LoadActions.updateLoadTemplate, (state) => ({ ...state })),
    on(LoadActions.updateLoadTemplateSuccess, (state, { loadTemplate }) =>
        Functions.updateLoadAndTemplateSuccessResult(state, loadTemplate)
    ),
    on(LoadActions.updateLoadTemplateError, (state) => ({ ...state })),

    on(LoadActions.updateLoadAndStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadAndStatusSuccess, (state, { status, response }) =>
        Functions.updateLoadAndUpdateOrRevertStatusSuccessResult(
            state,
            response,
            status
        )
    ),
    on(LoadActions.updateLoadAndStatusError, (state) => state),

    on(LoadActions.updateLoadAndRevertStatus, (state) => ({ ...state })),
    on(
        LoadActions.updateLoadAndRevertStatusSuccess,
        (state, { status, response }) =>
            Functions.updateLoadAndUpdateOrRevertStatusSuccessResult(
                state,
                response,
                status
            )
    ),
    on(LoadActions.updateLoadAndRevertStatus, (state) => ({ ...state })),

    on(LoadActions.saveNote, (state, { entityId, value }) =>
        Functions.saveNoteResult(state, entityId, value)
    ),
    // #endregion

    // #region DELETE
    on(LoadActions.deleteCommentById, (state) => ({ ...state })),
    on(LoadActions.deleteCommentByIdSuccess, (state, { loadId, commentId }) =>
        Functions.deleteCommentByIdSuccessResult(state, loadId, commentId)
    ),
    on(LoadActions.deleteCommentByIdError, (state) => ({ ...state })),

    on(LoadActions.deleteLoadTemplateById, (state) => ({ ...state })),
    // TODO: Do filtering for success
    on(LoadActions.deleteLoadTemplateByIdSuccess, (state) => ({ ...state })),
    on(LoadActions.deleteCommentByIdError, (state) => ({ ...state })),

    on(LoadActions.deleteLoadById, (state) => ({ ...state })),
    on(LoadActions.deleteLoadByIdSuccess, (state, { loadId }) =>
        Functions.deleteLoadByIdSuccessResult(state, loadId)
    ),
    on(LoadActions.deleteLoadByIdError, (state) => ({ ...state })),

    on(LoadActions.deleteBulkLoad, (state) => ({ ...state })),
    on(LoadActions.deleteBulkLoadSuccess, (state, { ids }) =>
        Functions.deleteBulkLoadSuccessResult(state, ids)
    ),
    on(LoadActions.deleteBulkLoadError, (state) => ({ ...state })),
    // #endregion

    on(
        LoadActions.selectedDataRowsChange,
        (state, { canDeleteSelectedDataRows, ids }) =>
            Functions.selectedDataRowsChangeResult(
                state,
                canDeleteSelectedDataRows,
                ids
            )
    ),
    on(LoadActions.tableColumnToggle, (state) => ({ ...state })),
    on(LoadActions.tableColumnReset, (state) => ({ ...state })),
    on(LoadActions.tableUnlockToggle, (state) => ({ ...state })),
    on(LoadActions.tableColumnResize, (state, { columns, width, index }) =>
        Functions.tableColumnResizeResult(state, columns, width, index)
    ),
    on(LoadActions.setActiveViewMode, (state, { activeViewMode }) => ({
        ...state,
        activeViewMode,
    })),

    on(LoadActions.setActveLoadModalData, (state, { data }) => ({
        ...state,
        activeModalData: data,
    })),
    on(LoadActions.resetActiveLoadModalData, (state) => ({
        ...state,
        activeModalData: null,
    })),
    on(LoadActions.addCreatedBrokerStaticModalData, (state, { broker }) =>
        Functions.addCreatedBrokerStaticModalDataResult(state, broker)
    ),
    on(LoadActions.addCreatedShipperStaticModalData, (state, { shipper }) =>
        Functions.addCreatedShipperStaticModalDataResult(state, shipper)
    ),
    on(
        LoadActions.updateEditedBrokerStaticModalData,
        (state, { broker, brokerContacts }) =>
            Functions.updateEditedBrokerStaticModalDataResult(
                state,
                broker,
                brokerContacts
            )
    )
);
