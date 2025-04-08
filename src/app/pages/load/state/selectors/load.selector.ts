import { createFeatureSelector, createSelector } from '@ngrx/store';

// appcoretruckassist
import { LoadStatusHistoryResponse, TableType } from 'appcoretruckassist';

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
import { IClosedLoadStatus } from '@pages/load/models/';

// enums
import { eActiveViewMode, TableStringEnum } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';

// helpers
import { LoadStoreHelper } from '@pages/load/pages/load-table/utils/helpers';
import {
    ICaMapProps,
    IMapMarkers,
    IMapRoutePath,
    MapMarkerIconHelper,
    MapOptionsConstants,
} from 'ca-components';

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
                return LoadStoreHelper.mapTemplateData(rowData);
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
            localStorage.getItem(`table-${TableType.LoadClosed}-Configuration`)
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
export const dispatcherListSelector = createSelector(loadState, (state) => {
    const { dispatcherList } = state || {};

    return dispatcherList;
});

export const getDispatcherListSelector = createSelector(
    dispatcherListSelector,
    (dispatcherList) => {
        return dispatcherList;
    }
);

export const statusListSelector = createSelector(loadState, (state) => {
    const { statusList } = state || {};

    return statusList;
});

export const getStatusListSelector = createSelector(
    statusListSelector,
    (statusList) => {
        return statusList;
    }
);

export const staticModalDataSelector = createSelector(loadState, (state) => {
    const { modal } = state;

    return modal;
});

export const activeLoadModalDataSelector = createSelector(
    loadState,
    (state) => {
        const { activeModalData } = state;

        return activeModalData;
    }
);

export const activeLoadModalPossibleStatusesSelector = createSelector(
    loadState,
    (state) => {
        const { activeModalPossibleStatuses } = state;

        return activeModalPossibleStatuses;
    }
);

export const loadDetailsSelector = createSelector(loadState, (state) => {
    const { details } = state;

    return details;
});

export const loadStatusHistoryReversedSelector = createSelector(
    loadDetailsSelector,
    (details) => {
        const statusHistory = details?.statusHistory;

        return statusHistory?.slice()?.reverse();
    }
);

export const closedLoadStatusSelector = createSelector(loadState, (state) => {
    const { details } = state;

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

    return calculateWidths(details.statusHistory);
});

export const isLoadDetailsLoadedSelector = createSelector(
    loadState,
    (state) => {
        const { isLoadDetailsLoaded } = state;

        return isLoadDetailsLoaded;
    }
);

export const selectedCountSelector = createSelector(loadState, (state) => {
    const { selectLoadCount } = state;
    return selectLoadCount;
});

export const selectLoadRateSumSelector = createSelector(loadState, (state) => {
    const { selectLoadRateSum } = state;
    return selectLoadRateSum;
});

export const hasAllLoadsSelectedSelector = createSelector(
    loadState,
    (state) => {
        const { hasAllLoadsSelected } = state;
        return hasAllLoadsSelected;
    }
);

export const totalLoadSumSelector = createSelector(loadState, (state) => {
    const { totalLoadSum } = state;
    return totalLoadSum;
});

export const isLoadDetailsMapOpenSelector = createSelector(
    loadState,
    (state) => {
        const { isLoadDetailsMapOpen } = state;
        return isLoadDetailsMapOpen;
    }
);

export const loadDetailsStopCountSelector = createSelector(
    loadDetailsSelector,
    (loadDetails) => {
        const { stops } = loadDetails;

        if (!stops?.length) return 0;

        const stopCount = stops.length - (stops[0].stopType.id === 0 ? 1 : 0);

        return stopCount;
    }
);

export const loadDetailsExtraStopCountSelector = createSelector(
    loadDetailsSelector,
    (loadDetails) => {
        const { stops } = loadDetails;

        if (!stops || stops.length <= 2) {
            return 0;
        }

        const isFirstStopDeathHead = stops[0].stopType.id === 0;

        const extraStopCount = isFirstStopDeathHead
            ? stops.length - 3
            : stops.length - 2;

        return extraStopCount;
    }
);

export const minimalListSelector = createSelector(loadState, (state) => {
    const { minimalList } = state;
    return minimalList;
});

export const tableColumnsSelector = createSelector(loadState, (state) => {
    const { tableColumns } = state;
    return tableColumns;
});

export const groupedByStatusTypeListSelector = createSelector(
    minimalListSelector,
    (minimalList) => {
        let groupedByStatusType;
        const data = minimalList?.pagination?.data;

        if (data) {
            groupedByStatusType = data?.reduce((acc, item) => {
                const key = item.statusType.name;
                acc[key] = acc[key] || [];
                acc[key].push(item);
                return acc;
            }, {});
        }

        return groupedByStatusType;
    }
);

export const loadDetailsMapDataSelector = createSelector(loadState, (state) => {
    const {
        mapRoutes,
        details: { stops },
    } = state;

    let routeMarkers: IMapMarkers[] = [];
    let routePaths: IMapRoutePath[] = [];

    stops?.map((loadStop, index) => {
        const routeMarker: IMapMarkers = {
            position: {
                lat: loadStop.shipper.latitude,
                lng: loadStop.shipper.longitude,
            },
            content: MapMarkerIconHelper.getRoutingMarkerElement(
                loadStop.stopLoadOrder ?? 0,
                loadStop.stopType.name.toLowerCase(),
                loadStop.stopType.name === 'DeadHead' || !!loadStop.arrive,
                true,
                !loadStop.arrive ? loadStop.shipper.businessName : null,
                false,
                true,
                index
            ),
            hasClickEvent: true,
        };

        routeMarkers = [...routeMarkers, routeMarker];

        if (index > 0) {
            const isDashedPath =
                stops?.[index - 1]?.stopType?.name === 'DeadHead';
            const routeColor = !!loadStop.arrive
                ? MapOptionsConstants.ROUTING_PATH_COLORS.darkgray
                : MapOptionsConstants.ROUTING_PATH_COLORS.gray;

            const routePath: IMapRoutePath = {
                path: [],
                decodedShape: mapRoutes?.legs?.[index - 1]?.decodedShape,
                strokeColor: routeColor,
                strokeOpacity: 1,
                strokeWeight: 4,
                isDashed: isDashedPath,
            };

            routePaths = [...routePaths, routePath];
        }
    });

    return {
        markers: [],
        clusterMarkers: [],
        darkMode: false,
        isZoomShown: true,
        isVerticalZoom: true,
        routingMarkers: routeMarkers,
        routePaths: routePaths,
    } as ICaMapProps;
});
