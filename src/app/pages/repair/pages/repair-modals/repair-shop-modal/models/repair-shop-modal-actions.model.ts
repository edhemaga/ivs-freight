import { ActionTypesEnum } from "@pages/repair/pages/repair-modals/repair-shop-modal/enums";

export interface RepairShopModalAction {
    action:
        | ActionTypesEnum.CLOSE
        | ActionTypesEnum.SAVE_AND_ADD_NEW
        | ActionTypesEnum.SAVE
        | ActionTypesEnum.CLOSE_BUSINESS
        | ActionTypesEnum.DELETE;
}