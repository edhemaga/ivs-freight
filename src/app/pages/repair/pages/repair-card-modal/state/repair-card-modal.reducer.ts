import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
    setRepairShopTabCards,
} from '@pages/repair/pages/repair-card-modal/state/repair-card-modal.actions';
import { RepairCardsModalConfig } from '@pages/repair/pages/repair-card-modal/constants/repair-cards-modal.config';
import { RepairCardData } from '@pages/repair/pages/repair-card-modal/models/repair-card-data.model';

export const repairState: RepairCardData = {
    active: {
        numberOfRows: 4,
        checked: true,
        front_side: RepairCardsModalConfig.displayRowsFrontActive,
        back_side: RepairCardsModalConfig.displayRowsBackActive,
    },
    inactive: {
        numberOfRows: 4,
        checked: true,
        front_side: RepairCardsModalConfig.displayRowsFrontInactive,
        back_side: RepairCardsModalConfig.displayRowsBackInactive,
    },
    repair_shop: {
        numberOfRows: 4,
        checked: true,
        front_side: RepairCardsModalConfig.displayRowsFrontShop,
        back_side: RepairCardsModalConfig.displayRowsBackShop,
    },
};

export const repairCardModalReducer = createReducer(
    repairState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setInactiveTabCards, (state, inactive) => ({
        ...state,
        inactive,
    })),
    on(setRepairShopTabCards, (state, repair_shop) => ({
        ...state,
        repair_shop,
    }))
);
