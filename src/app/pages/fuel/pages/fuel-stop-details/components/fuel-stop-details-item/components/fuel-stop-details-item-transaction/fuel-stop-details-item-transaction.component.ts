import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

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

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// enums
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';
import { eGeneralActions } from '@shared/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import { FuelTransactionResponse } from 'appcoretruckassist';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';
import { eRepairShopDetails } from '@pages/repair/pages/repair-shop-details/enums';

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

        // directives
        DescriptionItemsTextCountDirective,
    ],
})
export class FuelStopDetailsItemTransactionComponent implements OnInit {
    @Input() set transactionList(data: FuelTransactionResponse[]) {
        this.createTransactionData(data);
    }
    @Input() searchConfig: boolean[];

    public _transactionList: FuelTransactionResponse[] = [];

    // svg routes
    public fuelStopDetailsSvgRoutes = FuelStopDetailsSvgRoutes;

    // enums
    public eFuelTransactionType = eFuelTransactionType;

    public transactionHeaderItems: string[] = [];

    public transactionItemDropdownIndex: number = -1;
    public transactionItemOptionsDropdownIndex: number = -1;
    public transactionItemDocumentsDrawerIndex: number = -1;

    public transactionItemOptions: DropdownMenuItem[] = [];

    constructor() {}

    ngOnInit(): void {
        this.getConstantData();
    }

    private getConstantData(): void {
        this.transactionHeaderItems =
            FuelStopDetailsItemConstants.TRANSACTION_HEADER_ITEMS;
    }

    private getTransactionItemOptions(
        transaction: FuelTransactionResponse
    ): void {
        const isIntegratedFuelTransaction =
            transaction?.id !== eFuelTransactionType.Manual;

        this.transactionItemOptions =
            DropdownMenuContentHelper.getFuelTransactionDropdownContent(
                isIntegratedFuelTransaction
            );
    }

    private createTransactionData(data: FuelTransactionResponse[]): void {
        console.log('transactionList', data);

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

    public handleDocumentDrawerClick(index: number): void {
        this.transactionItemDocumentsDrawerIndex =
            this.transactionItemDocumentsDrawerIndex === index ? -1 : index;

        this.transactionItemDropdownIndex = -1;
        this.transactionItemOptionsDropdownIndex = -1;
    }

    public handleDropdownOptionClick(
        option: { type: string },
        index: number
    ): void {
        console.log('option', option);

        const transaction = this._transactionList[index];

        this.transactionItemDropdownIndex = -1;

        // eRepairShopDetails

        switch (option.type) {
            case eGeneralActions.OPEN_CAPITALIZED:
                this.handleOptionsDropdownClick(index, transaction);

                break;
            /*   case eRepairShopDetails.EDIT:
                    this.handleEditRepairClick(repair);
    
                    break;
                case eRepairShopDetails.DELETE_2:
                    this.handleDeleteRepairClick(repair);
    
                    break; */
            default:
                break;
        }
    }
}
