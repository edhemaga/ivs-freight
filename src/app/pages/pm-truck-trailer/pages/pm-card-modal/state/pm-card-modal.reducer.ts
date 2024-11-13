// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/pm-truck-trailer/pages/pm-card-modal/state/pm-card-modal.actions';

// Constants
import { PMCardsModalConfig } from '@pages/pm-truck-trailer/pages/pm-card-modal/utils/constants';

// Models
import { PMCardData } from '@pages/pm-truck-trailer/pages/pm-card-modal/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): PMCardData => {
    const savedState = localStorage.getItem(TableStringEnum.PM_CARD_STATE);
    if (savedState) return JSON.parse(savedState);
    
    return {
        active: {
            numberOfRows: 4,
            checked: true,
            front_side: PMCardsModalConfig.displayRowsFrontActive,
            back_side: PMCardsModalConfig.displayRowsBackActive,
        },
        inactive: {
            numberOfRows: 4,
            checked: true,
            front_side: PMCardsModalConfig.displayRowsFrontInactive,
            back_side: PMCardsModalConfig.displayRowsBackInactive,
        },
    };
};

const saveStateToLocalStorage = (state: PMCardData) => {
    localStorage.setItem(
        TableStringEnum.PM_CARD_STATE,
        JSON.stringify(state)
    );
};

export const pmCardModalReducer = createReducer(
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
