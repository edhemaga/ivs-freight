import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// services
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { SettingsLocationService } from '../../services/settings-location.service';
import { RepairService } from 'src/app/shared/services/repair.service';
import { CompanyRepairShopService } from '../../../../services/company-repairshop.service';

// pipes
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';

// core
import { RepairShopResponse } from 'appcoretruckassist';

// utils
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';

@Component({
    selector: 'app-settings-repair-shop',
    templateUrl: './settings-repair-shop.component.html',
    styleUrls: ['./settings-repair-shop.component.scss'],
    providers: [FormatCurrency],
})
export class SettingsRepairShopComponent implements OnInit, OnDestroy {
    public repairShopData: any;
    private destroy$ = new Subject<void>();
    public count: number = 0;
    public repairsActions: any;
    public repairShopDataId: any;
    constructor(
        private settingsLocationService: SettingsLocationService,
        private repairShopSrv: CompanyRepairShopService,
        private tableService: TruckassistTableService,
        private cdRef: ChangeDetectorRef,
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private FormatCurrency: FormatCurrency,
        private repairService: RepairService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.getRepairShopList();
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
                            if (res.template === 'Company Repair Shop') {
                                this.deleteRepairShopById(res.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.repairShopData =
            this.activatedRoute.snapshot.data.companyrepairshop.pagination;
        this.initOptions();
    }
    public getRepairShopById(id: number) {
        this.repairService
            .getRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.repairShopDataId = item));
    }
    public repairDropActions(any: any, actions: string) {
        this.getRepairShopById(any.id);
        setTimeout(() => {
            const name = dropActionNameDriver(any, actions);
            this.dropDownService.dropActionCompanyLocation(
                any,
                name,
                this.repairShopDataId
            );
        }, 150);
    }

    public deleteRepairShopById(id: number) {
        this.repairService
            .deleteRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    public onAction(modal: { modalName: string; type: string }) {
        this.settingsLocationService.onModalAction(modal);
    }
    public getRepairShopList() {
        this.repairShopSrv
            .getRepairShopList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairShopData = item.pagination;
            });
    }
    public identity(index: number, item: any): number {
        return item.id;
    }
    /**Function for dots in cards */
    public initOptions(): void {
        this.repairsActions = {
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
                    title: 'Add Bill',
                    name: 'add-bill',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                    blueIcon: true,
                    iconName: 'assets/svg/common/ic_plus.svg',
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
                    title: 'Close Business',
                    name: 'close-business',
                    svg: 'assets/svg/common/close-business-icon.svg',
                    redIcon: true,
                    show: true,
                    iconName: 'close-business',
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
            `-  ${this.FormatCurrency.transform(data.rent)}`
        );
    }

    public getActiveServices(data: RepairShopResponse) {
        return data.serviceTypes.filter((item) => item.active);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
