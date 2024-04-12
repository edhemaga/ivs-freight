import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

//Pipe
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

//Service
import { DropDownService } from '@shared/services/drop-down.service';
import { NotificationService } from '@shared/services/notification.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CompanyOfficeService } from '@shared/services/company-office.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';

//Utils
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';
@Component({
    selector: 'app-settings-office',
    templateUrl: './settings-office.component.html',
    styleUrls: ['./settings-office.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsOfficeComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public officeActions: any;
    public officeData: any;
    public officeDataById: any;
    constructor(
        private settingsLocationService: SettingsLocationService,
        private companyOfficeService: CompanyOfficeService,
        private tableService: TruckassistTableService,
        private cdRef: ChangeDetectorRef,
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private FormatCurrencyPipe: FormatCurrencyPipe,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.getOfficeList();
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
                            if (res.template === 'Company Office') {
                                this.deleteOfficeById(res.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.officeData = this.activatedRoute.snapshot.data.office.pagination;
        this.initOptions();
    }
    public getOfficeById(id: number) {
        this.settingsLocationService
            .getCompanyOfficeById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.officeDataById = item));
    }
    public deleteOfficeById(id: number) {
        this.settingsLocationService
            .deleteCompanyOfficeById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    public onAction(modal: { modalName: string; type: any }) {
        this.settingsLocationService.onModalAction(modal);
    }

    public getOfficeList() {
        this.companyOfficeService
            .getOfficeList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.officeData = item.pagination));
    }

    public identityOfficeData(index: number, item: any): number {
        return item.id;
    }

    public identityCardData(index: number, item: any): number {
        return item.id;
    }

    public officeDropActions(any: any, actions: string) {
        this.getOfficeById(any.id);
        setTimeout(() => {
            const name = DropActionNameHelper.dropActionNameDriver(
                any,
                actions
            );
            this.dropDownService.dropActionCompanyLocation(
                any,
                name,
                this.officeDataById
            );
        }, 100);
    }
    /**Function for dots in cards */
    public initOptions(): void {
        this.officeActions = {
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

    public generateTextForProgressBar(data: any): string {
        return (
            data.payPeriod.name +
            ' Rent ' +
            `- ${this.FormatCurrencyPipe.transform(data.rent)}`
        );
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
