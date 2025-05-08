// Interfaces
import { ILoadState, IMappedLoad } from '@pages/new-load/interfaces';
import {
    ITableColumn,
    ITableReorderAction,
    ITableResizeAction,
} from '@shared/components/new-table/interfaces';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
    LoadStatusFilterResponse,
    LoadStatusResponse,
    LoadTemplateListResponse,
    RoutingResponse,
    SortOrder,
} from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

// Helper
import { LoadHelper, LoadStoreHelper } from '@pages/new-load/utils/helpers';
import { FilterHelper } from '@shared/utils/helpers';
import {
    DropdownMenuColumnsActionsHelper,
    DropdownMenuToolbarContentHelper,
} from '@shared/utils/helpers/dropdown-menu-helpers';
import { StoreFunctionsHelper } from '@shared/components/new-table/utils/helpers';

// Ca components
import { eGeneralActions, IFilterAction } from 'ca-components';

// Config
import { LoadTableColumnsConfig } from '@pages/new-load/utils/config';

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    loadResponse: LoadListResponse | LoadTemplateListResponse
): ILoadState {
    const { selectedTab } = state;
    const loads: IMappedLoad[] = LoadHelper.loadMapper(
        loadResponse.pagination.data,
        selectedTab
    );
    return {
        ...state,
        loads,
        searchResultsCount: loadResponse.pagination.count,
        toolbarTabs: LoadHelper.updateTabsCount(
            loadResponse,
            state.toolbarTabs
        ),
    };
};

export const onPageChanges = function (
    state: ILoadState,
    loadResponse: LoadListResponse | LoadTemplateListResponse
): ILoadState {
    const loads = [
        ...state.loads,
        ...LoadHelper.loadMapper(
            loadResponse.pagination.data,
            state.selectedTab
        ),
    ];

    return {
        ...state,
        loads,
        currentPage: state.currentPage + 1,
    };
};

//#region Tabs
export const getLoadsPayloadOnTabTypeChange = function (
    state: ILoadState,
    selectedTabValue: eLoadStatusType
): ILoadState {
    const selectedTab = LoadHelper.loadStatusTypeToStringMap[selectedTabValue];

    return {
        ...state,
        currentPage: 1,
        filters: {
            ...state.filters,
            searchQuery: [],
        },
        selectedTab,
        tableColumns: LoadTableColumnsConfig.getLoadTableColumns(selectedTab),
    };
};

