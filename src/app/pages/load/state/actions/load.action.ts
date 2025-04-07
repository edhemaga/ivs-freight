import { createAction, props } from '@ngrx/store';

// models
import {
    ICreateCommentMetadata,
    IGetLoadListParam,
    IGetLoadTemplateParam,
    ILoadGridItem,
    ILoadTemplateGridItem,
} from '@pages/load/pages/load-table/models/index';
import {
    BrokerByIdResponse,
    CommentResponse,
    CreateCommentCommand,
    CreateLoadTemplateCommand,
    DispatcherFilterResponse,
    LoadListDto,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadModalResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
    LoadStatusResponse,
    LoadStatusType,
    LoadStopResponse,
    LoadTemplateResponse,
    RevertLoadStatusCommand,
    RoutingResponse,
    ShipperLoadModalResponse,
    UpdateLoadStatusCommand,
} from 'appcoretruckassist';
import { IActiveLoadModalData, Load } from '@pages/load/models';
import { Column, ICurrentSearchTableData, ITableColummn } from '@shared/models';
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models';
import { BrokerContactExtended } from '@pages/customer/pages/broker-modal/models';

// constants
import { LoadStoreConstants } from '@pages/load/pages/load-table/utils/constants/index';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';
import { eActiveViewMode } from '@shared/enums';
import { ICaMapProps } from 'ca-components';

// #region loadList
export const getLoadsPayload = createAction(
    LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST,
    props<{
        apiParam: IGetLoadListParam;
        showMore?: boolean;
        onSearch?: ICurrentSearchTableData;
    }>()
);

export const getLoadsPayloadSuccess = createAction(
    LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST_SUCCESS,
    props<{
        data: LoadListDto[];
        templateCount: number;
        pendingCount: number;
        activeCount: number;
        closedCount: number;
        selectedTab: eLoadStatusType;
        showMore?: boolean;
    }>()
);

export const getLoadsPayloadError = createAction(
    LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region loadTemplates
export const getTemplatesPayload = createAction(
    LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES,
    props<{
        apiParam: IGetLoadTemplateParam;
        showMore?: boolean;
        onSearch?: ICurrentSearchTableData;
    }>()
);

export const getTemplatesPayloadSuccess = createAction(
    LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES_SUCCESS,
    props<{
        data: ILoadTemplateGridItem[];
        templateCount: number;
        pendingCount: number;
        activeCount: number;
        closedCount: number;
        selectedTab: eLoadStatusType;
        showMore?: boolean;
    }>()
);

export const getTemplatesPayloadError = createAction(
    LoadStoreConstants.ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getLoadById
export const getLoadById = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID,
    props<{ apiParam: number }>()
);

export const getLoadByIdSuccess = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID_SUCCESS,
    props<{ load: LoadListDto }>()
);

export const getLoadByIdError = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getEditLoadModalData
export const getEditLoadModalData = createAction(
    LoadStoreConstants.ACTION_GET_EDIT_LOAD_MODAL_DATA,
    props<{
        apiParam: number;
        selectedTab: eLoadStatusType;
        eventType: string;
    }>()
);

export const getEditLoadModalDataSuccess = createAction(
    LoadStoreConstants.ACTION_GET_EDIT_LOAD_MODAL_DATA_SUCCESS,
    props<{
        load: LoadResponse;
        modal: LoadModalResponse;
        possibleStatuses: LoadPossibleStatusesResponse;
    }>()
);

