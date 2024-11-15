import { Component, OnInit } from '@angular/core';
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
import { TableDescriptionTextPipe } from '@shared/components/ta-table/ta-table-body/pipes/table-description-text.pipe';

// models
import { RepairActionItem } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/models';

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
        TableDescriptionTextPipe,
    ],
})
export class RepairShopDetailsItemRepairComponent implements OnInit {
    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public repairHeaderItems: string[] = [];
    public repairActionItems: RepairActionItem[] = [];

    public dummyDescriptionItems = [
        {
            price: 1,
            description: 'Text aaa',
        },
        {
            price: 2,
            description: 'Text bbb',
        },
        {
            price: 3,
            description: 'Text ccc',
        },
        {
            price: 4,
            description: 'Text ddd',
        },
        {
            price: 5,
            description: 'Text eee',
        },
    ];

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
