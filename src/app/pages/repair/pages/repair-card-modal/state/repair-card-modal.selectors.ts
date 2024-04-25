import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { RepairCardData } from '@pages/repair/pages/repair-card-modal/models/repair-card-data.model';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectRepairCardDataState =
    createFeatureSelector<RepairCardData>('repairCardData');

export const selectActiveModalTabs = (
    type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE | TableStringEnum.REPAIR_SHOP
) => createSelector(selectRepairCardDataState, (state) => state[type]);

export const selectInactiveModalTabs = createSelector(
    selectRepairCardDataState,
    (state) => state.inactive
);

export const selectActiveTabCards = createSelector(
    selectRepairCardDataState,
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
    selectRepairCardDataState,
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

export const selectRepairShopTabCards = createSelector(
    selectRepairCardDataState,
    (state) => {
        if (state.repair_shop) {
            const filteredCardRowsFront =
                state.repair_shop.front_side.filter(Boolean);

            const filteredCardRowsBack =
                state.repair_shop.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);
