import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { PMCardData } from '@pages/pm-truck-trailer/pages/pm-card-modal/models';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectPMCardDataState =
    createFeatureSelector<PMCardData>('pmCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectPMCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectPMCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectPMCardDataState,
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
    selectPMCardDataState,
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
