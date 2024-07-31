import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// svg routes
import { LoadDetailsItemSvgRoutes } from '@pages/load/pages/load-details/components/load-details-item/utils/svg-routes/load-details-item-svg.routes';

// components
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';

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
} from 'appcoretruckassist';
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';
import { MapRoute } from '@shared/models/map-route.model';
import { LoadStop } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop.model';
import { LoadStopItem } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-item.model';
import { StopRoutes } from '@shared/models/stop-routes.model';
import { LoadStopLastStatus } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-last-status.model';

@Component({
    selector: 'app-load-deatils-item-stops-main',
    templateUrl: './load-deatils-item-stops-main.component.html',
    styleUrls: ['./load-deatils-item-stops-main.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaMapsComponent,

        // pipes
        FormatDatePipe,
        FormatTimePipe,
        KeyValuePairsPipe,
    ],
})
export class LoadDeatilsItemStopsMainComponent implements OnChanges {
    @Input() stopsData: LoadResponse;
    @Input() isMapDisplayed: boolean;
    @Input() isSmallDesign: boolean;

    public loadDetailsItemSvgRoutes = LoadDetailsItemSvgRoutes;

    public stopHeaderItems: string[] = [];

    public loadStopData: LoadStop[] = [];
    public loadStopRoutes: MapRoute[] = [];

    // items
    public stopItemsHeaderItems: StopItemsHeaderItem[] = [];
    public stopItemDropdownIndex: number = -1;

    public itemHoveringIndex: number = -1;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stopsData?.currentValue) {
            this.getConstantData();

            this.getStopsData(changes?.stopsData?.currentValue?.stops);

            this.getLoadStopRoutes(changes?.stopsData?.currentValue?.stops);
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
}
