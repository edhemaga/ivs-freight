//Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/customer/pages/customer-table/components/customer-card-modal/state/customer-card-modal.actions';

//Constants
import { CustomerCardsModalConfig } from '@pages/customer/pages/customer-table/components/customer-card-modal/constants/customer-cards-modal.config';

//Models
import { CustomerCardData } from '@pages/customer/pages/customer-table/components/customer-card-modal/models/customer-card-data.model';

export const customerState: CustomerCardData = {
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

export const customerCardModalReducer = createReducer(
    customerState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setInactiveTabCards, (state, inactive) => ({
        ...state,
        inactive,
    }))
);
