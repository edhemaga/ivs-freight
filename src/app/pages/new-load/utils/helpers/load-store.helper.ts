// Interface
import { ILoadState, IMappedLoad } from '@pages/new-load/interfaces';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { LoadStatusEnum } from '@shared/enums';

// Models
import {
    LoadMinimalListResponse,
    LoadResponse,
    LoadStatus,
    LoadStatusResponse,
    LoadStopResponse,
    RoutingResponse,
    UpdateLoadStatusCommand,
} from 'appcoretruckassist';
import { ITableData } from '@shared/models';
import { AddressData } from '@ca-shared/components/ca-input-address-dropdown/models/address-data.model';

// Ca components
import {
    IMapMarkers,
    IMapRoutePath,
    MapMarkerIconHelper,
    MapOptionsConstants,
    ICaMapProps,
} from 'ca-components';

export class LoadStoreHelper {
    static groupedByStatusTypeList(
        minimalList: LoadMinimalListResponse
    ): Record<string, LoadMinimalListResponse[]> {
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

    static setLoadDetailsState(
        state: ILoadState,
        data: LoadResponse,
        isLoading: boolean,
        mapRoutes: ICaMapProps
    ): ILoadState {
        const stops = data?.stops || [];

        const isFirstStopDeadhead = stops[0]?.stopType?.id === 0;

        const stopCount = stops.length - (isFirstStopDeadhead ? 1 : 0);

        const extraStopCount =
            stops.length <= 2
                ? 0
                : isFirstStopDeadhead
                  ? stops.length - 3
                  : stops.length - 2;

        return {
            ...state,
            details: {
                data,
                isLoading,
                isMapOpen: true,
                stopCount,
                extraStopCount,
                reveresedHistory: data.statusHistory?.slice()?.reverse(),
                mapRoutes,
            },
        };
    }

    static mapRouting(mapRoutes: RoutingResponse, stops: LoadStopResponse[]) {
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
    }

    static getTotalLoadSum(loads: IMappedLoad[]): number {
        return loads.reduce((sum, item) => sum + (item.totalDue || 0), 0);
    }

    static updateTabsAfterDelete(
        toolbarTabs: ITableData[],
        updatedLoads: IMappedLoad[],
        selectedTab: eLoadStatusStringType
    ): ITableData[] {
        return toolbarTabs.map((tab, index) => {
            if (index === 0 && selectedTab === eLoadStatusStringType.TEMPLATE) {
                return { ...tab, length: updatedLoads.length };
            }

            if (index === 1 && selectedTab === eLoadStatusStringType.PENDING) {
                return { ...tab, length: updatedLoads.length };
            }

            return tab;
        });
    }

    static isOpenChangeStatusLocationModal(
        currentStatus: LoadStatusResponse,
        nextStatus: LoadStatusResponse
    ): boolean {
        const statusesWithLocation = [
            LoadStatusEnum.RepairDispatched,
            LoadStatusEnum.RepairLoaded,
            LoadStatusEnum.RepairOffloaded,
        ];

        const canceledStatusesWithLocation = [
            LoadStatusEnum.RepairDispatched,
            LoadStatusEnum.Dispatched,
        ];

        const lCanceledStatusesWithLocation = [
            LoadStatusEnum.Loaded,
            LoadStatusEnum.Offloaded,
            LoadStatusEnum.RepairLoaded,
            LoadStatusEnum.RepairOffloaded,
        ];

        const canceledStatusesWithLocationCondition =
            canceledStatusesWithLocation.includes(
                currentStatus.statusValue.id
            ) && nextStatus.statusValue.id === LoadStatusEnum.Cancelled;
        const lCanceledStatusesWithLocationCondition =
            lCanceledStatusesWithLocation.includes(
                currentStatus.statusValue.id
            ) && nextStatus.statusValue.id === LoadStatusEnum.LoadCanceled;

        const statusesWithLocationCondition = statusesWithLocation.includes(
            nextStatus.statusValue.id
        );

        const result =
            canceledStatusesWithLocationCondition ||
            lCanceledStatusesWithLocationCondition ||
            statusesWithLocationCondition;

        return result;
    }

    static composeUpdateLoadStatusCommand(
        value: AddressData,
        status: LoadStatusResponse,
        loadId: number
    ): UpdateLoadStatusCommand {
        const { address, longLat } = value || {};
        const { longitude, latitude } = longLat || {};

        const updateLoadStatusComand: UpdateLoadStatusCommand = {
            id: loadId,
            status: status.statusValue.name as LoadStatus,
            repairLocation: address,
            longitude,
            latitude,
        };

        return updateLoadStatusComand;
    }
}
