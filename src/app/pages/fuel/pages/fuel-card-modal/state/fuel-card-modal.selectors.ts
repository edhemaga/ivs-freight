import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { FuelCardData } from '@pages/fuel/pages/fuel-card-modal/models';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectFuelCardDataState =
    createFeatureSelector<FuelCardData>('fuelCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectFuelCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectFuelCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectFuelCardDataState,
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
    selectFuelCardDataState,
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
