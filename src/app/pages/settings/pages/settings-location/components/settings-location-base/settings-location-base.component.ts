import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

// Services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsLocationService } from '../../services/settings-location.service';

// Helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// SVG routes
import { SettingsLocationSvgRoutes } from '@pages/settings/pages/settings-location/utils/svg.routes';

@Component({
    selector: 'app-settings-location-base',
    templateUrl: './settings-location-base.component.html',
    styleUrls: ['./settings-location-base.component.scss'],
    providers: [FormatCurrencyPipe],
})
export abstract class SettingsLocationBaseComponent implements OnDestroy {
    protected destroy$ = new Subject<void>();
    public svgRoutes = SettingsLocationSvgRoutes;
    public options: any;
    constructor(
      protected tableService: TruckassistTableService,
      protected confirmationService: ConfirmationService,
      protected cdRef: ChangeDetectorRef,
      protected activatedRoute: ActivatedRoute,
      protected settingsLocationService: SettingsLocationService,
      private dropDownService: DropDownService,
      private FormatCurrencyPipe: FormatCurrencyPipe
    ) {}

    ngOnInit(): void {

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res?.animation) {
                    this.getList(); 
                    this.cdRef.detectChanges();
                }
            });

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {this.handleConfirmation(res); console.log(res)}, 
            });
 
        this.initOptions(); 
    }


    public onAction(modal: { modalName: string; type: string }): void {
        this.settingsLocationService.onModalAction(modal);
    }

    public optionsEvent(eventData: any, action: string, item: any): void {
        setTimeout(() => {
            const name = DropActionNameHelper.dropActionNameDriver(
                eventData,
                action
            );
            this.dropDownService.dropActionCompanyLocation(
                eventData,
                name,
                item
            );
        }, 100);
    }

    public generateTextForProgressBar(data: any): string {
        return `${
            data.payPeriod?.name
        } Rent - ${this.FormatCurrencyPipe.transform(data.rent)}`;
    }

    abstract getList(): void; 

    abstract handleConfirmation(res: any): void; 

    protected initOptions(): void {
        this.options = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                    iconName: 'view-details',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share',
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: 'delete',
                },
            ],
            export: true,
        };
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    // This will come from components later, delete when it happens
    
    public getRentDate(mod: number): string {
        let day: number;
        const currentDate = new Date();

        if (mod === 1) day = 1;
        else if (mod === 2) day = 5;
        else if (mod === 3) day = 10;
        else if (mod === 4) day = 15;
        else if (mod === 5) day = 20;
        else if (mod === 6) day = 25;
        else
            day = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth()
            ).getUTCDate();

        const currentDay = currentDate.getUTCDate();
        let expDate;

        if (day > currentDay) {
            expDate = new Date();
            expDate.setUTCDate(day);
        } else {
            expDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()
            );
            expDate.setUTCDate(day);
        }

        return moment(expDate).format('MM/DD/YY');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
