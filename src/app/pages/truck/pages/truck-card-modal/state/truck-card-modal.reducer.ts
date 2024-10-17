// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/truck/pages/truck-card-modal/state/truck-card-modal.actions';

// Constants
import { TruckCardsModalConfig } from '@pages/truck/pages/truck-card-modal/utils/constants/truck-cards-modal.config';

// Models
import { TruckCardData } from '@pages/truck/pages/truck-card-modal/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): TruckCardData => {
    const savedState = localStorage.getItem(TableStringEnum.TRUCK_CARD_STATE);
    if (savedState) return JSON.parse(savedState);

    return {
        active: {
            numberOfRows: 4,
            checked: true,
            front_side: TruckCardsModalConfig.displayRowsFrontActive,
            back_side: TruckCardsModalConfig.displayRowsBackActive,
        },
        inactive: {
            numberOfRows: 4,
            checked: true,
            front_side: TruckCardsModalConfig.displayRowsFrontInactive,
            back_side: TruckCardsModalConfig.displayRowsBackInactive,
        },
    };
};

const saveStateToLocalStorage = (state: TruckCardData) => {
    localStorage.setItem(
        TableStringEnum.TRUCK_CARD_STATE,
        JSON.stringify(state)
    );
};

export const truckCardModalReducer = createReducer(
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
