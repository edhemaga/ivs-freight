import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { RepairShopResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { RepairOrderModalComponent } from '../../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairDQuery } from '../../state/details-state/repair-d.query';
import { UpdateReviewCommand } from '../../../../../../../appcoretruckassist';
import { ReviewsRatingService } from '../../../../services/reviews-rating/reviewsRating.service';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-shop-repair-details-item',
    templateUrl: './shop-repair-details-item.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./shop-repair-details-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [card_component_animation('showHideCardBody', '0px', '0px')],
})
export class ShopRepairDetailsItemComponent implements OnInit, OnChanges {
    @Input() repairShopItem: RepairShopResponse | any = null;
    public repairListData: any;
    public repairedVehicleListData: any;
    public data;
    public dummyData: any;
    public reviewsRepair: any = [];
    public repairShopLikes: number;
    public repairShopDislike: number;
    public showRepairItems: boolean[] = [];
    private destroy$ = new Subject<void>();
    public repairsTest: any;

    constructor(
        private dropDownService: DropDownService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private repairDQuery: RepairDQuery,
        private cdr: ChangeDetectorRef,
        private reviewRatingService: ReviewsRatingService,
        private tableService: TruckassistTableService,
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.repairShopItem?.currentValue?.data !=
            changes.repairShopItem?.previousValue?.data
        ) {
            this.repairShopLikes =
                changes.repairShopItem?.currentValue?.data.upCount;
            this.repairShopDislike =
                changes.repairShopItem?.currentValue?.data.downCount;
            this.getReviews(changes.repairShopItem?.currentValue?.data);
            this.initTableOptions();
            this.repairDQuery.repairList$
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (item) => (
                        (this.repairListData = item.pagination.data),
                        this.cdr.detectChanges()
                    )
                );
            this.repairDQuery.repairedVehicleList$
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (item) => (
                        (this.repairedVehicleListData = item.pagination.data),
                        this.cdr.detectChanges()
                    )
                );
            this.repairListData?.map((item) => {
                this.showRepairItems[item.id] = false;
            });
        }
    }
    ngOnInit(): void {
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            // if (res.template === 'repair') {
                            //   this.deleteRepairByIdFunction(res.id);
                            // }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        
        this.initTableOptions();

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation && res.tab === 'repair') {
                    let index;
                    this.repairListData.map((item, inx) => {
                        if ( item.id == res.id ) {
                            index = inx;

                        }
                    })

                    if ( index ) {
                        this.repairListData[index] = res.data;
                        this.cdr.detectChanges();
                    }
                }
            });
    }

    public deleteRepairByIdFunction(id: number) {
        // this.shopService
        //   .deleteRepairById(id)
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe();
    }

    public toggleRepairs(index: number, event?: any) {
        event.stopPropagation();
        event.preventDefault();
        this.showRepairItems[index] = !this.showRepairItems[index];
    }

    public optionsEvent(any: any, action: string) {
        const name = dropActionNameDriver(any, action);
        setTimeout(() => {
            this.dropDownService.dropActions(
                any,
                name,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                any,
                null,
                null
            );
        }, 100);
    }

    public finishOrder(repairId: number, data: any, event?: any) {
        event.stopPropagation();
        event.preventDefault();
        this.modalService.openModal(
            RepairOrderModalComponent,
            { size: 'small' },
            {
                id: data.id,
                payload: data,
                file_id: repairId,
                type: 'edit',
                modal: 'repair',
            }
        );
    }
    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dummyData = {
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
                    title: 'border'
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    iconName: 'view-details',
                    show: true,
                },
                {
                    title: 'Finish Order',
                    name: 'finish order',
                    iconName: 'finish-order', 
                    blueIcon: true,
                },
                {
                    title: 'All Bills',
                    name: 'all bills',
                    iconName: 'ic_truck',
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
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash.svg',
                    danger: true,
                    show: true,
                    iconName: 'delete',
                    redIcon: true,
                },
            ],
            export: true,
        };
    }
    public getReviews(reviewsData: RepairShopResponse) {
        this.reviewsRepair = reviewsData?.reviews?.map((item) => {
            return {
                ...item,
                companyUser: {
                    ...item.companyUser,
                    avatar: item.companyUser.avatar
                        ? item.companyUser.avatar
                        : 'assets/svg/common/ic_profile.svg',
                },
                commentContent: item.comment,
                rating: item.ratingFromTheReviewer,
            };
        });
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public changeReviewsEvent(reviews: { data: any; action: string }) {
         if ( reviews.action == 'update' ) {
            const review: UpdateReviewCommand = {
                id: reviews.data.id,
                comment: reviews.data.commentContent,
            };
           
            this.reviewRatingService
            .updateReview(review)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
         } else if ( reviews.action == 'delete' ) {
            this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
         }
        //this.reviewsRepair = [...reviews.data];
        // TODO: API CREATE OR DELETE
    }


    public openRepairDetail(repair){
        if ( this.showRepairItems[repair.id] ) {
            this.showRepairItems[repair.id] = false;
        } else {
            if ( repair?.items?.length > 0 ) {
                this.showRepairItems[repair.id] = true;
            }
        }
    }

    public stopClick(ev){
        ev.stopPropagation();
        ev.preventDefault();
    }
}
