// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setClosedTabCards,
    setPendingTabCards,
    setTemplateTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.actions';

// Constants
import { LoadCardModalConfig } from '@pages/load/pages/load-card-modal/utils/constants/load-card-modal.config';

// Models
import { LoadCardData } from '@pages/load/pages/load-card-modal/models/load-card-data.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): LoadCardData => {
    const savedState = localStorage.getItem(TableStringEnum.LOAD_CARD_STATE);
    if (savedState) return JSON.parse(savedState);

    return {
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
        closed: {
            numberOfRows: 4,
            checked: true,
            front_side: LoadCardModalConfig.displayRowsFrontClosed,
            back_side: LoadCardModalConfig.displayRowsBackClosed,
        },
    };
};

const saveStateToLocalStorage = (state: LoadCardData) => {
    localStorage.setItem(
        TableStringEnum.LOAD_CARD_STATE,
        JSON.stringify(state)
    );
};

export const loadCardModalReducer = createReducer(
    getInitialState(),
    on(setActiveTabCards, (state, active) => {
        const newState = { ...state, active };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setPendingTabCards, (state, pending) => {
        const newState = { ...state, pending };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setTemplateTabCards, (state, template) => {
        const newState = { ...state, template };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setClosedTabCards, (state, closed) => {
        const newState = { ...state, closed };
        saveStateToLocalStorage(newState);
        return newState;
    })
);