export const getEditLoadModalDataError = createAction(
    LoadStoreConstants.ACTION_GET_EDIT_LOAD_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getEditLoadTemplateModalData
export const getEditLoadTemplateModalData = createAction(
    LoadStoreConstants.ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA,
    props<{
        apiParam: number;
        selectedTab: eLoadStatusType;
        eventType: string;
    }>()
);

export const getEditLoadTemplateModalDataSuccess = createAction(
    LoadStoreConstants.ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA_SUCCESS,
    props<{ loadTemplate?: LoadTemplateResponse; modal?: LoadModalResponse }>()
);

export const getEditLoadTemplateModalDataError = createAction(
    LoadStoreConstants.ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getCreateLoadModalData
export const getCreateLoadModalData = createAction(
    LoadStoreConstants.ACTION_GET_CREATE_LOAD_MODAL_DATA,
    props<{ brokerToAdd?: BrokerByIdResponse }>()
);

export const getCreateLoadModalDataSuccess = createAction(
    LoadStoreConstants.ACTION_GET_CREATE_LOAD_MODAL_DATA_SUCCESS,
    props<{
        modal: LoadModalResponse;
        activeLoadModalData?: IActiveLoadModalData;
    }>()
);

export const getCreateLoadModalDataError = createAction(
    LoadStoreConstants.ACTION_GET_CREATE_LOAD_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getConvertToLoadModalData
export const getConvertToLoadModalData = createAction(
    LoadStoreConstants.ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA,
    props<{
        apiParam: number;
        selectedTab: eLoadStatusType;
        eventType: string;
    }>()
);

export const getConvertToLoadModalDataSuccess = createAction(
    LoadStoreConstants.ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA_SUCCESS,
    props<{ load: LoadResponse; modal: LoadModalResponse }>()
);

export const getConvertToLoadModalDataError = createAction(
    LoadStoreConstants.ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getConvertToLoadTemplateModalData
export const getConvertToLoadTemplateModalData = createAction(
    LoadStoreConstants.ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA,
    props<{
        apiParam: number;
        selectedTab: eLoadStatusType;
        eventType: string;
    }>()
);

export const getConvertToLoadTemplateModalDataSuccess = createAction(
    LoadStoreConstants.ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA_SUCCESS,
    props<{ loadTemplate: LoadTemplateResponse; modal: LoadModalResponse }>()
);

export const getConvertToLoadTemplateModalDataError = createAction(
    LoadStoreConstants.ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region addCreatedBrokerStaticModalData
export const addCreatedBrokerStaticModalData = createAction(
    LoadStoreConstants.ACTION_ADD_CREATED_BROKER_STATIC_MODAL_DATA,
    props<{ broker: BrokerByIdResponse }>()
);
// #endregion

// #region addCreatedShipperStaticModalData
export const addCreatedShipperStaticModalData = createAction(
    LoadStoreConstants.ACTION_ADD_CREATED_SHIPPER_STATIC_MODAL_DATA,
    props<{ shipper: ShipperLoadModalResponse }>()
);
// #endregion

// #region updateEditedBrokerStaticModalData
export const updateEditedBrokerStaticModalData = createAction(
    LoadStoreConstants.ACTION_UPDATE_EDITED_BROKER_STATIC_MODAL_DATA,
    props<{
        broker: BrokerByIdResponse;
        brokerContacts?: BrokerContactExtended[];
    }>()
);
// #endregion

// #region getLoadTemplateById
export const getLoadTemplateById = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_TEMPLATE_BY_ID,
    props<{ apiParam: number }>()
);

export const getLoadTemplateByIdSuccess = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_TEMPLATE_BY_ID_SUCCESS,
    props<{ loadTemplate: LoadTemplateResponse }>()
);

export const getLoadTemplateByIdError = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_TEMPLATE_BY_ID_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getLoadStatusFilter
export const getLoadStatusFilter = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_STATUS_FILTER,
    props<{ loadStatusType: LoadStatusType }>()
);

export const getLoadStatusFilterSuccess = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_STATUS_FILTER_SUCCESS,
    props<{ statusList: DispatcherFilterResponse[] }>()
);

export const getLoadStatusFilterError = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_STATUS_FILTER_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region templateCount
export const setTemplateCount = createAction(
    LoadStoreConstants.ACTION_SET_TEMPLATE_COUNT,
    props<{ templateCount: number }>()
);

export const setTemplateCountIncrement = createAction(
    LoadStoreConstants.ACTION_SET_TEMPLATE_COUNT_INCREMENT,
    props<{ templateCount: number }>()
);

export const setTemplateCountDecrement = createAction(
    LoadStoreConstants.ACTION_SET_TEMPLATE_COUNT_DECREMENT,
    props<{ templateCount: number }>()
);
// #endregion

// #region pendingCount
export const setPendingCount = createAction(
    LoadStoreConstants.ACTION_SET_PENDING_COUNT,
    props<{ pendingCount: number }>()
);

export const setPendingCountIncrement = createAction(
    LoadStoreConstants.ACTION_SET_PENDING_COUNT_INCREMENT,
    props<{ pendingCount: number }>()
);

export const setPendingCountDecrement = createAction(
    LoadStoreConstants.ACTION_SET_PENDING_COUNT_INCREMENT,
    props<{ pendingCount: number }>()
);
// #endregion

// #region activeCount
export const setActiveCount = createAction(
    LoadStoreConstants.ACTION_SET_ACTIVE_COUNT,
    props<{ activeCount: number }>()
);

export const setActiveCountIncrement = createAction(
    LoadStoreConstants.ACTION_SET_ACTIVE_COUNT_INCREMENT,
    props<{ activeCount: number }>()
);

export const setActiveCountDecrement = createAction(
    LoadStoreConstants.ACTION_SET_ACTIVE_COUNT_DECREMENT,
    props<{ activeCount: number }>()
);
// #endregion

// #region closedCount
export const setClosedCount = createAction(
    LoadStoreConstants.ACTION_SET_CLOSED_COUNT,
    props<{ closedCount: number }>()
);

export const setClosedCountIncrement = createAction(
    LoadStoreConstants.ACTION_SET_CLOSED_COUNT_INCREMENT,
    props<{ closedCount: number }>()
);

export const setClosedCountDecrement = createAction(
    LoadStoreConstants.ACTION_SET_CLOSED_COUNT_DECREMENT,
    props<{ closedCount: number }>()
);
// #endregion

// #region selectedDataRowsChange
export const selectedDataRowsChange = createAction(
    LoadStoreConstants.ACTION_CAN_DELETE_SELECTED_DATA_ROWS,
    props<{ canDeleteSelectedDataRows: boolean; ids: number[] }>()
);
// #endregion

// #region getLoadByIdLocal
export const getLoadByIdLocal = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID_LOCAL,
    props<{ actionItemId: number }>()
);
// #endregion

