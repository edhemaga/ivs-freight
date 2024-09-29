import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs';

// Models
import { ParkingResponsePagination } from 'appcoretruckassist';

// services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';


import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { CompanyOfficeService } from '@shared/services/company-office.service';

// Components
import { SettingsLocationBaseComponent } from '../settings-location-base/settings-location-base.component';

// Enums
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
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
    public officeData: ParkingResponsePagination;
    public isParkingCardOpened: boolean[] = [];

    constructor(
        tableService: TruckassistTableService,
        confirmationService: ConfirmationService,
        cdRef: ChangeDetectorRef,
        activatedRoute: ActivatedRoute,
        settingsLocationService: SettingsLocationService,
        dropDownService: DropDownService,
        FormatCurrencyPipe: FormatCurrencyPipe,
        private companyOfficeService: CompanyOfficeService
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

        this.officeData = this.activatedRoute.snapshot.data.office.pagination;

        this.officeData.data.forEach(() =>
            this.isParkingCardOpened.push(true)
        );
    }

    public onCardToggle(i: number): void {
        this.isParkingCardOpened[i] = false;
    }

    public getList(): void {
        this.companyOfficeService
            .getOfficeList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.officeData = item.pagination));
    }

    public handleConfirmation(res: any): void {
        if (res.type === DropActionsStringEnum.DELETE && res.template === DropActionsStringEnum.COMPANY_OFFICE) {
            this.settingsLocationService
                .deleteCompanyOfficeById(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }
}