export const getViewModeChange = function (
    state: ILoadState,
    activeViewMode: eCommonElement
): ILoadState {
    const {
        tableSettings,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    return {
        ...state,
        activeViewMode,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
};
//#endregion

//#region Filters
export function onFiltersChange(
    state: ILoadState,
    filters: IFilterAction
): ILoadState {
    return {
        ...state,
        filters: FilterHelper.mapFilters(filters, state.filters),
        currentPage: 1,
    };
}

export function setFilterDropdownList(
    state: ILoadState,
    dispatcherFilters: DispatcherFilterResponse[],
    statusFilters: LoadStatusFilterResponse[]
): ILoadState {
    return {
        ...state,
        filtersDropdownList: {
            dispatcherFilters: FilterHelper.dispatcherFilter(dispatcherFilters),
            statusFilters,
        },
    };
}

export function onSeachFilterChange(
    state: ILoadState,
    searchQuery: string[]
): ILoadState {
    return {
        ...state,
        currentPage: 1,
        filters: {
            ...state.filters,
            searchQuery,
        },
    };
}

export function onTableSortingChange(
    state: ILoadState,
    column: ITableColumn
): ILoadState {
    let sortItem: {
        columns: ITableColumn[];
        sortKey: string;
        sortDirection: SortOrder | null;
        label: string;
    };

    if (state.activeViewMode === eCommonElement.CARD) {
        sortItem = StoreFunctionsHelper.toggleSortCard(
            column,
            state.tableColumns
        );
    } else {
        sortItem = StoreFunctionsHelper.toggleSort(column, state.tableColumns);
    }

    const { columns, sortKey, sortDirection, label } = sortItem;

    return {
        ...state,
        tableColumns: columns,
        tableSettings: {
            ...state.tableSettings,
            sortDirection,
            sortKey,
            label,
        },
    };
}

export function pinTableColumn(
    state: ILoadState,
    column: ITableColumn
): ILoadState {
    return {
        ...state,
        tableColumns: StoreFunctionsHelper.togglePinned(
            column,
            state.tableColumns
        ),
    };
}

export function tableResizeChange(
    state: ILoadState,
    resizeAction: ITableResizeAction
): ILoadState {
    const { tableColumns } = state;
    const { id, newWidth } = resizeAction;

    const resizedColumns = StoreFunctionsHelper.updateColumnWidth(
        tableColumns,
        id,
        newWidth
    );

    return {
        ...state,
        tableColumns: resizedColumns,
    };
}

export function tableReorderChange(
    state: ILoadState,
    reorderAction: ITableReorderAction
): ILoadState {
    const { tableColumns } = state;

    const reorderedColumns = StoreFunctionsHelper.reorderColumns(
        tableColumns,
        reorderAction
    );

    return {
        ...state,
        tableColumns: reorderedColumns,
    };
}
//#endregion

//#region Details
export function onGetLoadByIdSuccess(
    state: ILoadState,
    data: LoadResponse,
    minimalList: LoadMinimalListResponse,
    mapRoutes: RoutingResponse
): ILoadState {
    return LoadStoreHelper.setLoadDetailsState(
        (state = {
            ...state,
            minimalList: {
                pagination: minimalList,
                groupedByStatusTypeList:
                    LoadStoreHelper.groupedByStatusTypeList(minimalList),
            },
        }),
        data,
        false,
        LoadStoreHelper.mapRouting(mapRoutes, data.stops)
    );
}

export function onGetLoadById(state: ILoadState): ILoadState {
    return LoadStoreHelper.setLoadDetailsState(state, {}, true, {});
}

export function onGetLoadByIdError(state: ILoadState): ILoadState {
    return LoadStoreHelper.setLoadDetailsState(state, {}, false, {});
}

export function onMapVisibilityToggle(state: ILoadState): ILoadState {
    const { details } = state;

    return {
        ...state,
        details: {
            ...details,
            isMapOpen: !details.isMapOpen,
        },
    };
}

export function onSelectLoad(state: ILoadState, id: number): ILoadState {
    const updatedLoads = state.loads.map((load) =>
        load.id === id ? { ...load, isSelected: !load.isSelected } : load
    );

    const areAllLoadsSelected = state.loads.every((load) => load.isSelected);

    return {
        ...state,
        loads: updatedLoads,
        areAllLoadsSelected,
    };
}

export function onSelectAllLoads(
    state: ILoadState,
    action: string
): ILoadState {
    const shouldSelectAll =
        action === eGeneralActions.SELECT_ALL ||
        action === eGeneralActions.CLEAR_SELECTED
            ? !state.areAllLoadsSelected
            : true;

    const updatedLoads = state.loads.map((load) => ({
        ...load,
        isSelected: shouldSelectAll,
    }));

    return {
        ...state,
        loads: updatedLoads,
        areAllLoadsSelected: shouldSelectAll,
    };
}

//#endregion

//#region Delete
export function onDeleteLoadListSuccess(
    state: ILoadState,
    selectedIds: number[]
): ILoadState {
    const { selectedTab, toolbarTabs } = state;

    const updatedLoads = state.loads.filter(
        (load) => !selectedIds.includes(load.id)
    );

    return {
        ...state,
        loads: updatedLoads,
        toolbarTabs: LoadStoreHelper.updateTabsAfterDelete(
            toolbarTabs,
            updatedLoads,
            selectedTab
        ),
        searchResultsCount: state.searchResultsCount - selectedIds.length,
    };
}

export function onDeleteLoad(state: ILoadState, id: number): ILoadState {
    const { selectedTab, toolbarTabs } = state;
    const updatedLoads = state.loads.filter((load) => load.id !== id);

    return {
        ...state,
        loads: updatedLoads,
        toolbarTabs: LoadStoreHelper.updateTabsAfterDelete(
            toolbarTabs,
            updatedLoads,
            selectedTab
        ),
    };
}

//#endregion

//#region Toolbar Hamburger Menu
export function setToolbarDropdownMenuColumnsActive(
    state: ILoadState,
    isActive: boolean
): ILoadState {
    const { cardFlipViewMode, activeViewMode, tableSettings, tableColumns } =
        state;
    const toolbarDropdownColumns =
        DropdownMenuColumnsActionsHelper.mapToolbarDropdownColumnsNew(
            tableColumns
        );
    return {
        ...state,
        isToolbarDropdownMenuColumnsActive: isActive,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isActive,
                toolbarDropdownColumns
            ),
    };
}

export function toggleColumnVisibility(
    state: ILoadState,
    columnKey: string,
    isActive: boolean
): ILoadState {
    const tableColumns = StoreFunctionsHelper.mapColumnsVisibility(
        state.tableColumns,
        columnKey,
        isActive
    );
    return {
        ...state,
        tableColumns,
    };
}

export function toggleTableLockingStatus(state: ILoadState): ILoadState {
    const {
        tableSettings,
        activeViewMode,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    const toolbarDropdownMenuOptions =
        DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
            activeViewMode,
            !tableSettings.isTableLocked,
            cardFlipViewMode,
            isToolbarDropdownMenuColumnsActive
        );
    return {
        ...state,
        tableSettings: {
            ...tableSettings,
            isTableLocked: !tableSettings.isTableLocked,
        },
        toolbarDropdownMenuOptions,
    };
}

export function toggleCardFlipViewMode(state: ILoadState): ILoadState {
    const {
        cardFlipViewMode,
        activeViewMode,
        tableSettings,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    const nextCardFlipViewMode =
        cardFlipViewMode === eCardFlipViewMode.FRONT
            ? eCardFlipViewMode.BACK
            : eCardFlipViewMode.FRONT;
    return {
        ...state,
        cardFlipViewMode: nextCardFlipViewMode,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                nextCardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
}
//#endregion

export function openChangeStatusDropdownSuccessResult(
    state: ILoadState,
    possibleStatuses: LoadPossibleStatusesResponse,
    loadId: number
): ILoadState {
    return {
        ...state,
        possibleStatuses,
        loadIdLoadStatusChange: loadId,
    };
}

export const updateLoadStatusSuccessResult = function (
    state: ILoadState,
    status: LoadStatusResponse,
    load: LoadResponse
): ILoadState {
    const { statusType, id } = load;
    const { loads, selectedTab, toolbarTabs } = state || {};
    let loadsClone: IMappedLoad[] = structuredClone(loads);
    let toolbarTabsClone = structuredClone(toolbarTabs);
    let searchResultsCount = state.searchResultsCount;

    if (statusType?.name === selectedTab) {
        let loadUpdated: IMappedLoad = (<IMappedLoad[]>loadsClone).find(
            (_) => _.id === id
        );

        loadUpdated.status = status;
    } else {
        toolbarTabsClone = toolbarTabsClone.map((tab) => {
            if (tab.title === selectedTab) {
                searchResultsCount = searchResultsCount - 1;
                return {
                    ...tab,
                    length: tab.length - 1,
                };
            }

            if (tab.title === statusType?.name) {
                return {
                    ...tab,
                    length: tab.length + 1,
                };
            }

            return tab;
        });
        loadsClone = loadsClone.filter((_) => _.id !== id);
    }

    const result: ILoadState = {
        ...state,
        loads: loadsClone,
        toolbarTabs: toolbarTabsClone,
        searchResultsCount,
    };

    return result;
};
