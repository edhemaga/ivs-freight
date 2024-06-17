//Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/trailer/pages/trailer-card-modal/state/trailer-card-modal.actions';

//Constants
import { TrailerCardsModalConfig } from '@pages/trailer/pages/trailer-card-modal/utils/constants/trailer-cards-modal.config';

//Models
import { TrailerCardData } from '@pages/trailer/pages/trailer-card-modal/models/trailer-card-data.model';

export const trailerState: TrailerCardData = {
    active: {
        numberOfRows: 4,
        checked: true,
        front_side: TrailerCardsModalConfig.displayRowsFrontActive,
        back_side: TrailerCardsModalConfig.displayRowsBackActive,
    },
    inactive: {
        numberOfRows: 4,
        checked: true,
        front_side: TrailerCardsModalConfig.displayRowsFrontInactive,
        back_side: TrailerCardsModalConfig.displayRowsBackInactive,
    },
};

export const trailerCardModalReducer = createReducer(
    trailerState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setInactiveTabCards, (state, inactive) => ({
        ...state,
        inactive,
    }))
);
