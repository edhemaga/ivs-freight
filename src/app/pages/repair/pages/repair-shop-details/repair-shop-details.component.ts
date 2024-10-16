import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Subject, take, takeUntil, distinctUntilChanged } from 'rxjs';

// Services
import { DropDownService } from '@shared/services/drop-down.service';
import { RepairService } from '@shared/services/repair.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// Store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';
import { RepairDetailsStore } from '@pages/repair/state/repair-details-state/repair-details.store';

// Models
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details',
    templateUrl: './repair-shop-details.component.html',
    styleUrls: ['./repair-shop-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DetailsPageService],
})
export class RepairShopDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public shopRepairConfig: any[] = [];
    public repairDrop: any;
    public repairShopId: number;
    public repairList: any;
    public repairObject: any;
    public togglerWorkTime: boolean;
    public businessOpen: boolean;
    public repairsDataLength: number = 0;
    public repairedDataLength: number = 0;
    public currentIndex: number = 0;
    constructor(
        // Router
        private router: Router,
        private act_route: ActivatedRoute,

        // Services
        private detailsPageDriverService: DetailsPageService,
        private shopService: RepairService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private DetailsDataService: DetailsDataService,
        private dropDownService: DropDownService,

        // Ref
        private cdRef: ChangeDetectorRef,

        // Store
        private repairDetailsQuery: RepairDetailsQuery,
        private repairDetailsStore: RepairDetailsStore
    ) {}

    ngOnInit(): void {
        this.getRepairListAndRepairedCount();
        // Call Change Count When Router Change
        this.router.events
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: any) => {
                if (event instanceof NavigationEnd) {
                    this.getRepairListAndRepairedCount();
                }
            });
        this.getRepairShopDataFromStore();
        this.repairDetailsQuery.repairShopMinimal$
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairList = item.pagination.data;

                this.cdRef.detectChanges();
            });

        this.initTableOptions();
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation === 'update' && res.tab === 'repair-shop') {
                    this.getRepairShopDataFromStore(res.id);
                    this.cdRef.detectChanges();
                }
                if (res.animation === 'delete' && res.tab === 'repair-shop') {
                    this.getRepairShopDataFromStore(res.id);
                    this.cdRef.detectChanges();
                }
            });

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res.type === 'delete') {
                        if (res.template === 'repair shop') {
                            this.deleteRepairShopById(res?.id);
                        }
                    } else if (res.type === 'activate') {
                        if (
                            res.template === 'repair shop' ||
                            res.template === 'Repair Shop'
                        ) {
                            this.openRepairShop(res?.id);
                        }
                    } else if (res.type === 'deactivate') {
                        if (
                            res.template === 'repair shop' ||
                            res.template === 'Repair Shop'
                        ) {
                            this.closeRepairShop(res?.id);
                        }
                    } else if (res.type === 'info') {
                        if (res.subType === 'favorite') {
                            if (
                                res.subTypeStatus === 'move' ||
                                res.subTypeStatus === 'remove'
                            ) {
                                this.changePinnedStatus(res?.id);
                            }
                        }
                    }
                },
            });

        // This service will call on event from shop-repair-card-view component
        this.detailsPageDriverService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id: number) => {
                if (this.router.url.includes('shop-details') && id) {
                    this.router.navigate([`/list/repair/${id}/shop-details`]);
                    this.getRepairShopDataFromStore(id);
                    this.cdRef.detectChanges();
                }
            });
    }

    public getRepairListAndRepairedCount() {
        this.repairDetailsQuery.repairList$
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairsDataLength = item.pagination.count;
            });
        this.repairDetailsQuery.repairedVehicleList$
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairedDataLength = item.pagination.count;
            });
        this.getRepairShopDataFromStore();
    }
    private getRepairShopDataFromStore(id?: number) {
        this.currentIndex = this.repairDetailsStore
            .getValue()
            .repairShopMinimal.pagination.data.findIndex(
                (shop) =>
                    shop.id ===
                    (id ? id : +this.act_route.snapshot.params['id'])
            );

        this.repairDetailsQuery.repairShop$
            .pipe(take(1), takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((items: RepairShopResponse[]) => {
                const findedRepairShop = items.find(
                    (item) =>
                        item.id ===
                        (id ? id : +this.act_route.snapshot.params['id'])
                );

                if (findedRepairShop) {
                    this.shopConf(findedRepairShop);
                }
            });
        this.cdRef.detectChanges();
    }

    public initTableOptions() {
        this.repairDrop = {
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
                    title: 'Add Bill',
                    name: 'Repair',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                    blueIcon: true,
                    iconName: 'ic_plus',
                },
                {
                    title: 'Mark as favorite',
                    name: 'move-to-favourite',
                    svg: 'assets/svg/common/ic_star.svg',
                    activate: true,
                    show: true,
                    iconName: 'ic_star',
                },
                {
                    title: 'Write Review',
                    name: 'write-review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review',
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
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
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
    public dropActionRepair(event: any) {
        if (event.type == 'write-review') {
            event.type = 'edit';
            event.openedTab = 'Review';
        }

        this.dropDownService.dropActionsHeaderRepair(
            event,
            this.repairObject,
            event.id
        );
    }

    public onModalAction(event: any) {
        let eventType = '';
        if (event == 'Contact' || event == 'Review') {
            eventType = 'edit';
        } else {
            eventType = event;
        }
        let eventObject = {
            id: this.repairObject.id,
            type: eventType,
            openedTab: event,
        };

        this.dropDownService.dropActionsHeaderRepair(eventObject);
    }

    public deleteRepairShopById(id: number) {
        let last = this.repairList.at(-1);
        if (
            last.id ===
            this.repairDetailsStore.getValue().repairShopMinimal.pagination
                .data[this.currentIndex].id
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        let repairId =
            this.repairDetailsStore.getValue().repairShopMinimal.pagination
                .data[this.currentIndex].id;

        this.shopService
            .deleteRepairShopByIdDetails(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (
                        this.repairDetailsStore.getValue().repairShopMinimal
                            .pagination.count >= 1
                    ) {
                        this.router.navigate([
                            `/list/repair/${repairId}/shop-details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate(['/list/repair']);
                },
            });
    }

    /**Function for header names and array of icons */
    public shopConf(data?: RepairShopResponse) {
        this.repairObject = data;
        this.DetailsDataService.setNewData(data);

        /* if (data?.openHoursToday === 'Closed') {
            this.togglerWorkTime = false;
        } else {
            this.togglerWorkTime = true;
        } */

        this.businessOpen = data?.status ? true : false;

        this.shopRepairConfig = [
            {
                id: 0,
                nameDefault: 'Repair Shop Detail',
                template: 'general',
                data: data,
            },
            {
                id: 1,
                nameDefault: 'Repair',
                template: 'repair',
                icon: true,
                /* repairOpen: data?.openHoursToday === 'Closed' ? false : true, */
                length: this.repairsDataLength,
                customText: 'Date',
                hasDateArrow: true,
                total: data?.cost ? data.cost : 0,
                icons: [
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_clock.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_rubber.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_documents.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_sraf.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_funnel.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_dollar.svg',
                    },
                ],
                data: data,
            },
            {
                id: 2,
                nameDefault: 'Repaired Vehicle',
                template: 'repaired-vehicle',
                length: this.repairedDataLength,
                hide: true,
                customText: 'Repairs',
                hasDateArrow: true,
                data: data,
                /*   repairOpen: data?.openHoursToday === 'Closed' ? false : true, */
            },
            {
                id: 3,
                nameDefault: 'Review & Rating',
                template: 'review',
                length: data?.ratingReviews?.length
                    ? data.ratingReviews.length
                    : 0,
                hasDateArrow: false,
                hide: false,
                data: data,
                /*      repairOpen: data?.openHoursToday === 'Closed' ? false : true, */
            },
        ];

        this.repairShopId = data?.id ? data.id : null;
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public closeRepairShop(shopId) {
        this.shopService.changeShopStatus(shopId);
    }

    public openRepairShop(shopId) {
        this.shopService.changeShopStatus(shopId);
    }

    public changePinnedStatus(shopId) {
        this.shopService.changePinnedStatus(shopId);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
