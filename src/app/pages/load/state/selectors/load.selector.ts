import { createFeatureSelector, createSelector } from '@ngrx/store';

// appcoretruckassist
import { TableType } from 'appcoretruckassist';

// table settings
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '@shared/utils/settings/table-settings/load-columns';

// models
import { ILoadState } from '@pages/load/pages/load-table/models/load-state.model';
import { ITableData } from '@shared/models/table-data.model';
import {
    ILoadGridItem,
    ILoadTemplateGridItem,
    LoadModel,
} from '@pages/load/pages/load-table/models/index';
import { ITableOptions } from '@shared/models';

// enums
import { TableStringEnum } from '@shared/enums';
import {
    eActiveViewMode,
    eLoadStatusType,
} from '@pages/load/pages/load-table/enums/index';

// helpers
import { LoadStoreHelper } from '@pages/load/pages/load-table/utils/helpers/load-store.helper';

export const loadFeatureKey: string = 'load';

export const loadState = createFeatureSelector<ILoadState>(loadFeatureKey);

export const getLoadListSelector = createSelector(loadState, (state) => {
    const {
        data,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
        selectedTab,
    } = state || {};

    return {
        data,
        selectedTab,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
    };
});

export const getLoadTemplatesSelector = createSelector(loadState, (state) => {
    const {
        data,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
        selectedTab,
    } = state || {};

    return {
        data,
        selectedTab,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
    };
});

export const getSelector = createSelector(
    getLoadListSelector,
    getLoadTemplatesSelector,
    (
        loads: {
            data;
            selectedTab;
            templateCount;
            pendingCount;
            activeCount;
            closedCount;
        },
        templates: {
            data;
            selectedTab;
            templateCount;
            pendingCount;
            activeCount;
            closedCount;
        }
    ) => {
        if (loads.selectedTab === eLoadStatusType.Template)
            return { ...templates };
        else return { ...loads };
    }
);

export const viewDataSelector = createSelector(
    getSelector,
    ({ data, selectedTab }) => {
        if (!data || selectedTab === null) return [];

        if (selectedTab === eLoadStatusType.Template)
            return data.map((rowData: LoadModel) => {
                return LoadStoreHelper.mapTemplateData(
                    rowData,
                    eLoadStatusType[selectedTab]
                );
            });
        else
            return data.map((rowData) => {
                return LoadStoreHelper.mapLoadData(
                    rowData,
                    eLoadStatusType[selectedTab]
                );
            });
    }
);

export const selectedTabSelector = createSelector(
    getSelector,
    ({ selectedTab }) => {
        return selectedTab;
    }
);

export const activeViewModeSelector = createSelector(loadState, (state) => {
    const { activeViewMode } = state || {};
    return eActiveViewMode[activeViewMode];
});

export const canDeleteSelectedDataRowsSelector = createSelector(
    loadState,
    (state) => {
        const { canDeleteSelectedDataRows } = state || {};

        return canDeleteSelectedDataRows;
    }
);

export const actionItemSelector = (props: { actionItemId: number }) =>
    createSelector(loadState, (state) => {
        const { data, selectedTab } = state || {};
        const { actionItemId } = props || {};

        if (selectedTab === eLoadStatusType.Template)
            return (<ILoadTemplateGridItem[]>data).find(
                (_) => _.id === actionItemId
            );
        else return (<ILoadGridItem[]>data).find((_) => _.id === actionItemId);
    });

export const pendingCountSelector = createSelector(getSelector, (state) => {
    const { pendingCount } = state || {};

    return pendingCount;
});

export const activeCountSelector = createSelector(getSelector, (state) => {
    const { activeCount } = state || {};

    return activeCount;
});

export const closedCountSelector = createSelector(getSelector, (state) => {
    const { closedCount } = state || {};

    return closedCount;
});

export const templateCountSelector = createSelector(getSelector, (state) => {
    const { templateCount } = state || {};

    return templateCount;
});

