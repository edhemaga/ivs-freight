import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs';

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
import { RepairShopListDto, RepairShopResponse } from 'appcoretruckassist';

import {
    CompanyOfficeResponseWithGroupedContacts,
    SettingsDepartmentCardModel,
} from '@pages/settings/pages/settings-location/models';

@Component({
    selector: 'app-settings-repair-shop',
    templateUrl: './settings-repair-shop.component.html',
    styleUrls: ['./settings-repair-shop.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsRepairShopComponent
    extends SettingsLocationBaseComponent
    implements OnInit
{
    public repairShopData: any;
    public count: number = 0;
    public repairsActions: any;
    public repairShopDataId: any;
    public isServiceCardOpened: boolean[] = [];
    public isWorkingCardOpened: boolean[] = [];
    public isBankingInfoOpened: boolean[] = [];
    constructor(
        private repairShopSrv: CompanyRepairShopService,
        private repairService: RepairService,
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        protected activatedRoute: ActivatedRoute,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        public FormatCurrencyPipe: FormatCurrencyPipe
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
                this.repairShopData.data = this.processOfficeData(
                    this.repairShopData.data
                );
                this.repairShopData.data.forEach(() => {
                    this.isServiceCardOpened.push(true);
                    this.isWorkingCardOpened.push(true);
                    this.isBankingInfoOpened.push(true);
                }
                );
            });
    }

    public getInitalList(): void {
        this.getList();
    }

    private processOfficeData(data: RepairShopListDto[]): RepairShopListDto[] {
        return data.map((office) => {
            const groupedContacts = office.contacts.reduce((acc, contact) => {
                const departmentName = contact.departmentName;

                if (departmentName) {
                    if (!acc[departmentName]) {
                        acc[departmentName] = {
                            isCardOpen: true,
                            cardName: departmentName,
                            values: [],
                        };
                    }
                    acc[departmentName].values.push(contact);
                }

                return acc;
            }, {} as Record<string, SettingsDepartmentCardModel>);

            return {
                ...office,
                groupedContacts,
            };
        });
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

    public onCardToggle(i: number): void {
        const office = this.repairShopData.data[
            i
        ] as CompanyOfficeResponseWithGroupedContacts;

        if (office.groupedContacts) {
            Object.keys(office.groupedContacts).forEach((key) => {
                office.groupedContacts[key].isCardOpen = false;
            });
        }
        
        this.isServiceCardOpened[i] = false;
        this.isWorkingCardOpened[i] = false;
        this.isBankingInfoOpened[i] = false;
    }
}
