export class LoadStoreConstants {
    static COMPONENT_NAME_KEY = '[Miles Table Component]';
    public static ACTION_DISPATCH_LOAD_LIST = `${this.COMPONENT_NAME_KEY} ACTION_DISPATCH_LOAD_LIST`;
    public static ACTION_LOAD_LIST_SUCCESS = `${this.COMPONENT_NAME_KEY} ACTION_LOAD_LIST_SUCCESS`;

    //#region Toolbar actions
    public static ACTION_DISPATCH_LOAD_TYPE_CHANGE = `${this.COMPONENT_NAME_KEY} ACTION_DISPATCH_LOAD_TYPE_CHANGE`;
    public static ACTION_DISPATCH_VIEW_MODE_CHANGE = `${this.COMPONENT_NAME_KEY} ACTION_DISPATCH_VIEW_MODE_CHANGE`;
    //#endregion

    //#region  Modal
    public static ACTION_OPEN_LOAD_MODAL = `${this.COMPONENT_NAME_KEY} ACTION_OPEN_LOAD_MODAL`;
    //#endregion

    //#region  Load details
    public static ACTION_GO_TO_LOAD_DETIALS = `${this.COMPONENT_NAME_KEY} ACTION_GO_TO_LOAD_DETIALS`;
    //#endregion
}
