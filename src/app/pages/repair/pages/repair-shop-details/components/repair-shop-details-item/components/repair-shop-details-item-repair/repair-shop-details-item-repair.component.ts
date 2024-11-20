import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopDetailsItemDropdownComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-dropdown/repair-shop-details-item-dropdown.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';

// services
import { ModalService } from '@shared/services/modal.service';

// constants
import { RepairShopDetailsItemConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/utils/constants';

// helpers
import { RepairTableHelper } from '@pages/repair/pages/repair-table/utils/helpers';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// pipes
import { FormatDatePipe, ThousandSeparatorPipe } from '@shared/pipes';

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// models
import { RepairActionItem } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/models';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
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
        RepairShopDetailsItemDropdownComponent,
        TaNoteComponent,

        // pipes
        FormatDatePipe,
        ThousandSeparatorPipe,

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
    public repairDropdownHeaderItems: string[] = [];
    public repairActionItems: RepairActionItem[] = [];

    public repairItemDropdownIndex: number = -1;
    public repairItemOptionsDropdownIndex: number = -1;
    public actionItemIndex: number = -1;

    public repairItemOptions: DropdownItem[];

    constructor(private modalService: ModalService) {}

    ngOnInit(): void {
        this.getConstantData();
    }

    public trackByIdentity = (index: number): number => index;

    private getConstantData(): void {
        this.repairHeaderItems =
            RepairShopDetailsItemConstants.REPAIR_HEADER_ITEMS;

        this.repairDropdownHeaderItems =
            RepairShopDetailsItemConstants.REPAIR_DROPDOWN_HEADER_ITEMS;

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

    private getRepairItemOptions(repair: RepairResponse): void {
        const unitType =
            repair?.unitType?.id === 1
                ? TableStringEnum.ACTIVE
                : TableStringEnum.INACTIVE;

        const repairType = repair?.repairType?.name;

        this.repairItemOptions =
            RepairTableHelper.getRepairTableDropdownContent(
                unitType,
                repairType
            );
    }

    public handleActionClick(
        type: string,
        index?: number,
        actionItemIndex?: number
    ): void {
        const repair = this._repairList[index];

        switch (type) {
            case RepairShopDetailsStringEnum.FINISH_ORDER:
                this.handleFinishOrderClick(repair);

                break;
            case RepairShopDetailsStringEnum.DOCUMENT:
                break;
            case RepairShopDetailsStringEnum.NOTE:
                break;
            case RepairShopDetailsStringEnum.MORE:
                this.handleRepairOptionsDropdownClick(index, actionItemIndex);

                this.getRepairItemOptions(repair);

                break;
            default:
                // show more
                break;
        }
    }

    public handleRepairDropdownClick(index: number): void {
        this.repairItemDropdownIndex =
            this.repairItemDropdownIndex === index ? -1 : index;

        this.repairItemOptionsDropdownIndex = -1;
    }

    public handleRepairOptionsDropdownClick(
        index: number,
        actionItemIndex: number
    ): void {
        this.repairItemOptionsDropdownIndex =
            this.repairItemOptionsDropdownIndex === index ? -1 : index;

        this.actionItemIndex = actionItemIndex;
    }

    private handleFinishOrderClick(repair: RepairResponse): void {
        const editData = {
            data: {
                ...repair,
            },
            type:
                repair?.unitType?.id === 1
                    ? TableStringEnum.EDIT_TRUCK
                    : TableStringEnum.EDIT_TRAILER,
            finishOrderBtn: repair?.repairType?.id === 2,
            isFinishOrder: true,
        };

        this.modalService.openModal(
            RepairOrderModalComponent,
            { size: TableStringEnum.LARGE },
            {
                ...editData,
            }
        );
    }

    private handleEditRepairClick(repair: RepairResponse): void {
        const editData = {
            data: {
                ...repair,
            },
            type:
                repair?.unitType?.id === 1
                    ? TableStringEnum.EDIT_TRUCK
                    : TableStringEnum.EDIT_TRAILER,
        };

        this.modalService.openModal(
            RepairOrderModalComponent,
            { size: TableStringEnum.LARGE },
            {
                ...editData,
            }
        );
    }

    private handleDeleteRepairClick(repair: RepairResponse): void {
        const editedRepair = {
            ...repair,
            tableUnit:
                repair?.truck?.truckNumber || repair?.trailer?.trailerNumber,
            tableCost: `${
                TableStringEnum.DOLLAR_SIGN
            }${MethodsCalculationsHelper.convertNumberInThousandSep(
                repair?.total
            )}`,
            tableShopName: repair?.repairShop?.name,
        };

        const subType =
            repair?.unitType?.id === 1
                ? TableStringEnum.TRUCK
                : TableStringEnum.TRAILER_2;

        const editData = {
            data: { ...editedRepair },
            template: TableStringEnum.REPAIR_2,
            type: TableStringEnum.DELETE,
            subType,
        };

        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.DELETE },
            {
                ...editData,
            }
        );
    }

    public handleDropdownOptionClick(option: string, index: number): void {
        const repair = this._repairList[index];

        this.repairItemOptionsDropdownIndex = -1;

        switch (option) {
            case RepairShopDetailsStringEnum.EDIT:
                this.handleEditRepairClick(repair);

                break;
            case RepairShopDetailsStringEnum.FINISH_ORDER_2:
                this.handleFinishOrderClick(repair);

                break;
            case RepairShopDetailsStringEnum.DELETE_2:
                this.handleDeleteRepairClick(repair);

                break;
            default:
                break;
        }
    }
}
