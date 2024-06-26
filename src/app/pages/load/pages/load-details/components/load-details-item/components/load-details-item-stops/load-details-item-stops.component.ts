import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// helpers
import { LoadDetailsItemHelper } from '@pages/load/pages/load-details/components/load-details-item/utils/helpers/load-details-item.helper';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// models
import { LoadResponse } from 'appcoretruckassist';
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';

@Component({
    selector: 'app-load-details-item-stops',
    templateUrl: './load-details-item-stops.component.html',
    styleUrls: ['./load-details-item-stops.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // pipes
        FormatDatePipe,
    ],
})
export class LoadDetailsItemStopsComponent implements OnChanges {
    @Input() load: LoadResponse;

    public stopHeaderItems: string[] = [];
    public stopItemsHeaderItems: StopItemsHeaderItem[] = [];

    public stopItemDropdownIndex: number = -1;

    public loadDetailsItemHelper = LoadDetailsItemHelper;

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
        if (changes?.load.currentValue) {
            this.getConstantData();

            console.log('load', this.load);
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

    public handleStopDropdownClick(
        index: number,
        stopItemsLength: number
    ): void {
        /*   if (!stopItemsLength) return; */

        this.stopItemDropdownIndex =
            this.stopItemDropdownIndex === index ? -1 : index;
    }
}
