import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';

// Models
import { TerminalResponse } from 'appcoretruckassist';
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';

// services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CompanyTerminalService } from '@pages/settings/services/company-terminal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { DropDownService } from '@shared/services/drop-down.service';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// Components
import { SettingsLocationBaseComponent } from '@pages/settings/pages/settings-location/components/settings-location-base/settings-location-base.component';

// Enums
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

@Component({
    selector: 'app-settings-terminal',
    templateUrl: './settings-terminal.component.html',
    styleUrls: ['./settings-terminal.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsTerminalComponent
    extends SettingsLocationBaseComponent
    implements OnInit
{
    public terminalData: any;
    public isOfficeCardOpened: boolean[] = [];
    public isOWareHouseCardOpened: boolean[] = [];
    public isParkingCardOpened: boolean[] = [];

    constructor(
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        protected activatedRoute: ActivatedRoute,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        public FormatCurrencyPipe: FormatCurrencyPipe,
        private terminalService: CompanyTerminalService,
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
        this.terminalData =
            this.activatedRoute.snapshot.data.terminal.pagination;

        this.terminalData.data.forEach((terminal: TerminalResponse) => {
            this.isOfficeCardOpened.push(terminal.officeChecked);
            this.isOWareHouseCardOpened.push(terminal.warehouseChecked);
            this.isParkingCardOpened.push(terminal.parkingChecked);
        });
    }

    public onCardToggle(i: number): void {
        this.isOfficeCardOpened[i] = false;
        this.isOWareHouseCardOpened[i] = false;
        this.isParkingCardOpened[i] = false;
    }

    public getList(): void {
        this.terminalService
            .getTerminalList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.terminalData = item.pagination));
    }

    public handleConfirmation(res: Confirmation): void {
        if (
            res.type === DropActionsStringEnum.DELETE &&
            res.template === DropActionsStringEnum.COMPANY_TERMINAL
        ) {
            this.settingsLocationService
                .deleteCompanyTerminalById(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }
}
