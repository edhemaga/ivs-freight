import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { TruckCardData } from '@pages/truck/pages/truck-card-modal/models';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectTruckCardDataState =
    createFeatureSelector<TruckCardData>('truckCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectTruckCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectTruckCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectTruckCardDataState,
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
    selectTruckCardDataState,
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
