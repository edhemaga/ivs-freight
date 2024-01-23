import { ServerResponse, ServerResponseList } from './response';

export interface Enums {
    id: any;
    name: string;
    image: string;
    text?: string;
    email?: string;
    phone?: string;
}

export interface EnumsList extends ServerResponseList {
    data: Enums[];
}

export interface EnumsDetail extends ServerResponse {
    data: Enums;
}

export interface Vehicles {
    TRAILER: string;
    TRUCK: string;
}

export interface VehiclesList extends ServerResponse {
    data: Vehicles;
}

export interface UnitNumber {
    id: number;
    property: string;
}

export interface UnitNumberList extends ServerResponse {
    data: UnitNumber[];
}

export interface TruckLoadList {
    truckId: number;
    truckName: string;
    trailerId: number;
    trailerName: string;
    driverId: number;
    driverName: string;
}

export interface TruckResponseLoadList extends ServerResponse {
    data: TruckLoadList[];
}

// V2

export interface DeletedItem {
    id: number;
}

export interface ActiveItem {
    id: number;
}

export interface UpdatedItem {
    id: number;
}

export interface MetaData {
    id?: number;
    companyId?: number;
    domain: string;
    key: any;
    value: any;
}

export interface UpdatedData {
    failure: any[];
    notExist: any[];
    success: any[];
}

export enum ComponentsTableEnum {
    SHOW_MORE = 'show-more',
    GO_TO_LINK = 'go-to-link',
    COPY_PASSWORD = 'copy-password',
    COPY_USERNAME = 'copy-username',
    LABLE_CHANGE = 'label-change',
    UPDATE_LABLE = 'update-label',
    OPEN_MODAL = 'open-modal',
    VIEW_MODE = 'view-mode',
    TAB_SELECTED = 'tab-selected',
    DELETE_MULTIPLE = 'delete-multiple',
    EDIT = 'edit',
    UPDATE = 'update',
    DELETE = 'delete',
    API = 'api',
    STORE = 'store',
    ACTIVE = 'active',
    ADD = 'add',
    LIST = 'List',
    CARD = 'Card',
    SORT = 'sort',
    SMALL = 'small',
    TABLE_CONTAINER = 'table-container',
}
