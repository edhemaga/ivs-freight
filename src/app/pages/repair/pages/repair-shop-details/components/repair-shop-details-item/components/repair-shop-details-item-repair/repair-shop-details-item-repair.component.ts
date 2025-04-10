import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// base classes
import { RepairDropdownMenuActionsBase } from '@pages/repair/base-classes';

// components
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaDocumentsDrawerComponent } from '@shared/components/ta-documents-drawer/ta-documents-drawer.component';
import {
    CaDropdownMenuComponent,
    CaSearchMultipleStatesComponent,
} from 'ca-components';

// services
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsSearchService } from '@shared/services';
import { RepairService } from '@shared/services/repair.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// constants
import { RepairShopDetailsItemConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/utils/constants';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// enums
import {
    eRepairShopDetails,
    eRepairShopDetailsSearchIndex,
} from '@pages/repair/pages/repair-shop-details/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eDropdownMenu, eGeneralActions } from '@shared/enums';

// pipes
import { FormatDatePipe, ThousandSeparatorPipe } from '@shared/pipes';

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// models
import { RepairResponse } from 'appcoretruckassist';
import {
    IDropdownMenuItem,
    IDropdownMenuOptionEmit,
} from '@ca-shared/components/ca-dropdown-menu/interfaces';

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
        TaNoteComponent,
        TaDocumentsDrawerComponent,
        CaSearchMultipleStatesComponent,
        CaDropdownMenuComponent,

        // pipes
        FormatDatePipe,
        ThousandSeparatorPipe,

        // directives
        DescriptionItemsTextCountDirective,
    ],
})
export class RepairShopDetailsItemRepairComponent
    extends RepairDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set repairList(data: RepairResponse[]) {
        this.createRepairData(data);
    }
    @Input() searchConfig: boolean[];

    public destroy$ = new Subject<void>();

    public _repairList: RepairResponse[] = [];

    // svg routes
    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    // enums
    public eRepairShopDetails = eRepairShopDetails;
    public eRepairShopDetailsSearchIndex = eRepairShopDetailsSearchIndex;

    // headers
    public repairHeaderItems: string[] = [];
    public repairDropdownHeaderItems: string[] = [];

    // helper indexes
    public repairItemDropdownIndex: number = -1;
    public repairItemOptionsDropdownIndex: number = -1;
    public repairItemDocumentsDrawerIndex: number = -1;

    public repairItemOptions: IDropdownMenuItem[] = [];

    get viewData() {
        return this._repairList;
    }

    constructor(
        // services
        protected modalService: ModalService,
        protected repairService: RepairService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        private confirmationService: ConfirmationService,
        private detailsSearchService: DetailsSearchService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getConstantData();

        this.confirmationSubscribe();
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    if (
                        res?.type === eGeneralActions.DELETE_LOWERCASE &&
                        res?.template === eRepairShopDetails.REPAIR_LOWERCASE
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

    private handleOptionsDropdownClick(
        index: number,
        repair: RepairResponse
    ): void {
        this.repairItemOptionsDropdownIndex =
            this.repairItemOptionsDropdownIndex === index ? -1 : index;

        if (index !== this.repairItemDocumentsDrawerIndex)
            this.repairItemDocumentsDrawerIndex = -1;

        this.getRepairItemOptions(repair);
    }

    private handleDocumentDrawerClick(index: number): void {
        this.repairItemDocumentsDrawerIndex =
            this.repairItemDocumentsDrawerIndex === index ? -1 : index;

        this.repairItemDropdownIndex = -1;
        this.repairItemOptionsDropdownIndex = -1;
    }

    private handleToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        repair: RepairResponse
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                repair
            );

        this.handleDropdownMenuActions(emitAction, eDropdownMenu.REPAIR);
    }

    public handleActionClick(type: string, index?: number): void {
        const repair = this._repairList[index];

        type === eRepairShopDetails.FINISH_ORDER
            ? this.handleToggleDropdownMenuActions({ type }, repair)
            : this.handleDocumentDrawerClick(index);
    }

    public handleRepairDropdownClick(index: number): void {
        this.repairItemDropdownIndex =
            this.repairItemDropdownIndex === index ? -1 : index;

        this.repairItemOptionsDropdownIndex = -1;
    }

    public handleDropdownOptionClick(
        option: { type: string },
        index: number
    ): void {
        const repair = this._repairList[index];

        this.repairItemOptionsDropdownIndex = -1;

        option.type === eGeneralActions.OPEN_CAPITALIZED
            ? this.handleOptionsDropdownClick(index, repair)
            : this.handleToggleDropdownMenuActions(option, repair);
    }

    public handleShowMoreAction(): void {}

    public handleCloseSearchEmit(): void {
        this.detailsSearchService.setCloseSearchStatus(
            eRepairShopDetailsSearchIndex.REPAIR_INDEX
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
