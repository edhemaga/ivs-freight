import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { DriverCardData } from '@pages/driver/pages/driver-card-modal/models/driver-card-data.model';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectDriverCardDataState =
    createFeatureSelector<DriverCardData>('driverCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE | TableStringEnum.APPLICANTS
) => createSelector(selectDriverCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectDriverCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectDriverCardDataState,
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
    selectDriverCardDataState,
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

export const selectDriverApplicantTabCards = createSelector(
    selectDriverCardDataState,
    (state) => {
        if (state.applicants) {
            const filteredCardRowsFront =
                state.applicants.front_side.filter(Boolean);

            const filteredCardRowsBack =
                state.applicants.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);
