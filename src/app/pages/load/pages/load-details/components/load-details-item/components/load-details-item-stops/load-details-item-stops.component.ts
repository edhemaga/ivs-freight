import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// routes
import { LoadDetailsItemSvgRoutes } from '@pages/load/pages/load-details/components/load-details-item/utils/svg-routes/load-details-item-svg.routes';

// helpers
import { LoadDetailsItemHelper } from '@pages/load/pages/load-details/components/load-details-item/utils/helpers/load-details-item.helper';

// components
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// models
import { LoadResponse } from 'appcoretruckassist';
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';
import { MapRoute } from '@shared/models/map-route.model';
import { StopRoutes } from '@shared/models/stop-routes.model';

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

        // pipes
        FormatDatePipe,
    ],
})
export class LoadDetailsItemStopsComponent implements OnChanges {
    @Input() load: LoadResponse;
    @Input() isMapDisplayed: boolean;

    public stopHeaderItems: string[] = [];
    public stopItemsHeaderItems: StopItemsHeaderItem[] = [];

    public stopItemDropdownIndex: number = -1;

    public loadDetailsItemHelper = LoadDetailsItemHelper;

    public loadDetailsItemSvgRoutes = LoadDetailsItemSvgRoutes;

    public loadStopRoutes: MapRoute[] = [];

    public dummyItems = [
        {
            id: 1,
            description: 'List Item',
            quantity: 230,
            tmp: 23.5,
            weight: 12.36,
            length: 20,
            height: 21,
            tarp: 4,
            stack: 'Yes',
            secure: 'Strap',
            bolNo: 132542435,
            pickupNo: 34534543,
            sealNo: 234253,
            code: 123456,
        },
        {
            id: 2,
            description: 'List Item 1',
            quantity: 230,
            tmp: 23.5,
            weight: 12.36,
            length: 20,
            height: 21,
            tarp: 4,
            stack: 'Yes',
            secure: 'Strap',
            bolNo: 132542435,
            pickupNo: 34534543,
            sealNo: 234253,
            code: 123456,
        },
        {
            id: 3,
            description: 'List Item 2',
            quantity: 230,
            tmp: 23.5,
            weight: 12.36,
            length: 20,
            height: 21,
            tarp: 4,
            stack: 'Yes',
            secure: 'Strap',
            bolNo: 132542435,
            pickupNo: 34534543,
            sealNo: 234253,
            code: 123456,
        },
        {
            id: 4,
            description: 'List Item 3',
            quantity: 230,
            tmp: 23.5,
            weight: 12.36,
            length: 20,
            height: 21,
            tarp: 4,
            stack: 'Yes',
            secure: 'Strap',
            bolNo: 132542435,
            pickupNo: 34534543,
            sealNo: 234253,
            code: 123456,
        },
    ];

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.load?.currentValue) {
            this.getConstantData();

            this.getLoadStopRoutes();
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

    private getLoadStopRoutes(): void {
        const routes: StopRoutes[] = [];

        this.load.stops.map((stop: any, index: number) => {
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
        /*   if (!stopItemsLength) return; */

        this.stopItemDropdownIndex =
            this.stopItemDropdownIndex === index ? -1 : index;
    }
}
