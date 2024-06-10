import {
    PayPeriod,
    DayOfWeek,
    RepairShopServiceTypeCommand,
    RepairShopOpenHoursCommand,
    RepairShopContactCommand,
    AddressEntity,
    EnumValue,
    RatingReviewResponse,
} from 'appcoretruckassist';
import {
    ActionTypesEnum,
    EditDataKey,
    OpenWorkingHours,
    RepairShopModalEnum,
} from '../enums/repair-shop-modal.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
export interface RepairShopModalAction {
    action:
        | ActionTypesEnum.CLOSE
        | ActionTypesEnum.SAVE_AND_ADD_NEW
        | ActionTypesEnum.SAVE
        | ActionTypesEnum.DELETE;
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

export interface CreateShopModel {
    name: string;
    phone: string;
    phoneExt: string;
    email: string;
    pinned: boolean;
    note: string;
    companyOwned: boolean;
    bankId: number;
    account: string;
    routing: string;
    rent: number;
    payPeriod: PayPeriod;
    weeklyDay: DayOfWeek;
    monthlyDay: number;
    longitude: number;
    latitude: number;
    openHoursSameAllDays: boolean;
    openAlways: boolean;
    startTimeAllDays: string;
    endTimeAllDays: string;
    serviceTypes: Array<RepairShopServiceTypeCommand>;
    openHours: Array<RepairShopOpenHoursCommand>;
    contacts: Array<RepairShopContactCommand>;
    files: Array<Blob>;
    shopServiceType: number;
    address: AddressEntity;
}

export type OpenedTab =
    | TableStringEnum.CONTRACT
    | TableStringEnum.REVIEW
    | TableStringEnum.DETAILS;

export interface RepairShopTabs {
    id: OpenedTab;
    name: string;
    checked: boolean;
}

export interface RepeairShopModalInput {
    openedTab: OpenedTab;
    data: CreateShopModel;
    id: number;
    key: EditDataType;
    type: RepairShopModalEnum.EDIT_ACTION | null;
    canOpenModal: boolean;
}

export interface DisplayServiceTab extends EnumValue {
    checked?: boolean;
}

export interface RepairShopRatingReviewModal extends RatingReviewResponse {
    commentContent: string;
    rating: null | number;
}

export interface RepairShopContact {
    fullName: string;
    departmant: string;
    phone: string;
    ext: string;
    email: string;
}