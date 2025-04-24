import { createFeatureSelector, createSelector } from '@ngrx/store';

// Models
import {
    MilesStopShortReponseWithRowType,
    PayrollState,
} from '@pages/accounting/pages/payroll/state/models';
import {
    MilesStopShortResponse,
    PayrollCountItemResponse,
    PayrollCountsResponse,
} from 'appcoretruckassist';

// Constants
import {
    PayrollDriverMilesTableSettingsConstants,
    PayrollDriverCommisionTableSettingsConstants,
    PayrollOwnerTableSettingsConstants,
} from '@pages/accounting/utils/constants';
import {
    ICaMapProps,
    IMapMarkers,
    IMapRoutePath,
    MapMarkerIconHelper,
    MapOptionsConstants,
} from 'ca-components';

const payrollNamesData = {
    soloMiles: { text: 'Driver', type: 'Miles' },
    soloFlatRate: { text: 'Driver', type: 'Flat Rate' },
    soloCommission: { text: 'Driver', type: 'Commission' },
    owner: { text: 'Owner', type: '' },
    teamCommission: { text: 'Team Commission', type: '' },
    teamFlatRate: { text: 'Flat Rate', type: '' },
    teamMiles: { text: 'Team Miles', type: '' },
};

const payrollStatus = {
    Paid: 'success',
    Debt: 'danger',
    Ready: 'positive',
};

export const selectPayrollState =
    createFeatureSelector<PayrollState>('payroll');

export const selectPayrollCount = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollCounts;
    }
);

export const selectPayrollLoad = createSelector(selectPayrollState, (state) => {
    return state.loading;
});

export const selectPayrollReportLoading = createSelector(
    selectPayrollState,
    (state) => {
        return state.reportLoading;
    }
);

export const selectPayrollReportTableExpanded = createSelector(
    selectPayrollState,
    (state) => state.expandedReportTable
);

