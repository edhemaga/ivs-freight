import { EditDataKey } from "../enums/edit-data.enum";
import { RepairShopModalEnum } from "../enums/repair-shop-modal.enum";
import { OpenedTab } from "../types/open-tabs.type";
import { CreateShopModel } from "./repair-shop.model";

type EditDataType = EditDataKey.REPAIR_MODAL;

export interface RepeairShopModalInput {
    openedTab: OpenedTab;
    data: CreateShopModel;
    id: number;
    key: EditDataType;
    type: RepairShopModalEnum.EDIT_ACTION | null;
    canOpenModal: boolean;
}