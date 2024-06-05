import { PayPeriod, DayOfWeek, RepairShopServiceTypeCommand, RepairShopOpenHoursCommand, RepairShopContactCommand } from 'appcoretruckassist';
import {
    ActionTypesEnum,
    EditDataKey,
    OpenWorkingHours,
    RepairShopModalEnum,
} from '../enums/repair-shop-modal.enum';
export interface RepairShopModalEditData {
    // if you go to add new shop there is no data
    id: number;
    canOpenModal: boolean;
    key: EditDataType;
    type: RepairShopModalEnum.EDIT_ACTION | null;
    openedTab: string;
}

export interface RepairShopModalAction {
    action: ActionTypesEnum.CLOSE | ActionTypesEnum.SAVE_AND_ADD_NEW;
}

export type EditDataType = EditDataKey.REPAIR_MODAL;

export type OpenHoursValue =
    | OpenWorkingHours.EIGHTAM
    | OpenWorkingHours.MIDNIGHT
    | OpenWorkingHours.NOON
    | OpenWorkingHours.FIVEAM;

export type ActionTypes =
    | ActionTypesEnum.CLOSE
    | ActionTypesEnum.SAVE
    | ActionTypesEnum.DELETE
    | ActionTypesEnum.SAVE_AND_ADD_NEW;

export interface OpenHours {
    dayLabel: string;
    isWorkingDay: boolean;
    // This is not needed yet on creating shop 
    dayOfWeek: number;
    startTime: Date | null;
    endTime: Date | null;
}

export interface RepairShopModalService {
    id: number;
    serviceType: string;
    svg: string;
    active: boolean;
}

export  interface CreateShopModel {
    name?: string;
    phone?: string;
    phoneExt?: string;
    email?: string;
    addressCity?: string;
    addressState?: string;
    addressCounty?: string;
    addressAddress?: string;
    addressStreet?: string;
    addressStreetNumber?: string;
    addressCountry?: string;
    addressZipCode?: string;
    addressStateShortName?: string;
    addressAddressUnit?: string;
    pinned?: boolean;
    note?: string;
    companyOwned?: boolean;
    bankId?: number;
    account?: string;
    routing?: string;
    rent?: number;
    payPeriod?: PayPeriod;
    weeklyDay?: DayOfWeek;
    monthlyDay?: number;
    longitude?: number;
    latitude?: number;
    openHoursSameAllDays?: boolean;
    openAlways?: boolean;
    startTimeAllDays?: string;
    endTimeAllDays?: string;
    serviceTypes?: Array<RepairShopServiceTypeCommand>;
    openHours?: Array<RepairShopOpenHoursCommand>;
    contacts?: Array<RepairShopContactCommand>;
    files?: Array<Blob>;
    shopServiceType?: number;
}

export enum RepairShopModalStringEnum {
    OPEN_HOURS = 'openHours',
    START_TIME = 'startTime',
    END_TIME = 'endTime',
    IS_WORKING_DAY = 'isWorkingDay',
    OPEN_ALWAYS = 'openAlways',
    PINNED = 'pinned',
    SELECTED_ADDRESS = 'selectedAddress',
    LONGITUDE = 'longitude',
    LATITUDE = 'latitude',
    SHOP_SERVICE_TYPE = 'shopServiceType',
    BANK_ID = 'bankId',
    FILES = 'files',
    CONTACTS = 'contacts'
}