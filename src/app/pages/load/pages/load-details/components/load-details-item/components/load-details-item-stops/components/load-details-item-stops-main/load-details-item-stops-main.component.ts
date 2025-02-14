import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// svg routes
import { LoadDetailsItemSvgRoutes } from '@pages/load/pages/load-details/components/load-details-item/utils/svg-routes/load-details-item-svg.routes';

// components
import {
    CaMapComponent,
    ICaMapProps,
    IMapMarkers,
    IMapRoutePath,
    MapMarkerIconService,
    MapOptionsConstants,
} from 'ca-components';

// helpers
import { LoadDetailsItemHelper } from '@pages/load/pages/load-details/components/load-details-item/utils/helpers/load-details-item.helper';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatTimePipe } from '@shared/pipes/format-time.pipe';
import { KeyValuePairsPipe } from '@shared/pipes/key-value-pairs.pipe';

// enums
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';

// models
import {
    LoadResponse,
    LoadStatusHistoryResponse,
    LoadStopResponse,
    RoutingResponse,
} from 'appcoretruckassist';
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';
import { MapRoute } from '@shared/models/map-route.model';
import { LoadStop } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop.model';
import { LoadStopItem } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-item.model';
import { StopRoutes } from '@shared/models/stop-routes.model';
import { LoadStopLastStatus } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-last-status.model';

// services
import { LoadService } from '@shared/services/load.service';

@Component({
    selector: 'app-load-details-item-stops-main',
    templateUrl: './load-details-item-stops-main.component.html',
    styleUrls: ['./load-details-item-stops-main.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        CaMapComponent,

        // pipes
        FormatDatePipe,
        FormatTimePipe,
        KeyValuePairsPipe,
    ],
})
export class LoadDetailsItemStopsMainComponent implements OnChanges, OnDestroy {
    @Input() stopsData: LoadResponse;
    @Input() isMapDisplayed: boolean;
    @Input() isSmallDesign: boolean;

    private destroy$ = new Subject<void>();

    public loadDetailsItemSvgRoutes = LoadDetailsItemSvgRoutes;

    public stopHeaderItems: string[] = [];

    public loadStopData: LoadStop[] = [];
    public loadStopRoutes: MapRoute[] = [];

    // items
    public stopItemsHeaderItems: StopItemsHeaderItem[] = [];
    public stopItemDropdownIndex: number = -1;

    public itemHoveringIndex: number = -1;

    // map
    public mapData: ICaMapProps = MapOptionsConstants.defaultMapConfig;

    constructor(
        private markerIconService: MapMarkerIconService,
        private loadService: LoadService
    ) {}

    ngAfterViewInit(): void {
        this.addScrollEventListeners();

        this.getMapData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stopsData?.currentValue) {
            this.getConstantData();

            this.getStopsData(changes?.stopsData?.currentValue?.stops);

            this.getLoadStopRoutes(changes?.stopsData?.currentValue?.stops);

            this.getMapData();

            this.stopItemDropdownIndex = -1;

            setTimeout(() => {
                this.addScrollEventListeners();
            }, 500);
        }
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    private getConstantData(): void {
        this.stopHeaderItems = LoadDetailsItemHelper.getStopHeaderItems(
            this.stopsData?.statusType?.name,
            this.isSmallDesign
        );

        this.stopItemsHeaderItems =
            LoadDetailsItemHelper.getStopItemsHeaderItems();
    }

    private getStopsData(stops: LoadStopResponse[]): void {
        this.loadStopData = stops.map((stop) => {
            const lastStatus = this.getLoadStopLastStatus(
                !!stop?.depart,
                stop?.statusHistory,
                stop?.stopType?.name
            );

            return {
                ...stop,
                ...lastStatus,
                items: this.getLoadStopItemsData(stop),
            };
        });
    }

    private getLoadStopItemsData(stop: LoadStopResponse): LoadStopItem[] {
        const { items } = stop;

        const filteredItems: LoadStopItem[] = [];

        if (items?.length) {
            items.forEach((item) => {
                const {
                    id,
                    description,
                    quantity,
                    units,
                    temperature,
                    weight,
                    length,
                    height,
                    tarp,
                    stackable,
                    secure,
                    bolNumber,
                    pickupNumber,
                    sealNumber,
                    code,
                } = item;

                const newItems = {
                    id,
                    description,
                    quantity,
                    units: units?.name,
                    tmp: temperature,
                    weight,
                    length,
                    height,
                    tarp: tarp?.name.replace(/\D/g, ''),
                    stack: stackable?.name,
                    secure: secure?.name,
                    bolNo: bolNumber,
                    pickupNo: pickupNumber,
                    sealNo: sealNumber,
                    code,
                };

                filteredItems.push(newItems);
            });
        }

        return filteredItems;
    }

