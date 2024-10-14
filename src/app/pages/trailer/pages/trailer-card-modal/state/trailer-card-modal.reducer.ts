// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/trailer/pages/trailer-card-modal/state/trailer-card-modal.actions';

// Constants
import { TrailerCardsModalConfig } from '@pages/trailer/pages/trailer-card-modal/utils/constants/trailer-cards-modal.config';

// Models
import { TrailerCardData } from '@pages/trailer/pages/trailer-card-modal/models/trailer-card-data.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): TrailerCardData => {
    const savedState = localStorage.getItem(TableStringEnum.TRAILER_CARD_STATE);
    if (savedState) return JSON.parse(savedState);

    return {
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
};

const saveStateToLocalStorage = (state: TrailerCardData) => {
    localStorage.setItem(
        TableStringEnum.TRAILER_CARD_STATE,
        JSON.stringify(state)
    );
};

export const trailerCardModalReducer = createReducer(
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
