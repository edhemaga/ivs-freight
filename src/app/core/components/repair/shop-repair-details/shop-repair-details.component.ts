import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
} from '@angular/core';
import { RepairShopResponse } from 'appcoretruckassist';
import { Subject, take, takeUntil } from 'rxjs';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { RepairDQuery } from '../state/details-state/repair-d.query';
import { RepairTService } from '../state/repair.service';
import { RepairDStore } from '../state/details-state/repair-d.store';

@Component({
    selector: 'app-shop-repair-details',
    templateUrl: './shop-repair-details.component.html',
    styleUrls: ['./shop-repair-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DetailsPageService],
})
export class ShopRepairDetailsComponent implements OnInit, OnDestroy {
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
        private act_route: ActivatedRoute,
        private detailsPageDriverService: DetailsPageService,
        private router: Router,
        private shopService: RepairTService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private cdRef: ChangeDetectorRef,
        private DetailsDataService: DetailsDataService,
        private dropDownService: DropDownService,
        private repairDQuery: RepairDQuery,
        private repairDStore: RepairDStore
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
        this.repairDQuery.repairShopMinimal$
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
                    if ( res.type === 'delete' ) {
                        if (res.template === 'repair shop') {
                            this.deleteRepairShopById(res?.id);
                        }
                    } else if ( res.type === 'activate' ) {
                        if (res.template === 'repair shop' || res.template === 'Repair Shop') {
                            this.openRepairShop(res?.id);
                        }
                    } else if ( res.type === 'deactivate' ) {
                        if (res.template === 'repair shop' || res.template === 'Repair Shop') {
                            this.closeRepairShop(res?.id);
                        }
                    } else if ( res.type === 'info' ) {
                        if ( res.subType === 'favorite' ) {
                            if ( res.subTypeStatus === 'move' || res.subTypeStatus === 'remove' ) {
                                this.changePinnedStatus(res?.id)
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
        this.repairDQuery.repairList$
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairsDataLength = item.pagination.count;
            });
        this.repairDQuery.repairedVehicleList$
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairedDataLength = item.pagination.count;
            });
        this.getRepairShopDataFromStore();
    }
    private getRepairShopDataFromStore(id?: number) {
        this.currentIndex = this.repairDStore
            .getValue()
            .repairShopMinimal.pagination.data.findIndex(
                (shop) =>
                    shop.id ===
                    (id ? id : +this.act_route.snapshot.params['id'])
            );
        
        this.repairDQuery.repairShop$
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
                    iconName: 'edit'
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
                    iconName: 'ic_plus'
                },
                {
                    title: 'Mark as favorite',
                    name: 'move-to-favourite',
                    svg: 'assets/svg/common/ic_star.svg',
                    activate: true,
                    show: true,
                    iconName: 'ic_star'
                },
                {
                    title: 'Write Review',
                    name: 'write-review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review'
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share'
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print'
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
                    iconName: 'close-business'
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
                    iconName: 'delete'
                },
            ],
            export: true,
        };
    }
    public dropActionRepair(event: any) {
        if ( event.type == 'write-review' ){
            event.type = 'edit';
            event.openedTab = 'Review';
        }

        console.log('---here---', event)
        this.dropDownService.dropActionsHeaderRepair(
            event,
            this.repairObject,
            event.id,
        );
    }

    public onModalAction(event: any){
        let eventType = '';
       if ( event == 'Contact' || event == 'Review'){
            eventType = 'edit'
       } else {
            eventType = event;
       }
        let eventObject = {
            id: this.repairObject.id,
            type: eventType,
            openedTab: event,
        }

        this.dropDownService.dropActionsHeaderRepair(
            eventObject
        );
    }

    public deleteRepairShopById(id: number) {
        let last = this.repairList.at(-1);
        if (
            last.id ===
            this.repairDStore.getValue().repairShopMinimal.pagination.data[
                this.currentIndex
            ].id
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        let repairId =
            this.repairDStore.getValue().repairShopMinimal.pagination.data[
                this.currentIndex
            ].id;

        this.shopService
            .deleteRepairShopByIdDetails(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (
                        this.repairDStore.getValue().repairShopMinimal
                            .pagination.count >= 1
                    ) {
                        this.router.navigate([
                            `/list/repair/${repairId}/shop-details`,
                        ]);
                    }
                },
                error: (error) => {
                    this.router.navigate(['/list/repair']);
                },
            });
    }

    /**Function for header names and array of icons */
    public shopConf(data?: RepairShopResponse) {
        this.repairObject = data;
        this.DetailsDataService.setNewData(data);
        
        if (data?.openHoursToday === 'Closed') {
            this.togglerWorkTime = false;
        } else {
            this.togglerWorkTime = true;
        }

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
                repairOpen: data?.openHoursToday === 'Closed' ? false : true,
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
                repairOpen: data?.openHoursToday === 'Closed' ? false : true,
            },
            {
                id: 3,
                nameDefault: 'Review & Rating',
                template: 'review',
                length: data?.reviews?.length ? data.reviews.length : 0,
                hasDateArrow: false,
                hide: false,
                data: data,
                repairOpen: data?.openHoursToday === 'Closed' ? false : true,
            },
        ];

        this.repairShopId = data?.id ? data.id : null;
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public closeRepairShop(shopId){
        this.shopService.changeShopStatus(shopId);
    }

    public openRepairShop(shopId){
        this.shopService.changeShopStatus(shopId);
    }

    public changePinnedStatus(shopId){
        this.shopService.changePinnedStatus(shopId);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
