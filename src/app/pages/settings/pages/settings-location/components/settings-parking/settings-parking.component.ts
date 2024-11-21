import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { takeUntil } from 'rxjs';

// Models
import { ParkingResponsePagination } from 'appcoretruckassist';
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';

// services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CompanyParkingService } from '@pages/settings/services/company-parking.service';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { DropDownService } from '@shared/services/drop-down.service';

// Components
import { SettingsLocationBaseComponent } from '@pages/settings/pages/settings-location/components/settings-location-base/settings-location-base.component';

// Enums
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

@Component({
    selector: 'app-settings-parking',
    templateUrl: './settings-parking.component.html',
    styleUrls: ['./settings-parking.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsParkingComponent
    extends SettingsLocationBaseComponent
    implements OnInit
{
    public parkingData: ParkingResponsePagination;
    public isParkingCardOpened: boolean[] = [];

    constructor(
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        protected activatedRoute: ActivatedRoute,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        public FormatCurrencyPipe: FormatCurrencyPipe,
        private companyParkingService: CompanyParkingService,
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

    private getInitalList() {
        this.parkingData = this.activatedRoute.snapshot.data.parking.pagination;

        this.parkingData.data.forEach(() =>
            this.isParkingCardOpened.push(true)
        );
    }

    public onCardToggle(i: number): void {
        this.isParkingCardOpened[i] = false;
    }

    public getList(): void {
        this.companyParkingService
            .getParkingList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.parkingData = item.pagination));
    }

    public handleConfirmation(res: Confirmation): void {
        if (
            res.type === DropActionsStringEnum.DELETE &&
            res.template === DropActionsStringEnum.COMPANY_PARKING
        ) {
            this.settingsLocationService
                .deleteCompanyParkingById(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }
}
