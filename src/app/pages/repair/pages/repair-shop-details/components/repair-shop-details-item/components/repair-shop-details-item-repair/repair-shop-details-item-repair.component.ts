import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaDocumentsDrawerComponent } from '@shared/components/ta-documents-drawer/ta-documents-drawer.component';
import { TaDropdownOptionsComponent } from '@shared/components/ta-dropdown-options/ta-dropdown-options.component';
import { CaSearchMultipleStatesComponent } from 'ca-components';

// services
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { RepairShopDetailsService } from '@pages/repair/pages/repair-shop-details/services';

// constants
import { RepairShopDetailsItemConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/utils/constants';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// pipes
import { FormatDatePipe, ThousandSeparatorPipe } from '@shared/pipes';

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// models
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

        // components
        TaDropdownOptionsComponent,
        TaNoteComponent,
        TaDocumentsDrawerComponent,
        CaSearchMultipleStatesComponent,

        // pipes
        FormatDatePipe,
        ThousandSeparatorPipe,

        // directives
        DescriptionItemsTextCountDirective,
    ],
})
export class RepairShopDetailsItemRepairComponent implements OnInit {
    @Input() set repairList(data: RepairResponse[]) {
        this.createRepairData(data);
    }
    @Input() searchConfig: boolean[];

    private destroy$ = new Subject<void>();

    public _repairList: RepairResponse[] = [];

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;
    public repairShopDetailsStringEnum = RepairShopDetailsStringEnum;

    public repairHeaderItems: string[] = [];
    public repairDropdownHeaderItems: string[] = [];

    public repairItemDropdownIndex: number = -1;
    public repairItemOptionsDropdownIndex: number = -1;
    public repairItemDocumentsDrawerIndex: number = -1;

    public repairItemOptions: DropdownItem[] = [];

    constructor(
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private repairShopDetailsService: RepairShopDetailsService
    ) {}

    ngOnInit(): void {
        this.getConstantData();

        this.confirmationSubscribe();
    }

    public trackByIdentity = (index: number): number => index;

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    if (
                        res?.type === RepairShopDetailsStringEnum.DELETE &&
                        res?.template === TableStringEnum.REPAIR_2
                    )
                        this.resetIndexes();
                },
            });
    }

    private resetIndexes(): void {
        this.repairItemDropdownIndex = -1;
        this.repairItemOptionsDropdownIndex = -1;
        this.repairItemDocumentsDrawerIndex = -1;
    }

    private getConstantData(): void {
        this.repairHeaderItems =
            RepairShopDetailsItemConstants.REPAIR_HEADER_ITEMS;

        this.repairDropdownHeaderItems =
            RepairShopDetailsItemConstants.REPAIR_DROPDOWN_HEADER_ITEMS;
    }

    private createRepairData(data: RepairResponse[]): void {
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
    }

    private getRepairItemOptions(repair: RepairResponse): void {
        const unitType =
            repair?.unitType?.id === 1
                ? TableStringEnum.ACTIVE
                : TableStringEnum.INACTIVE;

        const repairType = repair?.repairType?.name;

        this.repairItemOptions =
            DropdownMenuContentHelper.getRepairDropdownContent(
                unitType,
                repairType
            );
    }

    public handleActionClick(type: string, index?: number): void {
        const repair = this._repairList[index];

        switch (type) {
            case RepairShopDetailsStringEnum.FINISH_ORDER:
                this.handleFinishOrderClick(repair);

                break;
            case RepairShopDetailsStringEnum.DOCUMENT:
                this.handleDocumentDrawerClick(index);

                break;
            default:
                break;
        }
    }

    public handleRepairDropdownClick(index: number): void {
        this.repairItemDropdownIndex =
            this.repairItemDropdownIndex === index ? -1 : index;

        this.repairItemOptionsDropdownIndex = -1;
    }

    public handleOptionsDropdownClick(
        index: number,
        repair: RepairResponse
    ): void {
        this.repairItemOptionsDropdownIndex =
            this.repairItemOptionsDropdownIndex === index ? -1 : index;

        if (index !== this.repairItemDocumentsDrawerIndex)
            this.repairItemDocumentsDrawerIndex = -1;

        this.getRepairItemOptions(repair);
    }

    public handleDocumentDrawerClick(index: number): void {
        this.repairItemDocumentsDrawerIndex =
            this.repairItemDocumentsDrawerIndex === index ? -1 : index;

        this.repairItemDropdownIndex = -1;
        this.repairItemOptionsDropdownIndex = -1;
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

    public handleDropdownOptionClick(
        option: { type: string },
        index: number
    ): void {
        const repair = this._repairList[index];

        this.repairItemOptionsDropdownIndex = -1;

        switch (option.type) {
            case RepairShopDetailsStringEnum.OPEN_2:
                this.handleOptionsDropdownClick(index, repair);

                break;
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

    public handleCloseSearchEmit(): void {
        const detailsPartIndex = 0;

        this.repairShopDetailsService.setCloseSearchStatus(detailsPartIndex);
    }
}