export const tableDataSelector = createSelector(
    getSelector,
    ({
        data,
        selectedTab,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
    }) => {
        const tableTemplateColumnsConfig = JSON.parse(
            localStorage.getItem(
                `table-${TableType.LoadTemplate}-Configuration`
            )
        );
        const tablePendingActiveColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${TableType.LoadRegular}-Configuration`)
        );
        const tableClosedColumnsConfig = JSON.parse(
            localStorage.getItem(
                `table-${TableType.LoadTemplate}-Configuration`
            )
        );
        const selectedTabLowerCase =
            eLoadStatusType[selectedTab]?.toLowerCase();

        const isTemplateTabActive =
            selectedTabLowerCase === TableStringEnum.TEMPLATE;
        const isPendingTabActive =
            selectedTabLowerCase === TableStringEnum.PENDING;
        const isActiveTabActive =
            selectedTabLowerCase === TableStringEnum.ACTIVE;
        const isClosedTabActive =
            selectedTabLowerCase === TableStringEnum.CLOSED;

        const tableData: ITableData[] = [
            {
                title: TableStringEnum.TEMPLATE_2,
                field: TableStringEnum.TEMPLATE,
                length: templateCount,
                data: isTemplateTabActive ? data : [],
                extended: false,
                gridNameTitle: TableStringEnum.LOAD,
                moneyCountSelected: false,
                stateName: TableStringEnum.LOADS,
                tableConfiguration: TableType.LoadTemplate,
                isActive: isTemplateTabActive,
                gridColumns:
                    tableTemplateColumnsConfig ??
                    getLoadTemplateColumnDefinition(),
            },
            {
                title: TableStringEnum.PENDING_2,
                field: TableStringEnum.PENDING,
                length: pendingCount,
                data: isPendingTabActive ? data : [],
                extended: false,
                moneyCountSelected: false,
                gridNameTitle: TableStringEnum.LOAD,
                stateName: TableStringEnum.LOADS,
                tableConfiguration: TableType.LoadRegular,
                isActive: isPendingTabActive,
                gridColumns:
                    tablePendingActiveColumnsConfig ??
                    getLoadActiveAndPendingColumnDefinition(),
            },
            {
                title: TableStringEnum.ACTIVE_2,
                field: TableStringEnum.ACTIVE,
                length: activeCount,
                data: isActiveTabActive ? data : [],
                moneyCountSelected: false,
                extended: false,
                gridNameTitle: TableStringEnum.LOAD,
                stateName: TableStringEnum.LOADS,
                tableConfiguration: TableType.LoadRegular,
                isActive: isActiveTabActive,
                gridColumns:
                    tablePendingActiveColumnsConfig ??
                    getLoadActiveAndPendingColumnDefinition(),
            },
            {
                title: TableStringEnum.CLOSED_2,
                field: TableStringEnum.CLOSED,
                length: closedCount,
                moneyCountSelected: false,
                data: isClosedTabActive ? data : [],
                extended: false,
                gridNameTitle: TableStringEnum.LOAD,
                stateName: TableStringEnum.LOADS,
                tableConfiguration: TableType.LoadClosed,
                isActive: isClosedTabActive,
                gridColumns:
                    tableClosedColumnsConfig ?? getLoadClosedColumnDefinition(),
            },
        ]; 
        return tableData;
    }
);

export const columnsSelector = createSelector(
    tableDataSelector,
    selectedTabSelector,
    (tableData, selectedTab) => {
        const selectedTabLowerCase =
            eLoadStatusType[selectedTab]?.toLowerCase();
        const tableDataSelectedItem = tableData?.find(
            (item) => item.field === selectedTabLowerCase
        );
        const { gridColumns } = tableDataSelectedItem || {};

        return gridColumns ?? [];
    }
);

export const tableOptionsSelector = createSelector(
    selectedTabSelector,
    activeViewModeSelector,
    canDeleteSelectedDataRowsSelector,
    (selectedTab, activeViewMode, canDeleteSelectedDataRows) => {
        const selectedTabKeyLower: string =
            eLoadStatusType[selectedTab]?.toLowerCase();

        const tableOptions: ITableOptions = {
            toolbarActions: {
                hideActivationButton: true,
                showDispatcherFilter:
                    selectedTabKeyLower !== TableStringEnum.TEMPLATE,
                showTimeFilter:
                    selectedTabKeyLower !== TableStringEnum.TEMPLATE,
                showStatusFilter:
                    selectedTabKeyLower !== TableStringEnum.TEMPLATE,
                showMoneyFilter:
                    selectedTabKeyLower !== TableStringEnum.TEMPLATE,
                loadMoneyFilter: true,
                hideDeleteButton:
                    (selectedTabKeyLower !== TableStringEnum.TEMPLATE &&
                        selectedTabKeyLower !== TableStringEnum.PENDING) ||
                    !canDeleteSelectedDataRows,
                viewModeOptions: [
                    {
                        name: TableStringEnum.LIST,
                        active: activeViewMode === TableStringEnum.LIST,
                    },
                    {
                        name: TableStringEnum.CARD,
                        active: activeViewMode === TableStringEnum.CARD,
                    },
                ],
            },
        };

        return tableOptions;
    }
);

export const activeTableDataSelector = createSelector(
    tableDataSelector,
    selectedTabSelector,
    viewDataSelector,
    (tableData, selectedTab, viewData) => {
        const activeTableData = tableData?.find(
            (_) => _.title === eLoadStatusType[selectedTab]
        );
        const result = {
            ...activeTableData,
            data: [...viewData],
        };

        return result;
    }
);