// #region tableColumnToggle
export const tableColumnToggle = createAction(
    LoadStoreConstants.ACTION_TABLE_COLUMN_TOGGLE,
    props<{ column: Column }>()
);
// #endregion

// #region tableUnlockToggle
export const tableUnlockToggle = createAction(
    LoadStoreConstants.ACTION_TABLE_UNLOCK_TOGGLE
);
// #endregion

// #region tableColumnResize
export const tableColumnResize = createAction(
    LoadStoreConstants.ACTION_RESIZE_COLUMN,
    props<{ columns: ITableColummn[]; width: number; index: number }>()
);
// #endregion

// #region tableColumnReset
export const tableColumnReset = createAction(
    LoadStoreConstants.ACTION_RESET_COLUMNS
);
// #endregion

// #region setSelectedTab
export const setSelectedTab = createAction(
    LoadStoreConstants.ACTION_SET_SELECTED_TAB,
    props<{ selectedTab: eLoadStatusType }>()
);
// #endregion

// #region setActiveViewMode
export const setActiveViewMode = createAction(
    LoadStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
    props<{ activeViewMode: eActiveViewMode }>()
);
// #endregion

// #region setActiveLoadModalData
export const setActveLoadModalData = createAction(
    LoadStoreConstants.ACTION_SET_ACTIVE_LOAD_MODAL_DATA,
    props<{ data: IActiveLoadModalData }>()
);
// #endregion

// #region resetActiveLoadModalData
export const resetActiveLoadModalData = createAction(
    LoadStoreConstants.ACTION_RESET_ACTIVE_LOAD_MODAL_DATA
);
// #endregion

// #region saveNote
export const saveNote = createAction(
    LoadStoreConstants.ACTION_SAVE_NOTE,
    props<{ entityId: number; value: string }>()
);
// #endregion

// #region updateLoadStatus
export const updateLoadStatus = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
    props<{
        apiParam: UpdateLoadStatusCommand;
        confirmation: ConfirmationActivation;
    }>()
);

export const updateLoadStatusSuccess = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_SUCCESS,
    props<{ loadId: number; status: LoadStatusResponse }>()
);

export const updateLoadStatusError = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region updateLoadStatusSignalR
export const updateLoadStatusSignalR = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_SIGNALR,
    props<{ response: LoadListResponse }>()
);
// #endregion

// #region revertLoadStatus
export const revertLoadStatus = createAction(
    LoadStoreConstants.ACTION_REVERT_LOAD_STATUS,
    props<{ apiParam: RevertLoadStatusCommand }>()
);

