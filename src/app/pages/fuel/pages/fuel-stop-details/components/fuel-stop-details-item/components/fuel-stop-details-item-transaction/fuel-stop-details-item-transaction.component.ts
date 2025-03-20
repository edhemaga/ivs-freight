import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// base classes
import { FuelDropdownMenuActionsBase } from '@pages/fuel/base-classes';

// components
import { TaDocumentsDrawerComponent } from '@shared/components/ta-documents-drawer/ta-documents-drawer.component';
import { CaDropdownMenuComponent } from 'ca-components';

// svg routes
import { FuelStopDetailsSvgRoutes } from '@pages/fuel/pages/fuel-stop-details/utils/svg-routes';

// constants
import { FuelStopDetailsItemConstants } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/utils/constants';

// pipes
import {
    FormatDatePipe,
    FormatTimePipe,
    ThousandSeparatorPipe,
} from '@shared/pipes';
import { FuelItemQuantityTypePipe } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/pipes';
import { LastFuelPriceRangeClassColorPipe } from '@pages/fuel/pages/fuel-stop-details/pipes';

// services
import { ModalService } from '@shared/services/modal.service';
import { FuelService } from '@shared/services/fuel.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// enums
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';
import { DropdownMenuStringEnum, eGeneralActions } from '@shared/enums';
import { eFuelStopDetails } from '@pages/fuel/pages/fuel-stop-details/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { FuelTransactionResponse } from 'appcoretruckassist';
import {
    IDropdownMenuItem,
    IDropdownMenuOptionEmit,
} from '@ca-shared/components/ca-dropdown-menu/interfaces';

@Component({
    selector: 'app-fuel-stop-details-item-transaction',
    templateUrl: './fuel-stop-details-item-transaction.component.html',
    styleUrl: './fuel-stop-details-item-transaction.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaDocumentsDrawerComponent,
        CaDropdownMenuComponent,

        // pipes
        FormatDatePipe,
        FormatTimePipe,
        ThousandSeparatorPipe,
        FuelItemQuantityTypePipe,
        LastFuelPriceRangeClassColorPipe,

        // directives
        DescriptionItemsTextCountDirective,
    ],
})
export class FuelStopDetailsItemTransactionComponent
    extends FuelDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set transactionList(data: FuelTransactionResponse[]) {
        this.createTransactionData(data);
    }
    @Input() searchConfig: boolean[];

    public destroy$ = new Subject<void>();

    public _transactionList: FuelTransactionResponse[] = [];

    // svg routes
    public fuelStopDetailsSvgRoutes = FuelStopDetailsSvgRoutes;

    // enums
    public eFuelTransactionType = eFuelTransactionType;

    // headers
    public transactionHeaderItems: string[] = [];
    public transactionDropdownHeaderItems: string[] = [];

    // helper indexes
    public transactionItemDropdownIndex: number = -1;
    public transactionItemOptionsDropdownIndex: number = -1;
    public transactionItemDocumentsDrawerIndex: number = -1;

    public transactionItemOptions: IDropdownMenuItem[] = [];

    get viewData() {
        return this._transactionList;
    }

    constructor(
        // services
        protected modalService: ModalService,
        protected fuelService: FuelService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        private confirmationService: ConfirmationService
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
                        res?.type === eGeneralActions.DELETE &&
                        res?.template === eFuelStopDetails.FUEL_TRANSACTION
                    )
                        this.resetIndexes();
                },
            });
    }

    private resetIndexes(): void {
        this.transactionItemDropdownIndex = -1;
        this.transactionItemOptionsDropdownIndex = -1;
        this.transactionItemDocumentsDrawerIndex = -1;
    }

    private getConstantData(): void {
        this.transactionHeaderItems =
            FuelStopDetailsItemConstants.TRANSACTION_HEADER_ITEMS;

        this.transactionDropdownHeaderItems =
            FuelStopDetailsItemConstants.TRANSACTION_DROPDOWN_HEADER_ITEMS;
    }

    private getTransactionItemOptions(
        transaction: FuelTransactionResponse
    ): void {
        const isIntegratedFuelTransaction =
            transaction?.fuelTransactionType.id !== eFuelTransactionType.Manual;

        this.transactionItemOptions =
            DropdownMenuContentHelper.getFuelTransactionDropdownContent(
                isIntegratedFuelTransaction
            );
    }

    private createTransactionData(data: FuelTransactionResponse[]): void {
        this._transactionList = data.map((transaction) => {
            const { fuelItems } = transaction;

            const filteredItemNames = fuelItems?.map(
                (item) => item.itemFuel.name
            );

            return {
                ...transaction,
                filteredItemNames,
            };
        });
    }

    private handleOptionsDropdownClick(
        index: number,
        transaction: FuelTransactionResponse
    ): void {
        this.transactionItemOptionsDropdownIndex =
            this.transactionItemOptionsDropdownIndex === index ? -1 : index;

        if (index !== this.transactionItemDocumentsDrawerIndex)
            this.transactionItemDocumentsDrawerIndex = -1;

        this.getTransactionItemOptions(transaction);
    }

    private handleToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        transaction: FuelTransactionResponse
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                transaction
            );

        this.handleDropdownMenuActions(
            emitAction,
            DropdownMenuStringEnum.FUEL_TRANSACTION
        );
    }

    public handleDocumentDrawerClick(index: number): void {
        this.transactionItemDocumentsDrawerIndex =
            this.transactionItemDocumentsDrawerIndex === index ? -1 : index;

        this.transactionItemDropdownIndex = -1;
        this.transactionItemOptionsDropdownIndex = -1;
    }

    public handleTransactionDropdownClick(index: number): void {
        this.transactionItemDropdownIndex =
            this.transactionItemDropdownIndex === index ? -1 : index;

        this.transactionItemOptionsDropdownIndex = -1;
    }

    public handleDropdownOptionClick(
        option: { type: string },
        index: number
    ): void {
        const transaction = this._transactionList[index];

        this.transactionItemDropdownIndex = -1;

        option.type === eGeneralActions.OPEN_CAPITALIZED
            ? this.handleOptionsDropdownClick(index, transaction)
            : this.handleToggleDropdownMenuActions(option, transaction);
    }

    public handleShowMoreAction(): void {}

    public updateToolbarDropdownMenuContent(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
