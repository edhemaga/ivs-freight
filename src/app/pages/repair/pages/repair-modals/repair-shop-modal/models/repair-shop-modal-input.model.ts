import {
    EditDataKey,
    RepairShopModalEnum,
} from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { OpenedTab } from '@pages/repair/pages/repair-modals/repair-shop-modal/types';
import { CreateShopModel } from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

type EditDataType = EditDataKey.REPAIR_MODAL;

export interface RepeairShopModalInput {
    openedTab: OpenedTab;
    data: CreateShopModel;
    id: number;
    key: EditDataType;
    type: RepairShopModalEnum.EDIT_ACTION | null;
    canOpenModal: boolean;
    companyOwned: boolean;
}