export const revertLoadStatusSuccess = createAction(
    LoadStoreConstants.ACTION_REVERT_LOAD_STATUS_SUCCESS,
    props<{ loadId: number; status: LoadStatusResponse }>()
);

export const revertLoadStatusError = createAction(
    LoadStoreConstants.ACTION_REVERT_LOAD_STATUS_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region createLoad
export const createLoad = createAction(
    LoadStoreConstants.ACTION_CREATE_LOAD,
    props<{ apiParam: Load }>()
);

export const createLoadSuccess = createAction(
    LoadStoreConstants.ACTION_CREATE_LOAD_SUCCESS,
    props<{ load: LoadResponse }>()
);

export const createLoadError = createAction(
    LoadStoreConstants.ACTION_CREATE_LOAD_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region createLoadTemplate
export const createLoadTemplate = createAction(
    LoadStoreConstants.ACTION_CREATE_LOAD_TEMPLATE,
    props<{ apiParam: CreateLoadTemplateCommand }>()
);

export const createLoadTemplateSuccess = createAction(
    LoadStoreConstants.ACTION_CREATE_LOAD_TEMPLATE_SUCCESS,
    props<{ loadTemplate: LoadTemplateResponse }>()
);

export const createLoadTemplateError = createAction(
    LoadStoreConstants.ACTION_CREATE_LOAD_TEMPLATE_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region createComment
export const createComment = createAction(
    LoadStoreConstants.ACTION_CREATE_COMMENT,
    props<{
        apiParam: CreateCommentCommand;
        metadata: ICreateCommentMetadata;
    }>()
);

export const createCommentSuccess = createAction(
    LoadStoreConstants.ACTION_CREATE_COMMENT_SUCCESS,
    props<{
        loadId: number;
        comment: CommentResponse;
        metadata: ICreateCommentMetadata;
    }>()
);

export const createCommentError = createAction(
    LoadStoreConstants.ACTION_CREATE_COMMENT_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region updateLoad
export const updateLoad = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD,
    props<{ apiParam: Load }>()
);

export const updateLoadSuccess = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_SUCCESS,
    props<{ load: LoadListDto }>()
);

export const updateLoadError = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region updateLoadTemplate
// TODO: try to switch CreateLoadTemplateCommand with UpdateLoadTemplateCommand in modal
export const updateLoadTemplate = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_TEMPLATE,
    props<{ apiParam: CreateLoadTemplateCommand }>()
);

export const updateLoadTemplateSuccess = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_TEMPLATE_SUCCESS,
    props<{ loadTemplate: LoadTemplateResponse }>()
);

export const updateLoadTemplateError = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_TEMPLATE_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region updateLoadAndStatus
export const updateLoadAndStatus = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_AND_STATUS,
    props<{ apiParamLoad: Load; apiParamStatus: UpdateLoadStatusCommand }>()
);

export const updateLoadAndStatusSuccess = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_AND_STATUS_SUCCESS,
    props<{ response: LoadListResponse; status: LoadStatusResponse }>()
);

export const updateLoadAndStatusError = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_AND_STATUS_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region updateLoadAndRevertStatus
export const updateLoadAndRevertStatus = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_AND_REVERT_STATUS,
    props<{ apiParamStatus: RevertLoadStatusCommand; apiParamLoad: Load }>()
);

export const updateLoadAndRevertStatusSuccess = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_AND_REVERT_STATUS_SUCCESS,
    props<{ response: LoadListResponse; status: LoadStatusResponse }>()
);

export const updateLoadAndRevertStatusError = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_AND_REVERT_STATUS_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteCommentById
export const deleteCommentById = createAction(
    LoadStoreConstants.ACTION_DELETE_COMMENT_BY_ID,
    props<{ apiParam: number; loadId: number }>()
);

export const deleteCommentByIdSuccess = createAction(
    LoadStoreConstants.ACTION_DELETE_COMMENT_BY_ID_SUCCESS,
    props<{ loadId: number; commentId: number }>()
);

