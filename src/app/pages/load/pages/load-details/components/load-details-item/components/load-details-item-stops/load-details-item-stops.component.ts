import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// helpers
import { LoadDetailsItemHelper } from '@pages/load/pages/load-details/components/load-details-item/utils/helpers/load-details-item.helper';

// components
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { LoadDetailsItemStopsProgressBarComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-details-item-stops-progress-bar/load-details-item-stops-progress-bar.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { KeyValuePairsPipe } from '@shared/pipes/key-value-pairs.pipe';

// models
import { LoadResponse, LoadStopResponse } from 'appcoretruckassist';
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';
import { MapRoute } from '@shared/models/map-route.model';
import { StopRoutes } from '@shared/models/stop-routes.model';
import { LoadStopItem } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-item.model';
import { LoadStop } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop.model';

@Component({
    selector: 'app-load-details-item-stops',
    templateUrl: './load-details-item-stops.component.html',
    styleUrls: ['./load-details-item-stops.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaMapsComponent,
        LoadDetailsItemStopsProgressBarComponent,

        // pipes
        FormatDatePipe,
        KeyValuePairsPipe,
    ],
})
export class LoadDetailsItemStopsComponent implements OnChanges {
    @Input() load: LoadResponse;
    @Input() isMapDisplayed: boolean;

    public stopHeaderItems: string[] = [];

    public loadStopData: LoadStop[] = [];
    public loadStopRoutes: MapRoute[] = [];

    public loadDetailsItemHelper = LoadDetailsItemHelper;

    // items
    public stopItemsHeaderItems: StopItemsHeaderItem[] = [];
    public stopItemDropdownIndex: number = -1;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.load?.currentValue) {
            this.getConstantData();

            this.getStopsData(changes?.load?.currentValue);

            this.getLoadStopRoutes(changes?.load?.currentValue);
        }
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    private getConstantData(): void {
        this.stopHeaderItems = LoadDetailsItemHelper.getStopHeaderItems(
            this.load?.statusType?.name
        );

        this.stopItemsHeaderItems =
            LoadDetailsItemHelper.getStopItemsHeaderItems();
    }

    private getStopsData(load: LoadResponse): void {
        console.log('load', load);

        this.loadStopData = load.stops.map((stop) => {
            return {
                ...stop,
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

    private getLoadStopRoutes(load: LoadResponse): void {
        const routes: StopRoutes[] = [];

        load.stops.map((stop: any, index: number) => {
            routes[index] = {
                longitude: stop.shipper.longitude,
                latitude: stop.shipper.latitude,
                pickup: stop.stopType.name == 'Pickup' ? true : false,
                delivery: stop.stopType.name == 'Delivery' ? true : false,
                stopNumber: index,
            };
        });

        this.loadStopRoutes[0] = {
            routeColor: '#919191',
            stops: routes.map((route, index) => {
                return {
                    lat: route.latitude,
                    long: route.longitude,
                    stopColor: route.pickup
                        ? '#26A690'
                        : route.delivery
                        ? '#EF5350'
                        : '#919191',
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
