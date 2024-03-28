import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { SettingsLocationService } from '../../state/location-state/settings-location.service';
import { CompanyParkingService } from './parking-state/company-parking.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
@Component({
    selector: 'app-settings-parking',
    templateUrl: './settings-parking.component.html',
    styleUrls: ['./settings-parking.component.scss'],
    providers: [formatCurrency],
})
export class SettingsParkingComponent implements OnInit, OnDestroy {
    public parkingPhone: boolean;
    public parkingEmail: boolean;
    private destroy$ = new Subject<void>();
    public parkingData: any;
    public parkingDataById: any;
    public parkingActions: any;
    public parkingSlots: any[] = [
        {
            id: 5,
            value: 0,
        },
        {
            id: 6,
            value: 0,
        },
    ];
    public currentDate: any;

    constructor(
        private settingsLocationService: SettingsLocationService,
        private companyParkingService: CompanyParkingService,
        private tableService: TruckassistTableService,
        private cdRef: ChangeDetectorRef,
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private formatCurrency: formatCurrency,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.getParkingList();
                    this.cdRef.detectChanges();
                }
            });

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'Company Parking') {
                                this.deleteParkingById(res.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.parkingData = this.activatedRoute.snapshot.data.parking.pagination;
        this.initOptions();
        this.currentDate = moment(new Date()).format('MM/DD/YY');
    }

    public getRentDate(mod) {
        let day;
        let currentDate = new Date();

        if (mod == 1) {
            day = 1;
        } else if (mod == 2) {
            day = 5;
        } else if (mod == 3) {
            day = 10;
        } else if (mod == 4) {
            day = 15;
        } else if (mod == 5) {
            day = 20;
        } else if (mod == 6) {
            day = 25;
        } else {
            day = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth()
            ).getUTCDate();
        }

        let currentDay = currentDate.getUTCDate();
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

        expDate = moment(expDate).format('MM/DD/YY');
        return expDate;
    }

    public onAction(modal: { modalName: string; type: any }) {
        this.settingsLocationService.onModalAction(modal);
    }
    public getParkingById(id: number) {
        this.settingsLocationService
            .getCompanyParkingById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.parkingDataById = item));
    }

    public optionsEvent(eventData: any, action: string) {
        this.getParkingById(eventData.id);

        setTimeout(() => {
            const name = dropActionNameDriver(eventData, action);
            this.dropDownService.dropActionCompanyLocation(
                eventData,
                name,
                this.parkingDataById
            );
        }, 100);
    }

    public deleteParkingById(id: number) {
        this.settingsLocationService
            .deleteCompanyParkingById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    public identity(index: number, item: any): number {
        return item.id;
    }
    /**Function for dots in cards */
    public initOptions(): void {
        this.parkingActions = {
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
                    text: 'Are you sure you want to delete driver(s)?',
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

    public getParkingList() {
        this.companyParkingService
            .getParkingList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.parkingData = item.pagination));
    }

    public generateTextForProgressBar(data: any): string {
        return (
            data.payPeriod.name +
            ' Rent ' +
            `-  ${this.formatCurrency.transform(data.rent)}`
        );
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