export const deleteCommentByIdError = createAction(
    LoadStoreConstants.ACTION_DELETE_COMMENT_BY_ID_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteLoadTemplateById
export const deleteLoadTemplateById = createAction(
    LoadStoreConstants.ACTION_DELETE_LOAD_TEMPLATE_BY_ID,
    props<{ apiParam: number }>()
);

export const deleteLoadTemplateByIdSuccess = createAction(
    LoadStoreConstants.ACTION_DELETE_LOAD_TEMPLATE_BY_ID_SUCCESS,
    props<{ loadTemplateId: number }>()
);

export const deleteLoadTemplateByIdError = createAction(
    LoadStoreConstants.ACTION_DELETE_LOAD_TEMPLATE_BY_ID_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteLoadById
export const deleteLoadById = createAction(
    LoadStoreConstants.ACTION_DELETE_LOAD_BY_ID,
    props<{ apiParam: number }>()
);

export const deleteLoadByIdSuccess = createAction(
    LoadStoreConstants.ACTION_DELETE_LOAD_BY_ID_SUCCESS,
    props<{ loadId: number }>()
);

export const deleteLoadByIdError = createAction(
    LoadStoreConstants.ACTION_DELETE_LOAD_BY_ID_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteBulkLoadTemplate
export const deleteBulkLoadTemplate = createAction(
    LoadStoreConstants.ACTION_DELETE_BULK_LOAD_TEMPLATE,
    props<{ apiParam: number[] }>()
);

export const deleteBulkLoadTemplateSuccess = createAction(
    LoadStoreConstants.ACTION_DELETE_BULK_LOAD_TEMPLATE_SUCCESS,
    props<{ ids: number[] }>()
);

export const deleteBulkLoadTemplateError = createAction(
    LoadStoreConstants.ACTION_DELETE_BULK_LOAD_TEMPLATE_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteBulkLoads
export const deleteBulkLoad = createAction(
    LoadStoreConstants.ACTION_DELETE_BULK_LOAD,
    props<{ apiParam: number[] }>()
);

export const deleteBulkLoadSuccess = createAction(
    LoadStoreConstants.ACTION_DELETE_BULK_LOAD_SUCCESS,
    props<{ ids: number[] }>()
);

export const deleteBulkLoadError = createAction(
    LoadStoreConstants.ACTION_DELETE_BULK_LOAD_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getDispatcherList
export const getDispatcherList = createAction(
    LoadStoreConstants.ACTION_GET_DISPATCHER_LIST,
    props<{ loadStatusType: LoadStatusType }>()
);

export const getDispatcherListSuccess = createAction(
    LoadStoreConstants.ACTION_GET_DISPATCHER_LIST_SUCCESS,
    props<{ dispatcherList?: DispatcherFilterResponse[] }>()
);

export const getDispatcherListError = createAction(
    LoadStoreConstants.ACTION_GET_DISPATCHER_LIST_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getLoadDetails
export const getLoadDetailsById = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_DETAILS_BY_ID,
    props<{ loadId: number }>()
);

export const getLoadDetails = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_DETAILS_BY_ID_SUCCESS,
    props<{ details: LoadResponse }>()
);

export const getLoadDetailsError = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_DETAILS_BY_ID_ERROR,
    props<{ error: Error }>()
);
    
export const getLoadDetailsMapData = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_DETAILS_MAP_DATA,
    props<{ mapLocations: string }>()
);

export const getLoadDetailsMapDataSuccess = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_DETAILS_MAP_DATA_SUCCESS,
    props<{ mapRoutes: RoutingResponse }>()
);

export const getLoadDetailsMapDataError = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_DETAILS_MAP_DATA_ERROR,
    props<{ error: Error }>()
);

// #endregion

export const setLoadDetailsToUnload = createAction(
    LoadStoreConstants.ACTION_SET_LOAD_DETAILS_TO_UNLOAD
);

export const selectAllRow = createAction(
    LoadStoreConstants.ACTION_SELECT_ALL_ROWS
);

export const selectLoad = createAction(
    LoadStoreConstants.ACTION_SELECT_LOAD,
    props<{ load: ILoadGridItem | ILoadTemplateGridItem }>()
);

export const toggleMap = createAction(LoadStoreConstants.ACTION_TOGGLE_MAP);
export const getMinimalList = createAction(
    LoadStoreConstants.ACTION_GET_MINIMAL_LIST
);

export const setMinimalList = createAction(
    LoadStoreConstants.ACTION_SET_MINIMAL_LIST,
    props<{ list: LoadMinimalListResponse }>()
);

export const setMinimalListError = createAction(
    LoadStoreConstants.ACTION_SET_MINIMAL_LIST_ERROR
);
