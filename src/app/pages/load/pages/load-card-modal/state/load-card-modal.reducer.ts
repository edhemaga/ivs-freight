//Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.actions';

//Constants
import { LoadCardModalConfig } from '@pages/load/pages/load-card-modal/utils/constants/load-card-modal.config';

//Models
import { LoadCardData } from '@pages/load/pages/load-card-modal/models/load-card-data.model';

export const loadState: LoadCardData = {
    active: {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardModalConfig.displayRowsFrontActive,
        back_side: LoadCardModalConfig.displayRowsBackActive,
    },
    inactive: {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardModalConfig.displayRowsFrontInactive,
        back_side: LoadCardModalConfig.displayRowsBackInactive,
    },
};

export const loadCardModalReducer = createReducer(
    loadState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setInactiveTabCards, (state, inactive) => ({
        ...state,
        inactive,
    }))
);
