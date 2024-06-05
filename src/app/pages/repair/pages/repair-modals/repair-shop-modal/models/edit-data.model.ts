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
