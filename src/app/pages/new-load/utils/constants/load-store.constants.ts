export class LoadStoreConstants {
    static COMPONENT_NAME_KEY = '[Load Store]';
    public static ACTION_DISPATCH_LOAD_LIST = `${this.COMPONENT_NAME_KEY} ACTION_DISPATCH_LOAD_LIST`;
    public static ACTION_LOAD_LIST_SUCCESS = `${this.COMPONENT_NAME_KEY} ACTION_LOAD_LIST_SUCCESS`;

    //#region Toolbar actions
    public static ACTION_DISPATCH_LOAD_TYPE_CHANGE = `${this.COMPONENT_NAME_KEY} ACTION_DISPATCH_LOAD_TYPE_CHANGE`;
    public static ACTION_DISPATCH_VIEW_MODE_CHANGE = `${this.COMPONENT_NAME_KEY} ACTION_DISPATCH_VIEW_MODE_CHANGE`;
    //#endregion

    //#region Filters
    public static ACTION_FILTER_CHANGED = `${this.COMPONENT_NAME_KEY} ACTION_FILTER_CHANGED`;
    public static ACTION_SET_FILTER_DROPDOPWN_LIST = `${this.COMPONENT_NAME_KEY} ACTION_SET_FILTER_DROPDOPWN_LIST`;
    //#region

    //#region Search
    public static ACTION_SEARCH_FILTER_CHANGED = `${this.COMPONENT_NAME_KEY} ACTION_SEARCH_FILTER_CHANGED`;
    //#region

    //#region Modal
    public static ACTION_OPEN_LOAD_MODAL = `${this.COMPONENT_NAME_KEY} ACTION_OPEN_LOAD_MODAL`;
    //#endregion

    //#region Load details
    public static ACTION_GO_TO_LOAD_DETIALS = `${this.COMPONENT_NAME_KEY} ACTION_GO_TO_LOAD_DETIALS`;
    //#endregion
}
