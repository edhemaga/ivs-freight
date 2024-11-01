// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/customer/pages/customer-table/components/customer-card-modal/state/';

// Constants
import { CustomerCardsModalConfig } from '@pages/customer/pages/customer-table/components/customer-card-modal/constants';

// Models
import { CustomerCardData } from '@pages/customer/pages/customer-table/components/customer-card-modal/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): CustomerCardData => {
    const savedState = localStorage.getItem(
        TableStringEnum.CUSTOMER_CARD_STATE
    );
    if (savedState) return JSON.parse(savedState);

    return {
        active: {
            numberOfRows: 4,
            checked: true,
            front_side: CustomerCardsModalConfig.displayRowsFrontActive,
            back_side: CustomerCardsModalConfig.displayRowsBackActive,
        },
        inactive: {
            numberOfRows: 4,
            checked: true,
            front_side: CustomerCardsModalConfig.displayRowsFrontInactive,
            back_side: CustomerCardsModalConfig.displayRowsBackInactive,
        },
    };
};

const saveStateToLocalStorage = (state: CustomerCardData) => {
    localStorage.setItem(
        TableStringEnum.CUSTOMER_CARD_STATE,
        JSON.stringify(state)
    );
};

export const customerCardModalReducer = createReducer(
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
