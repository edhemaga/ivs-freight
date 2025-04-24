// interfaces
import {
    IMilesModel,
    IMilesState,
    IMinimalListState,
} from '@pages/miles/interface';
import {
    ICardValueData,
    IMinimalListFilters,
    IStateFilters,
} from '@shared/interfaces';
import {
    ITableColumn,
    ITableResizeAction,
} from '@shared/components/new-table/interface';

// enums
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';
import { eSharedString } from '@shared/enums';

// models
import {
    MilesByUnitMinimalListResponse,
    MilesByUnitPaginatedStopsResponse,
    MilesStopDetailsResponse,
    RoutingResponse,
} from 'appcoretruckassist';
import {
    ICaMapProps,
    IMapMarkers,
    IMapRoutePath,
    MapMarkerIconHelper,
    MapOptionsConstants,
} from 'ca-components';

// configs
import { MilesTableColumnsConfig } from '@pages/miles/utils/config';

// helpers
import { MilesDropdownMenuHelper } from '@pages/miles/utils/helpers';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { StoreFunctionsHelper } from '@shared/components/new-table/utils/helpers';
import { MilesMapDropdownHelper } from '@pages/miles/pages/miles-map/utils/helpers';

export const updateTruckCounts = function (
    state: IMilesState,
    activeTruckCount: number,
    inactiveTruckCount: number
): IMilesState {
    return {
        ...state,
        tableViewData: [
            { ...state.tableViewData[0], length: activeTruckCount },
            { ...state.tableViewData[1], length: inactiveTruckCount },
        ],
        tabResults: {
            activeTruckCount,
            inactiveTruckCount,
        },
    };
};

