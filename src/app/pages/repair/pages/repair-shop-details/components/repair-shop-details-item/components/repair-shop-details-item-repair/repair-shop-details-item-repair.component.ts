import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// constants
import { RepairShopDetailsItemConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/utils/constants';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// pipes
import { FormatDatePipe } from '@shared/pipes';

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// models
import { RepairActionItem } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/models';
import { RepairResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-item-repair',
    templateUrl: './repair-shop-details-item-repair.component.html',
    styleUrls: ['./repair-shop-details-item-repair.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,

        // pipes
        FormatDatePipe,

        // directives
        DescriptionItemsTextCountDirective,
    ],
})
export class RepairShopDetailsItemRepairComponent implements OnInit {
    @Input() set repairList(data: RepairResponse[]) {
        this.createRepairItemData(data);
    }

    public _repairList: RepairResponse[] = [];

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public repairHeaderItems: string[] = [];
    public repairActionItems: RepairActionItem[] = [];

    ngOnInit(): void {
        this.getConstantData();
    }

    public trackByIdentity = (index: number): number => index;

    private getConstantData(): void {
        this.repairHeaderItems =
            RepairShopDetailsItemConstants.REPAIR_HEADER_ITEMS;

        this.repairActionItems =
            RepairShopDetailsItemConstants.REPAIR_ACTION_COLUMNS;
    }

    private createRepairItemData(data: RepairResponse[]): void {
        this._repairList = data.map((repair) => {
            const { items } = repair;

            const filteredItemNames = items.map((item) => item.description);
            const pmItemsIndexArray = [];

            items.forEach(
                (item, index) =>
                    (item?.pmTruck || item?.pmTrailer) &&
                    pmItemsIndexArray.push(index)
            );

            return {
                ...repair,
                filteredItemNames,
                pmItemsIndexArray,
            };
        });

        console.log('this._repairList', this._repairList);
    }

    public handleActionClick(type: string /* index: number */): void {
        switch (type) {
            case RepairShopDetailsStringEnum.DOCUMENT:
                break;
            case RepairShopDetailsStringEnum.NOTE:
                break;
            case RepairShopDetailsStringEnum.MORE:
                break;
            default:
                // show more
                break;
        }
    }
}
