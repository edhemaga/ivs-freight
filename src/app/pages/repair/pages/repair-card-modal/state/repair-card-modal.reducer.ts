// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
    setRepairShopTabCards,
} from '@pages/repair/pages/repair-card-modal/state/repair-card-modal.actions';

// Constants
import { RepairCardsModalConfig } from '@pages/repair/pages/repair-card-modal/constants/repair-cards-modal.config';

// Models
import { RepairCardData } from '@pages/repair/pages/repair-card-modal/models/repair-card-data.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): RepairCardData => {
    const savedState = localStorage.getItem(TableStringEnum.REPAIR_CARD_STATE);
    if (savedState) return JSON.parse(savedState);
    
    return {
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
};

const saveStateToLocalStorage = (state: RepairCardData) => {
    localStorage.setItem(
        TableStringEnum.REPAIR_CARD_STATE,
        JSON.stringify(state)
    );
};

export const repairCardModalReducer = createReducer(
    getInitialState(),
    on(setActiveTabCards, (state, active) => {
        const newState = { ...state, active };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setInactiveTabCards, (state, inactive) => {
        const newState = { ...state, inactive };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setRepairShopTabCards, (state, repair_shop) => {
        const newState = { ...state, repair_shop };
        saveStateToLocalStorage(newState);
        return newState;
    })
);
