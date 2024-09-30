import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { UserCardData } from '@pages/user/pages/user-card-modal/models';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectUserCardDataState =
    createFeatureSelector<UserCardData>('userCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
) => createSelector(selectUserCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectUserCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectUserCardDataState,
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
    selectUserCardDataState,
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
