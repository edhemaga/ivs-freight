// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/user/pages/user-card-modal/state/user-card-modal.actions';

// Constants
import { UserCardsModalConfig } from '@pages/user/pages/user-card-modal/utils/constants';

// Models
import { UserCardData } from '@pages/user/pages/user-card-modal/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): UserCardData => {
    const savedState = localStorage.getItem(TableStringEnum.USER_CARD_STATE);
    if (savedState) return JSON.parse(savedState);
    
    return {
        active: {
            numberOfRows: 4,
            checked: true,
            front_side: UserCardsModalConfig.displayRowsFrontActive,
            back_side: UserCardsModalConfig.displayRowsBackActive,
        },
        inactive: {
            numberOfRows: 4,
            checked: true,
            front_side: UserCardsModalConfig.displayRowsFrontInactive,
            back_side: UserCardsModalConfig.displayRowsBackInactive,
        },
    };
};

const saveStateToLocalStorage = (state: UserCardData) => {
    localStorage.setItem(
        TableStringEnum.USER_CARD_STATE,
        JSON.stringify(state)
    );
};

export const userCardModalReducer = createReducer(
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
