import { ActionTypesEnum } from "../enums/modal-actions.enum";

export interface RepairShopModalAction {
    action:
        | ActionTypesEnum.CLOSE
        | ActionTypesEnum.SAVE_AND_ADD_NEW
        | ActionTypesEnum.SAVE
        | ActionTypesEnum.CLOSE_BUSINESS
        | ActionTypesEnum.DELETE;
}