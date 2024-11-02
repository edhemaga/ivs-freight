import { createFeatureSelector, createSelector } from '@ngrx/store';

// Models
import { CustomerCardData } from '@pages/customer/pages/customer-table/components/customer-card-modal/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectCustomerCardDataState =
    createFeatureSelector<CustomerCardData>('customerCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectCustomerCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectCustomerCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectCustomerCardDataState,
    (state) => {
        if (state.active) {
            const filteredCardRowsFront =
                state.active.front_side.filter(Boolean);

            const filteredCardRowsBack = state.active.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);

export const selectInactiveTabCards = createSelector(
    selectCustomerCardDataState,
    (state) => {
        if (state.inactive) {
            const filteredCardRowsFront =
                state.inactive.front_side.filter(Boolean);

            const filteredCardRowsBack =
                state.inactive.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);
