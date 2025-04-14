// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Models
import { IClosedLoadStatus } from '@pages/load/models';
import { LoadStatusHistoryResponse } from 'appcoretruckassist';

// Intefaces
import { ILoadState } from '@pages/new-load/interfaces';

// It has to have same name as in StoreModule.forRoot inside app module
export const loadsFeatureKey: string = 'newLoad';

export const selectLoadState =
    createFeatureSelector<ILoadState>(loadsFeatureKey);

export const selectLoads = createSelector(
    selectLoadState,
    (state: ILoadState) => state.loads
);

//#region Tabs
export const toolbarTabsSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.toolbarTabs
);

export const selectedTabSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.selectedTab
);

//#endregion

//#region View: CARD | LIST
export const activeViewModeSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.activeViewMode
);

//#endregion

//#region Filters
export const filtersDropdownListSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.filtersDropdownList
);

export const filtersSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.filters
);

//#endregion

//#region Table
export const tableColumnsSelector = createSelector(selectLoadState, (state) => {
    const { tableColumns } = state;
    return tableColumns;
});

export const tableSettingsSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.tableSettings
);
//#endregion

//#region Details
export const loadDetailsSelector = createSelector(selectLoadState, (state) => {
    const { details } = state;
    console.log('loadDetailsSelectorloadDetailsSelector');
    return details;
});

export const minimalListSelector = createSelector(selectLoadState, (state) => {
    const { minimalList } = state;
    console.log('minimalListSelector');
    return minimalList;
});

export const closedLoadStatusSelector = createSelector(
    selectLoadState,
    (state) => {
        const { details } = state;
        // TODO: WE WILL GET THIS FROM BACKEND LEAVE IT LIKE THIS FOR NOW
        const calculateWidths = (
            statuses: LoadStatusHistoryResponse[]
        ): IClosedLoadStatus[] => {
            let totalDuration = 0;

            statuses.forEach((curr) => {
                if (curr.dateTimeTo) {
                    const duration =
                        new Date(curr.dateTimeTo).getTime() -
                        new Date(curr.dateTimeFrom).getTime();
                    totalDuration += duration;
                }
            });

            // This will come from backend in the future
            const sortedDataWithWidth = [...statuses].reverse().map((item) => {
                const fromTime = new Date(item.dateTimeFrom).getTime();
                const toTime = item.dateTimeTo
                    ? new Date(item.dateTimeTo).getTime()
                    : null;

                if (toTime) {
                    const duration = toTime - fromTime;
                    const widthPercentage = (duration / totalDuration) * 100;

                    return {
                        status: item.status,
                        statusString: item.statusString,
                        dateTimeFrom: item.dateTimeFrom,
                        dateTimeTo: item.dateTimeTo,
                        id: item.status?.id,
                        width: widthPercentage.toFixed(2) + '%',
                        wait: item.wait,
                    };
                } else {
                    return {
                        status: item.status,
                        statusString: item.statusString,
                        dateTimeFrom: item.dateTimeFrom,
                        dateTimeTo: null,
                        id: item.status?.id,
                        wait: item.wait,
                        width: '0.00%',
                    };
                }
            });

            return sortedDataWithWidth;
        };

        return calculateWidths(details.data.statusHistory);
    }
);
//#endregion

//#region Toolbar hamburger menu

export const toolbarDropdownMenuOptionsSelector = createSelector(
    selectLoadState,
    (state) => {
        const { toolbarDropdownMenuOptions } = state;
        return toolbarDropdownMenuOptions;
    }
);

//#endRegion
