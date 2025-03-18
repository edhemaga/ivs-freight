export class LoadStoreConstants {
    static COMPONENT_NAME_KEY = '[Load Table Component]';
    static LOAD_MODAL_KEY = '[Load Modal Component]';

    static ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST = `${this.COMPONENT_NAME_KEY} Load List`;
    static ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST_SUCCESS = `${this.COMPONENT_NAME_KEY} Load List Success`;
    static ACTION_LOAD_TABLE_COMPONENT_LOAD_LIST_ERROR = `${this.COMPONENT_NAME_KEY} Load List Error`;

    static ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES = `${this.COMPONENT_NAME_KEY} Load Templates`;
    static ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES_SUCCESS = `${this.COMPONENT_NAME_KEY} Load Templates Success`;
    static ACTION_LOAD_TABLE_COMPONENT_LOAD_TEMPLATES_ERROR = `${this.COMPONENT_NAME_KEY} Load Templates Error`;

    static ACTION_GET_LOAD_BY_ID = `${this.COMPONENT_NAME_KEY} Get Load By Id`;
    static ACTION_GET_LOAD_BY_ID_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Load By Id Success`;
    static ACTION_GET_LOAD_BY_ID_ERROR = `${this.COMPONENT_NAME_KEY} Get Load By Id Error`;

    static ACTION_GET_LOAD_BY_ID_LOCAL = `${this.COMPONENT_NAME_KEY} Get Load By Id Local`;

    static ACTION_GET_EDIT_LOAD_MODAL_DATA = `${this.COMPONENT_NAME_KEY} Get Edit Load Modal Data`;
    static ACTION_GET_EDIT_LOAD_MODAL_DATA_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Edit Load Modal Data Success`;
    static ACTION_GET_EDIT_LOAD_MODAL_DATA_ERROR = `${this.COMPONENT_NAME_KEY} Get Edit Load Modal Data Error`;

    static ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA = `${this.COMPONENT_NAME_KEY} Get Edit Load Template Modal Data`;
    static ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Edit Load Template Modal Data Success`;
    static ACTION_GET_EDIT_LOAD_TEMPLATE_MODAL_DATA_ERROR = `${this.COMPONENT_NAME_KEY} Get Edit Load Template Modal Data Error`;

    static ACTION_GET_CREATE_LOAD_MODAL_DATA = `${this.COMPONENT_NAME_KEY} Get Create Load Modal Data`;
    static ACTION_GET_CREATE_LOAD_MODAL_DATA_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Create Load Modal Data Success`;
    static ACTION_GET_CREATE_LOAD_MODAL_DATA_ERROR = `${this.COMPONENT_NAME_KEY} Get Create Load Modal Data Error`;

    static ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA = `${this.COMPONENT_NAME_KEY} Get Convert To Template Modal Data`;
    static ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Convert To Template Modal Data Success`;
    static ACTION_GET_CONVERT_TO_TEMPLATE_MODAL_DATA_ERROR = `${this.COMPONENT_NAME_KEY} Get Convert To Template Modal Data Error`;

    static ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA = `${this.COMPONENT_NAME_KEY} Get Convert To Load`;
    static ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Convert To Load Success`;
    static ACTION_GET_CONVERT_TO_LOAD_MODAL_DATA_ERROR = `${this.COMPONENT_NAME_KEY} Get Convert To Load Error`;

    static ACTION_GET_LOAD_TEMPLATE_BY_ID = `${this.COMPONENT_NAME_KEY} Get Load Template By Id`;
    static ACTION_GET_LOAD_TEMPLATE_BY_ID_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Load Template By Id Success`;
    static ACTION_GET_LOAD_TEMPLATE_BY_ID_ERROR = `${this.COMPONENT_NAME_KEY} Get Load Template By Id Error`;

    static ACTION_GET_LOAD_STATUS_FILTER = `${this.COMPONENT_NAME_KEY} Get Load Status Filter`;
    static ACTION_GET_LOAD_STATUS_FILTER_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Load Status Filter Success`;
    static ACTION_GET_LOAD_STATUS_FILTER_ERROR = `${this.COMPONENT_NAME_KEY} Get Load Status Filter Error`;

    static ACTION_RESET_COLUMNS = `${this.COMPONENT_NAME_KEY} Reset Columns`;
    static ACTION_RESIZE_COLUMN = `${this.COMPONENT_NAME_KEY} Resize Column`;
    static ACTION_TABLE_COLUMN_TOGGLE = `${this.COMPONENT_NAME_KEY} Table Column Toggle`;
    static ACTION_TABLE_UNLOCK_TOGGLE = `${this.COMPONENT_NAME_KEY} Table Unlock Toggle`;

    static ACTION_SET_ACTIVE_VIEW_MODE = `${this.COMPONENT_NAME_KEY} Set Active View Mode`;

    static ACTION_SET_SELECTED_TAB = `${this.COMPONENT_NAME_KEY} Set Selected Tab`;
    static ACTION_SET_SELECTED_TAB_SUCCESS = `${this.COMPONENT_NAME_KEY} Set Selected Tab Success`;
    static ACTION_SET_SELECTED_TAB_ERROR = `${this.COMPONENT_NAME_KEY} Set Selected Tab Error`;

    static ACTION_SET_TEMPLATE_COUNT = `${this.COMPONENT_NAME_KEY} Set Template Count`;
    static ACTION_SET_TEMPLATE_COUNT_INCREMENT = `${this.COMPONENT_NAME_KEY} Set Template Count Increment`;
    static ACTION_SET_TEMPLATE_COUNT_DECREMENT = `${this.COMPONENT_NAME_KEY} Set Template Count Decrement`;

    static ACTION_SET_PENDING_COUNT = `${this.COMPONENT_NAME_KEY} Set Pending Count`;
    static ACTION_SET_PENDING_COUNT_INCREMENT = `${this.COMPONENT_NAME_KEY} Set Pending Count Increment`;
    static ACTION_SET_PENDING_COUNT_DECREMENT = `${this.COMPONENT_NAME_KEY} Set Pending Count Decrement`;

    static ACTION_SET_ACTIVE_COUNT = `${this.COMPONENT_NAME_KEY} Set Active Count`;
    static ACTION_SET_ACTIVE_COUNT_INCREMENT = `${this.COMPONENT_NAME_KEY} Set Active Count Increment`;
    static ACTION_SET_ACTIVE_COUNT_DECREMENT = `${this.COMPONENT_NAME_KEY} Set Active Count Decrement`;

    static ACTION_SET_CLOSED_COUNT = `${this.COMPONENT_NAME_KEY} Set Closed Count`;
    static ACTION_SET_CLOSED_COUNT_INCREMENT = `${this.COMPONENT_NAME_KEY} Set Closed Count Increment`;
    static ACTION_SET_CLOSED_COUNT_DECREMENT = `${this.COMPONENT_NAME_KEY} Set Closed Count Decrement`;

    static ACTION_SET_ACTIVE_LOAD_MODAL_DATA = `${this.LOAD_MODAL_KEY} Set Active load Modal Data`;

    static ACTION_RESET_ACTIVE_LOAD_MODAL_DATA = `${this.LOAD_MODAL_KEY} Reset Active Load Modal Data`;

    static ACTION_ADD_CREATED_BROKER_STATIC_MODAL_DATA = `${this.LOAD_MODAL_KEY} Add Created Broker Static Modal Data`;
    static ACTION_ADD_CREATED_SHIPPER_STATIC_MODAL_DATA = `${this.LOAD_MODAL_KEY} Add Created Shipper Static Modal Data`;
    static ACTION_UPDATE_EDITED_BROKER_STATIC_MODAL_DATA = `${this.LOAD_MODAL_KEY} Update Edited Broker Static Modal Data`;

    static ACTION_UPDATE_LOAD_STATUS = `${this.COMPONENT_NAME_KEY} Update Load Status`;
    static ACTION_UPDATE_LOAD_STATUS_SUCCESS = `${this.COMPONENT_NAME_KEY} Update Load Status Success`;
    static ACTION_UPDATE_LOAD_STATUS_ERROR = `${this.COMPONENT_NAME_KEY} Update Load Status Error`;

    static ACTION_REVERT_LOAD_STATUS = `${this.COMPONENT_NAME_KEY} Revert Load Status`;
    static ACTION_REVERT_LOAD_STATUS_SUCCESS = `${this.COMPONENT_NAME_KEY} Revert Load Status Success`;
    static ACTION_REVERT_LOAD_STATUS_ERROR = `${this.COMPONENT_NAME_KEY} Revert Load Status Error`;

    static ACTION_UPDATE_LOAD_STATUS_SIGNALR = `${this.COMPONENT_NAME_KEY} Update Load Status SignalR`;

    static ACTION_SAVE_NOTE = `${this.COMPONENT_NAME_KEY} Update Note`;

    static ACTION_CREATE_LOAD = `${this.COMPONENT_NAME_KEY} Create Load`;
    static ACTION_CREATE_LOAD_SUCCESS = `${this.COMPONENT_NAME_KEY} Create Load Success`;
    static ACTION_CREATE_LOAD_ERROR = `${this.COMPONENT_NAME_KEY} Create Load Error`;

    static ACTION_CREATE_LOAD_TEMPLATE = `${this.COMPONENT_NAME_KEY} Create Load Template`;
    static ACTION_CREATE_LOAD_TEMPLATE_SUCCESS = `${this.COMPONENT_NAME_KEY} Create Load Template Success`;
    static ACTION_CREATE_LOAD_TEMPLATE_ERROR = `${this.COMPONENT_NAME_KEY} Create Load Template Error`;

    static ACTION_CREATE_COMMENT = `${this.COMPONENT_NAME_KEY} Create Comment`;
    static ACTION_CREATE_COMMENT_SUCCESS = `${this.COMPONENT_NAME_KEY} Create Comment Success`;
    static ACTION_CREATE_COMMENT_ERROR = `${this.COMPONENT_NAME_KEY} Create Comment Error`;

    static ACTION_UPDATE_LOAD = `${this.COMPONENT_NAME_KEY} Update Load`;
    static ACTION_UPDATE_LOAD_SUCCESS = `${this.COMPONENT_NAME_KEY} Update Load Success`;
    static ACTION_UPDATE_LOAD_ERROR = `${this.COMPONENT_NAME_KEY} Update Load Error`;

    static ACTION_UPDATE_LOAD_TEMPLATE = `${this.COMPONENT_NAME_KEY} Update Load Template`;
    static ACTION_UPDATE_LOAD_TEMPLATE_SUCCESS = `${this.COMPONENT_NAME_KEY} Update Load Template Success`;
    static ACTION_UPDATE_LOAD_TEMPLATE_ERROR = `${this.COMPONENT_NAME_KEY} Update Load Template Error`;

    static ACTION_UPDATE_LOAD_AND_STATUS = `${this.COMPONENT_NAME_KEY} Update Load and Status`;
    static ACTION_UPDATE_LOAD_AND_STATUS_SUCCESS = `${this.COMPONENT_NAME_KEY} Update Load and Status Success`;
    static ACTION_UPDATE_LOAD_AND_STATUS_ERROR = `${this.COMPONENT_NAME_KEY} Update Load and Status Error`;

    static ACTION_UPDATE_LOAD_AND_REVERT_STATUS = `${this.COMPONENT_NAME_KEY} Update Load and Revert Status`;
    static ACTION_UPDATE_LOAD_AND_REVERT_STATUS_SUCCESS = `${this.COMPONENT_NAME_KEY} Update Load and Revert Status Success`;
    static ACTION_UPDATE_LOAD_AND_REVERT_STATUS_ERROR = `${this.COMPONENT_NAME_KEY} Update Load and Revert Status Error`;

    static ACTION_DELETE_COMMENT_BY_ID = `${this.COMPONENT_NAME_KEY} Delete Comment By Id`;
    static ACTION_DELETE_COMMENT_BY_ID_SUCCESS = `${this.COMPONENT_NAME_KEY} Delete Comment By Id Success`;
    static ACTION_DELETE_COMMENT_BY_ID_ERROR = `${this.COMPONENT_NAME_KEY} Delete Comment By Id Error`;

    static ACTION_DELETE_LOAD_TEMPLATE_BY_ID = `${this.COMPONENT_NAME_KEY} Delete Load Template By Id`;
    static ACTION_DELETE_LOAD_TEMPLATE_BY_ID_SUCCESS = `${this.COMPONENT_NAME_KEY} Delete Load Template By Id Success`;
    static ACTION_DELETE_LOAD_TEMPLATE_BY_ID_ERROR = `${this.COMPONENT_NAME_KEY} Delete Load Template By Id Error`;

    static ACTION_DELETE_LOAD_BY_ID = `${this.COMPONENT_NAME_KEY} Delete Load By Id`;
    static ACTION_DELETE_LOAD_BY_ID_SUCCESS = `${this.COMPONENT_NAME_KEY} Delete Load By Id Success`;
    static ACTION_DELETE_LOAD_BY_ID_ERROR = `${this.COMPONENT_NAME_KEY} Delete Load By Id Error`;

    static ACTION_DELETE_BULK_LOAD = `${this.COMPONENT_NAME_KEY} Delete Bulk Load`;
    static ACTION_DELETE_BULK_LOAD_SUCCESS = `${this.COMPONENT_NAME_KEY} Delete Bulk Load Success`;
    static ACTION_DELETE_BULK_LOAD_ERROR = `${this.COMPONENT_NAME_KEY} Delete Bulk Load Error`;

    static ACTION_DELETE_BULK_LOAD_TEMPLATE = `${this.COMPONENT_NAME_KEY} Delete Bulk Load Template`;
    static ACTION_DELETE_BULK_LOAD_TEMPLATE_SUCCESS = `${this.COMPONENT_NAME_KEY} Delete Bulk Load Template Success`;
    static ACTION_DELETE_BULK_LOAD_TEMPLATE_ERROR = `${this.COMPONENT_NAME_KEY} Delete Bulk Load Template Error`;

    static ACTION_CAN_DELETE_SELECTED_DATA_ROWS = `${this.COMPONENT_NAME_KEY} Can Delete Selected Data Rows`;
    static ACTION_GET_DISPATCHER_LIST = `${this.COMPONENT_NAME_KEY} Get Dispatcher List`;
    static ACTION_GET_DISPATCHER_LIST_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Dispatcher List Success`;
    static ACTION_GET_DISPATCHER_LIST_ERROR = `${this.COMPONENT_NAME_KEY} Get Dispatcher List Error`;

    static ACTION_GET_LOAD_DETAILS_BY_ID = `${this.COMPONENT_NAME_KEY} Get Load Details By Id`;
    static ACTION_GET_LOAD_DETAILS_BY_ID_SUCCESS = `${this.COMPONENT_NAME_KEY} Get Load Details By Id Success`;
    static ACTION_GET_LOAD_DETAILS_BY_ID_ERROR = `${this.COMPONENT_NAME_KEY} Get Load Details By Id Error`;

    static ACTION_SET_LOAD_DETAILS_TO_UNLOAD = `${this.COMPONENT_NAME_KEY}  ACTION_SET_LOAD_DETAILS_TO_UNLOAD`;

    static ACTION_SELECT_ALL_ROWS = `${this.COMPONENT_NAME_KEY}  ACTION_SELECT_ALL_ROWS`;
}
