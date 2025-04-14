// Interface
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import {
    LoadMinimalListResponse,
    LoadResponse,
    LoadStopResponse,
    RoutingResponse,
} from 'appcoretruckassist';

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
        console.log('groupedByStatusTypeList');
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
        console.log('setLoadDetailsState');
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
}
