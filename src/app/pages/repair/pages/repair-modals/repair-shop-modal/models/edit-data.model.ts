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
    day: string;
    isDay: boolean;
    dayOfWeek: number;
    startTime: string | null;
    endTime: string | null;
}

export interface RepairShopModalService {
    id: number;
    serviceType: string;
    svg: string;
    active: boolean;
}