export const selectPayrollReportMapData = createSelector(
    selectPayrollState,
    (state) => {
        const routeMarkers: IMapMarkers[] = [];
        const routePaths: IMapRoutePath[] = [];
        const mapData = (
            state.payrollOpenedReport || state.ownerPayrollResponse
        )?.mapLocations;
        const mapRoutes = state.payrollMapRoutes;

        mapData?.map((loadStop, index) => {
            const nextLoadNumber = mapData[index]?.loadNumber;
            const routeMarker: IMapMarkers = {
                position: { lat: loadStop.latitude, lng: loadStop.longitude },
                content: MapMarkerIconHelper.getRoutingMarkerElement(
                    loadStop.orderInLoad ?? 0,
                    loadStop.type.name.toLowerCase(),
                    false,
                    true,
                    loadStop.loadNumber,
                    true,
                ),
                label: loadStop.loadNumber,
            };

            routeMarkers.push(routeMarker);

            if (index > 0) {
                const routePath: IMapRoutePath = {
                    path: [],
                    decodedShape: mapRoutes?.legs?.[index - 1]?.decodedShape,
                    strokeColor: MapOptionsConstants.ROUTING_PATH_COLORS.gray,
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    isDashed: !!nextLoadNumber,
                };

                routePaths.push(routePath);

                if (index === 1) {
                    routePaths.push({
                        ...routePath,
                        strokeColor:
                            MapOptionsConstants.ROUTING_PATH_COLORS.gray,
                        strokeOpacity: 1,
                        strokeWeight: 2,
                    });
                }
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
    }
);

export const selectPayrollOpenedReport = createSelector(
    selectPayrollState,
    (state) => {
        return {
            ...state.payrollOpenedReport,
            fullName: state.payrollOpenedReport?.driver?.fullName,
            userId: state.payrollOpenedReport?.driver?.id,
            avatar: state.payrollOpenedReport?.driver?.avatarFile,
        };
    }
);

export const selectPayrollOpenedFromLeftListToReport = createSelector(
    selectPayrollState,
    (state) => state.openedPayrollLeftId
);

export const selectPayrollReportsIncludedStops = createSelector(
    selectPayrollState,
    (state) => {
        const included_only = state.payrollOpenedReport?.includedLoads || [];
        let allInculdedLoads: MilesStopShortResponse[] = [];
        included_only.map(
            (loads) =>
                (allInculdedLoads = [...allInculdedLoads, ...loads.milesStops])
        );
        return allInculdedLoads;
    }
);

export const selectPayrollDriverMileageStops = createSelector(
    selectPayrollState,
    (state) => {
        if (!state.payrollOpenedReport) return [];
        const includedLoads = state.payrollOpenedReport?.includedLoads.reduce(
            (load, old) => {
                const firstStop = old.isStartPoint;
                const nextMilesStop = old.milesStops
                    ? JSON.parse(JSON.stringify(old.milesStops))
                    : [];
                if (firstStop && nextMilesStop.length) {
                    nextMilesStop[0].loadId = -1;
                }
                return [...load, ...nextMilesStop];
            },
            [] as MilesStopShortReponseWithRowType[]
        );

        const excludedReportLoads =
            state.payrollOpenedReport?.excludedLoads ?? [];

        const excludedLoads = excludedReportLoads.reduce((load, old) => {
            return [...load, ...old.milesStops];
        }, [] as MilesStopShortReponseWithRowType[]);

        const reorderRow = {
            rowType: 'reorder',
        };

        let lastLoadId = -Infinity;
        let hasFoundFirstInRow = false;
        const finalLoadListFinal = [
            ...includedLoads,
            reorderRow,
            ...excludedLoads,
        ];
        const finalLoadList = finalLoadListFinal.map((load, index) => {
            if (load.loadId > 0) {
                load = {
                    ...load,
                    hasBorderLeft: load.loadId > 0,
                };

                const nextLoadId = finalLoadListFinal[index + 1]?.loadId;

                if (!hasFoundFirstInRow && lastLoadId !== load.loadId) {
                    load.firstInRow = true;
                    hasFoundFirstInRow = true;
                } else if (hasFoundFirstInRow && nextLoadId !== load.loadId) {
                    load.lastInRow = true;
                    hasFoundFirstInRow = false;
                }
            }

            lastLoadId = load.loadId;
            return load;
        });

        return finalLoadList;
    }
);

export const seletPayrollTabsCount = createSelector(
    selectPayrollCount,
    (payrollCounts) => {
        return {
            open: payrollCounts.opentPayrollCount,
            closed: payrollCounts.closedPayrollCount,
        };
    }
);

export const selectClosingReportStatus = createSelector(
    selectPayrollState,
    (state) => {
        return {
            loading: state.closeReportPaymentLoading,
            error: state.closeReportPaymentError,
        };
    }
);

export const selectPayrollCounts = createSelector(
    selectPayrollCount,
    (payrollCounts) => {
        const payrollCountsData = Object.keys(payrollCounts).filter(
            (item) => payrollCounts[item]
        );
        return {
            payrollCounts: payrollCounts,
            payrolls: payrollCountsData,
            payrollData: payrollCountsData
                .filter(
                    (item) =>
                        !['opentPayrollCount', 'closedPayrollCount'].includes(
                            item
                        )
                )
                .map((payroll) =>
                    getPayrollTableItem(
                        payroll,
                        payrollCounts[
                            payroll as keyof PayrollCountsResponse
                        ] as PayrollCountItemResponse
                    )
                ),
        };
    }
);

export const selectSoloDriverMileage = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollDriverMileage;
    }
);

export const selectPayrollOpenedTab = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollOpenedTab;
    }
);

export const selectDriverMileageCollapsedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverMileageCollapsedList;
    }
);

export const selectDriverMileageExpandedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverMileageExpandedList;
    }
);

export const selectPayrollLoadListForDropdown = createSelector(
    selectPayrollState,
    (state) => {
        if (!state.payrollOpenedReport) return [];
        let includedLoads = state.payrollOpenedReport?.includedLoads ?? [];

        const filteredLoads = includedLoads
            .filter((load) => !isNaN(load.id))
            .map((load) => ({
                id: +load.id,
                title: load.loadNumber,
            }));
        return filteredLoads;
    }
);

function getPayrollTableItem(
    payrollTitle: string,
    item?: PayrollCountItemResponse
) {
    return {
        text: payrollNamesData[payrollTitle].text,
        type: payrollNamesData[payrollTitle].type,
        itemCount: item?.totalCount || 0,
        money: item?.value,
        date: item.date,
        status: getStatus(item?.status.name),
        tableSettings: getTableDefinitions(payrollNamesData[payrollTitle]),
    };
}

function getStatus(item) {
    return payrollStatus[item] || '';
}

function getTableDefinitions(title) {
    switch (title) {
        case 'Driver (Mile)':
            return PayrollDriverMilesTableSettingsConstants;
        case 'Driver (Commission)':
            return PayrollDriverCommisionTableSettingsConstants;
        case 'Owner':
            return PayrollOwnerTableSettingsConstants;
    }
}
