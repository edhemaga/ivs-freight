import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// Services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';

// Helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// SVG routes
import {
    SettingsLocationSvgRoutes,
    SettingsLocationConfig,
    SettingsProgressHelper,
} from '@pages/settings/pages/settings-location/utils';

// Models
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';
import { AllTableAnimationModel } from '@shared/models/table-models/all-table-animation.model';
import {
    CompanyOfficeResponse,
    ParkingResponse,
    RepairShopResponse,
    TerminalResponse,
} from 'appcoretruckassist';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Component({
    selector: 'app-settings-location-base',
    templateUrl: './settings-location-base.component.html',
    styleUrls: ['./settings-location-base.component.scss'],
    providers: [FormatCurrencyPipe],
})
export abstract class SettingsLocationBaseComponent implements OnDestroy {
    protected destroy$ = new Subject<void>();

    public svgRoutes = SettingsLocationSvgRoutes;

    public options = SettingsLocationConfig.options;

    constructor(
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        protected activatedRoute: ActivatedRoute,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        public FormatCurrencyPipe: FormatCurrencyPipe,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.onPageLoad();

        this.onDeleteModalConfirmation();
    }

    private onPageLoad() {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: AllTableAnimationModel) => {
                if (res?.animation) {
                    this.getList();
                    this.cdRef.detectChanges();
                }
            });
    }

    private onDeleteModalConfirmation() {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => this.handleConfirmation(res),
            });
    }

    public onAction(modal: { modalName: string; type: string }): void {
        this.settingsLocationService.onModalAction(modal);
    }

    public optionsEvent(
        eventData: { type: string },
        action: string,
        item: any
    ): void {
        setTimeout(() => {
            if (eventData.type === TableStringEnum.VIEW_DETAILS) {
                if (action === TableStringEnum.REPAIR_SHOP_3) {
                    this.router.navigate([`/list/repair/${item.id}/details`]);
                }
            } else {
                const name = DropActionNameHelper.dropActionNameDriver(
                    eventData,
                    action
                );
                this.dropDownService.dropActionCompanyLocation(
                    eventData,
                    name,
                    item
                );
            }
        }, 100);
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    // This will come from components later, delete when it happens

    public generateTextForProgressBar(
        data:
            | TerminalResponse
            | ParkingResponse
            | CompanyOfficeResponse
            | RepairShopResponse
    ): string {
        return `${
            data.payPeriod?.name
        } Rent - ${this.FormatCurrencyPipe.transform(data.rent)}`;
    }

    // This will come from components later, delete when it happens
    public getRentDate(mod: number): string {
        return SettingsProgressHelper.getRentDate(mod);
    }

    // Implement in parent
    abstract getList(): void;

    abstract handleConfirmation(res: Confirmation): void;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
