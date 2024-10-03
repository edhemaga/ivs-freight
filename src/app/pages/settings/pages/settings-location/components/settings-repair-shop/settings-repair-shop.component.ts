import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {  takeUntil } from 'rxjs';

import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { RepairService } from '@shared/services/repair.service';
import { CompanyRepairShopService } from '@pages/settings/services/company-repairshop.service';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// core
import { SettingsLocationBaseComponent } from '../settings-location-base/settings-location-base.component';
import { DropDownService } from '@shared/services/drop-down.service';
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';
import { RepairShopResponse } from 'appcoretruckassist';


@Component({
    selector: 'app-settings-repair-shop',
    templateUrl: './settings-repair-shop.component.html',
    styleUrls: ['./settings-repair-shop.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsRepairShopComponent 
extends SettingsLocationBaseComponent
implements OnInit {
    public repairShopData: any;
    public count: number = 0;
    public repairsActions: any;
    public repairShopDataId: any;
    constructor(
        private repairShopSrv: CompanyRepairShopService,
        private repairService: RepairService,
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        protected activatedRoute: ActivatedRoute,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        public FormatCurrencyPipe: FormatCurrencyPipe,
    ) {
        super(
            tableService,
            confirmationService,
            cdRef,
            activatedRoute,
            settingsLocationService,
            dropDownService,
            FormatCurrencyPipe
        );
    }

  
    ngOnInit(): void {
        // Required for subscriptions to work
        super.ngOnInit();

        this.getInitalList();
    } 

    public getList(): void {
        this.repairShopSrv
            .getRepairShopList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairShopData = item.pagination;
            });
    }

    public getInitalList(): void  {
        this.getList();
    }

    public getActiveServices(data: RepairShopResponse) {
        return data.serviceTypes.filter((item) => item.active);
    }

    public handleConfirmation(res: Confirmation): void {
        if (
            res.type === DropActionsStringEnum.DELETE &&
            res.template === DropActionsStringEnum.COMPANY_REPAIR_SHOP
        ) {
            this.repairService
                .deleteRepairShopById(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }
}
