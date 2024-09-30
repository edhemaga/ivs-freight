//Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/user/pages/user-card-modal/state/user-card-modal.actions';

//Constants
import { UserCardsModalConfig } from '@pages/user/pages/user-card-modal/utils/constants';

//Models
import { UserCardData } from '@pages/user/pages/user-card-modal/models';

export const userState: UserCardData = {
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

export const userCardModalReducer = createReducer(
    userState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setInactiveTabCards, (state, inactive) => ({
        ...state,
        inactive,
    }))
);