    private getLoadStopLastStatus(
        isCompletedStop: boolean,
        stopStatusHistory: LoadStatusHistoryResponse[],
        stopType: string
    ): LoadStopLastStatus {
        let lastStatus: string;
        let lastStatusTime: string;

        if (stopStatusHistory?.length) {
            if (isCompletedStop) {
                const latestHistory = stopStatusHistory.find(
                    (history) => history.dateTimeFrom && history.dateTimeTo
                );

                const { statusString, dateTimeFrom, dateTimeTo } =
                    latestHistory;

                const createdLastCompletedStatus =
                    LoadDetailsItemHelper.createStopLastStatus(
                        stopType,
                        statusString,
                        dateTimeFrom,
                        dateTimeTo,
                        new FormatDatePipe(),
                        new FormatTimePipe()
                    );

                lastStatus = createdLastCompletedStatus.lastStatus;
                lastStatusTime = createdLastCompletedStatus.lastStatusTime;
            } else {
                const latestHistory =
                    stopStatusHistory[stopStatusHistory.length - 1];

                const { statusString, dateTimeFrom } = latestHistory;

                const createdLastStatus =
                    LoadDetailsItemHelper.createStopLastStatus(
                        stopType,
                        statusString,
                        dateTimeFrom
                    );

                lastStatus = createdLastStatus.lastStatus;
                lastStatusTime = createdLastStatus.lastStatusTime;
            }
        }

        return {
            lastStatus,
            lastStatusTime,
        };
    }

    private getLoadStopRoutes(stops: LoadStopResponse[]): void {
        const routes: StopRoutes[] = stops.map((stop, index) => {
            const { shipper, stopType } = stop;

            return {
                longitude: shipper.longitude,
                latitude: shipper.latitude,
                pickup: stopType.name === LoadDetailsItemStringEnum.PICKUP,
                delivery: stopType.name === LoadDetailsItemStringEnum.DELIVERY,
                stopNumber: index,
            };
        });

        this.loadStopRoutes[0] = {
            routeColor: LoadDetailsItemStringEnum.COLOR_1,
            stops: routes.map((route, index) => {
                return {
                    lat: route.latitude,
                    long: route.longitude,
                    stopColor: route.pickup
                        ? LoadDetailsItemStringEnum.COLOR_2
                        : route.delivery
                          ? LoadDetailsItemStringEnum.COLOR_3
                          : LoadDetailsItemStringEnum.COLOR_1,
                    stopNumber: route?.stopNumber?.toString(),
                    zIndex: 99 + index,
                };
            }),
        };
    }

    public handleStopDropdownClick(
        index: number,
        stopItemsLength: number
    ): void {
        if (!stopItemsLength) return;

        this.stopItemDropdownIndex =
            this.stopItemDropdownIndex === index ? -1 : index;
    }

    public addScrollEventListeners(): void {
        this.removeScrollEventListeners();

        const columnsScrollElements =
            document.querySelectorAll('.columns-scroll');

        columnsScrollElements?.forEach((element, index) => {
            element.addEventListener('scroll', () => {
                columnsScrollElements.forEach((element2, index2) => {
                    if (index2 !== index) {
                        element2.scrollLeft = element.scrollLeft;
                    }
                });
            });
        });
    }

    public removeScrollEventListeners(): void {
        const columnsScrollElements =
            document.querySelectorAll('.columns-scroll');

        columnsScrollElements?.forEach((element) => {
            element.removeAllListeners('scroll');
        });
    }

    public getMapData(): void {
        const routeMarkers: IMapMarkers[] = [];
        const routePaths: IMapRoutePath[] = [];

        this.loadService
            .getRouting(
                JSON.stringify(
                    this.loadStopData.map((item) => {
                        return {
                            longitude: item.shipper.longitude,
                            latitude: item.shipper.latitude,
                        };
                    })
                )
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RoutingResponse) => {
                    const routeLegs = res.legs;

                    console.log('getRouting res', res);

                    this.loadStopData.forEach((loadStop, index) => {
                        const markerData = {
                            position: {
                                lat: loadStop.shipper.latitude,
                                lng: loadStop.shipper.longitude,
                            },
                        };

                        const routeMarker: IMapMarkers = {
                            ...markerData,
                            content:
                                this.markerIconService.getRoutingMarkerIcon(
                                    markerData,
                                    loadStop.stopLoadOrder ?? 0,
                                    loadStop.stopType.name.toLowerCase(),
                                    false,
                                    true
                                ),
                        };

                        routeMarkers.push(routeMarker);

                        if (index > 0) {
                            const routePath: IMapRoutePath = {
                                path: [],
                                decodedShape:
                                    routeLegs?.[index - 1]?.decodedShape,
                                strokeColor:
                                    MapOptionsConstants.routingPathColors.gray,
                                strokeOpacity: 1,
                                strokeWeight: 4,
                                isDashed:
                                    !this.loadStopData[index - 1].stopType.id,
                            };

                            routePaths.push(routePath);
                        }
                    });

                    this.mapData = {
                        ...this.mapData,
                        isZoomShown: true,
                        routingMarkers: routeMarkers,
                        routePaths: routePaths,
                    };
                },
            });
    }

    ngOnDestroy(): void {
        this.removeScrollEventListeners();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
