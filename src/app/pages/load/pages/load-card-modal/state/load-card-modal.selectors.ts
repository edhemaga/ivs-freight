import { createFeatureSelector, createSelector } from '@ngrx/store';

//Models
import { LoadCardData } from '@pages/load/pages/load-card-modal/models/load-card-data.model';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export const selectLoadCardDataState =
    createFeatureSelector<LoadCardData>('loadCardData');

export const selectActiveModalTabs = (
    type:
        | TableStringEnum.ACTIVE
        | TableStringEnum.PENDING
        | TableStringEnum.TEMPLATE
        | TableStringEnum.CLOSED
) => createSelector(selectLoadCardDataState, (state) => state[type]);

export const selectPendingModalTabs = createSelector(
    selectLoadCardDataState,
    (state) => state.pending
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

export const selectPendingTabCards = createSelector(
    selectLoadCardDataState,
    (state) => {
        if (state.pending) {
            const filteredCardRowsFront =
                state.pending.front_side.filter(Boolean);

            const filteredCardRowsBack =
                state.pending.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);

export const selectTemplateTabCards = createSelector(
    selectLoadCardDataState,
    (state) => {
        if (state.template) {
            const filteredCardRowsFront =
                state.template.front_side.filter(Boolean);

            const filteredCardRowsBack =
                state.template.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);

export const selectClosedTabCards = createSelector(
    selectLoadCardDataState,
    (state) => {
        if (state.closed) {
            const filteredCardRowsFront =
                state.closed.front_side.filter(Boolean);

            const filteredCardRowsBack =
                state.closed.back_side.filter(Boolean);

            return {
                displayRowsFront: filteredCardRowsFront,
                displayRowsBack: filteredCardRowsBack,
            };
        }
    }
);
