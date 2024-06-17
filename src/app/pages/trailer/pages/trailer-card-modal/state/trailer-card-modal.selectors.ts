import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { TrailerCardData } from '@pages/trailer/pages/trailer-card-modal/models/trailer-card-data.model';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectTrailerCardDataState =
    createFeatureSelector<TrailerCardData>('trailerCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectTrailerCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectTrailerCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectTrailerCardDataState,
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
    selectTrailerCardDataState,
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
