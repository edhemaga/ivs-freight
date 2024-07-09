//Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setPendingTabCards,
    setTemplateTabCards,
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
    pending: {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardModalConfig.displayRowsFrontPending,
        back_side: LoadCardModalConfig.displayRowsBackPending,
    },
    template: {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardModalConfig.displayRowsFrontTemplate,
        back_side: LoadCardModalConfig.displayRowsBackTemplate,
    },
};

export const loadCardModalReducer = createReducer(
    loadState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setPendingTabCards, (state, pending) => ({
        ...state,
        pending,
    })),
    on(setTemplateTabCards, (state, template) => ({
        ...state,
        template,
    }))
);