export const changeViewMode = function (
    state: IMilesState,
    activeViewMode: eActiveViewMode
): IMilesState {
    const {
        tableSettings,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    return {
        ...state,
        activeViewMode,
        isDetailsLoading: true,
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
};

export const updateMilesData = function (
    state: IMilesState,
    miles: IMilesModel[]
): IMilesState {
    return {
        ...state,
        items: miles,
        page: 1,
        loading: false,
    };
};

export const pageChanges = function (state: IMilesState): IMilesState {
    return {
        ...state,
        page: state.page + 1,
    };
};

export const updateMilesListData = function (
    state: IMilesState,
    miles: IMilesModel[]
): IMilesState {
    const items = [...state.items, ...miles];

    return {
        ...state,
        items,
    };
};

export const updateFilters = function (
    state: IMilesState,
    filters: IStateFilters
): IMilesState {
    return {
        ...state,
        filters,
    };
};

export function onSeachFilterChange(
    state: IMilesState,
    searchQuery: string[]
): IMilesState {
    return {
        ...state,
        page: 1,
        filters: {
            ...state.filters,
            searchQuery,
        },
    };
}

export const updateTabSelection = function (
    state: IMilesState,
    selectedTab: eMileTabs
): IMilesState {
    return {
        ...state,
        selectedTab,
        filters: {},
    };
};

export const setUnitDetails = function (
    state: IMilesState,
    details: MilesByUnitPaginatedStopsResponse
): IMilesState {
    const selectedTab = details.truck.status
        ? eMileTabs.ACTIVE
        : eMileTabs.INACTIVE;
    const minimalListFilters = getTruckNavigationMeta(
        details.truck.id,
        state.minimalList
    );
    return {
        ...state,
        selectedTab,
        isDetailsLoading: false,
        details: {
            ...state.details,
            data: details,
            currentPage: details.stops.pageIndex,
            totalCount: details.stops.count,
            stops: details.stops.data,
            activeUnitId: details.truck.id,
        },
        minimalListFilters,
    };
};
export const updateUnitDetails = function (
    state: IMilesState,
    details: MilesByUnitPaginatedStopsResponse
): IMilesState {
    const newData = details.stops?.data ?? [];

    return {
        ...state,
        details: {
            ...state.details,
            stops: [...state.details.stops, ...newData],
            currentPage: state.details.currentPage + 1,
        },
    };
};

export const setUnitMapRoutes = function (
    state: IMilesState,
    unitMapRoutes: RoutingResponse
): IMilesState {
    return { ...state, unitMapRoutes };
};

export const setMapSelectedStop = function (
    state: IMilesState,
    unitStopData: MilesStopDetailsResponse
): IMilesState {
    const { unitMapData } = state;

    const markerData = unitMapData.routingMarkers.find(
        (marker) => marker.data?.id === unitStopData.id
    );

    let selectedRoutingMarkerData: IMapMarkers = null;

    if (markerData)
        selectedRoutingMarkerData = {
            ...markerData,
            infoWindowContent:
                MilesMapDropdownHelper.getMilesUnitMapDropdownConfig(
                    unitStopData
                ),
            data: { ...unitStopData },
        };

    const newMapData = { ...unitMapData, selectedRoutingMarkerData };

    return { ...state, unitMapData: newMapData };
};

export const setUnitMapData = function (state: IMilesState): IMilesState {
    const {
        unitMapRoutes,
        details: { stops },
    } = state || {};

    let routeMarkers: IMapMarkers[] = [];
    let routePaths: IMapRoutePath[] = [];

    stops?.map((stop, index) => {
        const routeMarker: IMapMarkers = {
            position: {
                lat: stop.latitude,
                lng: stop.longitude,
            },
            content: MapMarkerIconHelper.getMilesMarkerElement(
                stop.order ?? 0,
                stop.type.name.toLowerCase(),
                stop.location.address,
                index
            ),
            hasClickEvent: true,
            data: { ...stop },
        };

        routeMarkers = [...routeMarkers, routeMarker];

        if (index > 0) {
            const isDashedPath = !!stops?.[index - 1]?.empty;

            const strokeColor =
                stops?.[index - 1].type.name === eSharedString.TOWING
                    ? MapOptionsConstants.ROUTING_PATH_COLORS.purple
                    : MapOptionsConstants.ROUTING_PATH_COLORS.gray;

            const routePath: IMapRoutePath = {
                path: [],
                decodedShape: unitMapRoutes?.legs?.[index - 1]?.decodedShape,
                strokeColor,
                strokeOpacity: 1,
                strokeWeight: 4,
                isDashed: isDashedPath,
            };

            routePaths = [...routePaths, routePath];
        }
    });

    const unitMapData = {
        markers: [],
        clusterMarkers: [],
        darkMode: false,
        isZoomShown: true,
        isVerticalZoom: true,
        routingMarkers: routeMarkers,
        routePaths: routePaths,
    } as ICaMapProps;

    return { ...state, unitMapData };
};

export const toggleTableLockingStatus = function (
    state: IMilesState,
    isLocked?: boolean
): IMilesState {
    const {
        tableSettings,
        activeViewMode,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;

    const isTableLocked = isLocked ?? !tableSettings.isTableLocked;

    const toolbarDropdownMenuOptions =
        MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
            activeViewMode,
            isTableLocked,
            cardFlipViewMode,
            isToolbarDropdownMenuColumnsActive
        );

    return {
        ...state,
        tableSettings: {
            ...tableSettings,
            isTableLocked,
        },
        toolbarDropdownMenuOptions,
    };
};

export function pinTableColumn(
    state: IMilesState,
    column: ITableColumn
): IMilesState {
    return {
        ...state,
        columns: StoreFunctionsHelper.togglePinned(column, state.columns),
    };
}

export function tableSortingChange(
    state: IMilesState,
    column: ITableColumn
): IMilesState {
    const { columns, sortKey, sortDirection, label } =
        StoreFunctionsHelper.toggleSort(column, state.columns);

    return {
        ...state,
        columns,
        tableSettings: {
            ...state.tableSettings,
            sortDirection,
            sortKey,
            label,
        },
    };
}

export function toggleColumnVisibility(
    state: IMilesState,
    columnKey: string,
    isActive: boolean
): IMilesState {
    const columns = StoreFunctionsHelper.mapColumnsVisibility(
        state.columns,
        columnKey,
        isActive
    );

    return {
        ...state,
        columns,
    };
}

export function onSearchChange(
    state: IMilesState,
    search: string
): IMilesState {
    return {
        ...state,
        details: {
            ...state.details,
            searchString: search,
        },
    };
}

export function resetTable(state: IMilesState): IMilesState {
    const {
        activeViewMode,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;

    return {
        ...state,
        columns: MilesTableColumnsConfig.columnsConfig,
        tableSettings: {
            isTableLocked: true,
            sortKey: null,
            sortDirection: null,
            label: '',
        },
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                true,
                cardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
}

export function toggleCardFlipViewMode(state: IMilesState): IMilesState {
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
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                nextCardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
}

export function setToolbarDropdownMenuColumnsActive(
    state: IMilesState,
    isActive: boolean
): IMilesState {
    const { cardFlipViewMode, activeViewMode, tableSettings, columns } = state;

    const toolbarDropdownColumns =
        DropdownMenuColumnsActionsHelper.mapToolbarDropdownColumnsNew(columns);

    return {
        ...state,
        isToolbarDropdownMenuColumnsActive: isActive,
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isActive,
                toolbarDropdownColumns
            ),
    };
}

export function tableResizeChange(
    state: IMilesState,
    resizeAction: ITableResizeAction
): IMilesState {
    const { columns } = state;
    const { id, newWidth } = resizeAction;

    const resizedColumns = StoreFunctionsHelper.updateColumnWidth(
        columns,
        id,
        newWidth
    );

    return {
        ...state,
        columns: resizedColumns,
    };
}
export function setInitalMinimalList(
    state: IMilesState,
    list: MilesByUnitMinimalListResponse,
    text: string
): IMilesState {
    const data = list.pagination?.data ?? [];
    const totalCount = list.pagination?.count ?? 0;

    return {
        ...state,
        minimalList: {
            data,
            currentPage: 1,
            totalCount,
            searchString: text,
        },
    };
}

export function appendToMinimalList(
    state: IMilesState,
    list: MilesByUnitMinimalListResponse
): IMilesState {
    const newData = list.pagination?.data ?? [];
    const totalCount = list.pagination?.count ?? state.minimalList.totalCount;

    return {
        ...state,
        minimalList: {
            ...state.minimalList,
            data: [...state.minimalList.data, ...newData],
            currentPage: state.minimalList.currentPage + 1,
            totalCount,
        },
    };
}

function getTruckNavigationMeta(
    currentId: number,
    truckList: IMinimalListState
): IMinimalListFilters {
    const index = truckList.data.findIndex(
        (truck) => truck.truck.id === currentId
    );

    const isFirst = index === 0;
    const isLast = index === truckList.data.length - 1;

    if (index === -1) {
        return {
            isFirst: true,
            isLast: false,
            prevId: null,
            nextId: truckList.data[0]?.truck.id ?? null,
        };
    }

    const prevId = !isFirst ? truckList.data[index - 1].truck.id : null;
    const nextId = !isLast ? truckList.data[index + 1].truck.id : null;

    return {
        isFirst,
        isLast,
        prevId,
        nextId,
    };
}

export function setColumnsModalResult(
    state: IMilesState,
    frontSideData: ICardValueData[],
    backSideData: ICardValueData[]
): IMilesState {
    return {
        ...state,
        frontSideData,
        backSideData,
    };
}
