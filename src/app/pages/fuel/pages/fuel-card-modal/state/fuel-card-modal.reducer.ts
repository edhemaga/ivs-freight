// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/fuel/pages/fuel-card-modal/state/fuel-card-modal.actions';

// Constants
import { FuelCardsModalConfig } from '@pages/fuel/pages/fuel-card-modal/utils/constants';

// Models
import { FuelCardData } from '@pages/fuel/pages/fuel-card-modal/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): FuelCardData => {
    const savedState = localStorage.getItem(TableStringEnum.FUEL_CARD_STATE);
    if (savedState) return JSON.parse(savedState);
    
    return {
        active: {
            numberOfRows: 4,
            checked: true,
            front_side: FuelCardsModalConfig.displayRowsFrontActive,
            back_side: FuelCardsModalConfig.displayRowsBackActive,
        },
        inactive: {
            numberOfRows: 4,
            checked: true,
            front_side: FuelCardsModalConfig.displayRowsFrontInactive,
            back_side: FuelCardsModalConfig.displayRowsBackInactive,
        },
    };
};

const saveStateToLocalStorage = (state: FuelCardData) => {
    localStorage.setItem(
        TableStringEnum.FUEL_CARD_STATE,
        JSON.stringify(state)
    );
};

export const fuelCardModalReducer = createReducer(
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
    })
);
