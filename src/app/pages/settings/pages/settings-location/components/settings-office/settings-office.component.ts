import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';

// Models
import {
    CompanyOfficeResponse,
    CompanyOfficeResponsePagination,
} from 'appcoretruckassist';
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';

// Services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { CompanyOfficeService } from '@shared/services/company-office.service';

// Components
import { SettingsLocationBaseComponent } from '@pages/settings/pages/settings-location/components/settings-location-base/settings-location-base.component';

// Enums
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

import { CompanyOfficeResponseWithGroupedContacts, SettingsDepartmentCardModel } from '@pages/settings/pages/settings-location/models';

@Component({
    selector: 'app-settings-office',
    templateUrl: './settings-office.component.html',
    styleUrls: ['./settings-office.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsOfficeComponent
    extends SettingsLocationBaseComponent
    implements OnInit
{
    public officeData: CompanyOfficeResponsePagination;
    public isParkingCardOpened: boolean[] = [];

    constructor(
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        protected activatedRoute: ActivatedRoute,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        public FormatCurrencyPipe: FormatCurrencyPipe,
        private companyOfficeService: CompanyOfficeService,
        public router: Router,
    ) {
        super(
            tableService,
            confirmationService,
            cdRef,
            activatedRoute,
            settingsLocationService,
            dropDownService,
            FormatCurrencyPipe,
            router
        );
    }

    ngOnInit(): void {
        // Required for subscriptions to work
        super.ngOnInit();

        this.getInitalList();
    } 

    public onCardToggle(i: number): void {
        const office = this.officeData.data[
            i
        ] as CompanyOfficeResponseWithGroupedContacts;

        if (office.groupedContacts) {
            Object.keys(office.groupedContacts).forEach((key) => {
                office.groupedContacts[key].isCardOpen = false;
            });
        }
    }

    public getList(): void {
        this.companyOfficeService
            .getOfficeList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.officeData = item.pagination;
                this.officeData.data = this.processOfficeData(this.officeData.data);
            });
    }
    
    private getInitalList(): void {
        this.officeData = this.activatedRoute.snapshot.data.office.pagination;
        this.officeData.data = this.processOfficeData(this.officeData.data);
    }
    
    private processOfficeData(data: CompanyOfficeResponse[]): CompanyOfficeResponse[] {
        return data.map((office) => {
            const groupedContacts = office.departmentContacts.reduce(
                (acc, contact) => {
                    const departmentName = contact.department?.name;
    
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
                },
                {} as Record<string, SettingsDepartmentCardModel>
            );
    
            return {
                ...office,
                groupedContacts,
            };
        });
    }
    
 

    public handleConfirmation(res: Confirmation): void {
        if (
            res.type === DropActionsStringEnum.DELETE &&
            res.template === DropActionsStringEnum.COMPANY_OFFICE
        ) {
            this.settingsLocationService
                .deleteCompanyOfficeById(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }
}
