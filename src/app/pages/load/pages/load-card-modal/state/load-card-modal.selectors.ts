import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { LoadCardData } from '@pages/load/pages/load-card-modal/models/load-card-data.model';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectLoadCardDataState =
    createFeatureSelector<LoadCardData>('loadCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectLoadCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectLoadCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectLoadCardDataState,
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
    selectLoadCardDataState,
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