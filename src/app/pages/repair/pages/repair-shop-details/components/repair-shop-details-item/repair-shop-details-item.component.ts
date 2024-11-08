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
import { Subject, takeUntil } from 'rxjs';

// Models
import { RepairShopResponse, UpdateReviewCommand } from 'appcoretruckassist';

// Services
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// Store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';

// Components
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';

// Animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { CommonModule } from '@angular/common';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { FormatCurrencyPipe, FormatDatePipe } from '@shared/pipes';
import { RepairShopDetailsCard } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/repair-shop-details-card.component';

@Component({
    selector: 'app-repair-shop-details-item',
    templateUrl: './repair-shop-details-item.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./repair-shop-details-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [cardComponentAnimation('showHideCardBody', '0px', '0px')],
    standalone: true,
    imports: [
        // Modules
        CommonModule,

        ///// TODO
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        /*  TaInputNoteComponent, */
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaUploadFilesComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderComponent,
        TaTabSwitchComponent,
        TaDetailsDropdownComponent,
        RepairShopDetailsCard,

        // Pipes
        FormatDatePipe,
        FormatCurrencyPipe,
    ],
})
export class RepairShopDetailsItemComponent implements OnInit, OnChanges {
    @Input() repairShopItem: RepairShopResponse | any = null;
    @Input() customClass: string | any = '';
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
        // Services
        private dropDownService: DropDownService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private reviewRatingService: ReviewsRatingService,
        private tableService: TruckassistTableService,

        // Store
        private repairDetailsQuery: RepairDetailsQuery,

        // Ref
        private cdr: ChangeDetectorRef
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
            this.repairDetailsQuery.repairList$
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (item) => (
                        (this.repairListData = item.pagination.data),
                        this.cdr.detectChanges()
                    )
                );
            this.repairDetailsQuery.repairedVehicleList$
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
                next: (res) => {
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
                if (res?.animation && res.tab === 'repair') {
                    let index = -1;
                    this.repairListData.map((item, inx) => {
                        if (item.id == res.id) {
                            index = inx;
                        }
                    });

                    if (index > -1) {
                        this.repairListData[index] = {
                            ...this.repairListData[index],
                            ...res.data,
                        };
                        this.cdr.detectChanges();
                    }
                }
            });
    }

    public toggleRepairs(index: number, event?: any) {
        event.stopPropagation();
        event.preventDefault();
        this.showRepairItems[index] = !this.showRepairItems[index];
    }

    public optionsEvent(eventData: any, action: string) {
        if (eventData.type == 'finish order') {
            this.finishOrder(eventData.id, eventData.data, undefined, 'bill');
        }

        const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            action
        );
        setTimeout(() => {
            this.dropDownService.dropActions(
                eventData,
                name,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                eventData,
                null,
                null
            );
        }, 100);
    }

    public finishOrder(
        repairId: number,
        data: any,
        event?: any,
        subType?: any
    ) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        this.modalService.openModal(
            RepairOrderModalComponent,
            { size: 'small' },
            {
                id: data.id,
                payload: data,
                file_id: repairId,
                type: 'edit',
                modal: 'repair',
                subTypeOpened: subType ? subType : '',
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
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    iconName: TableStringEnum.EDIT,
                },
                {
                    title: 'border',
                },
                {
                    title: TableStringEnum.VIEW_DETAILS_2,
                    name: TableStringEnum.VIEW_DETAILS,
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    iconName: TableStringEnum.VIEW_DETAILS,
                    show: true,
                },
                {
                    title: TableStringEnum.FINISH_ORDER_3,
                    name: TableStringEnum.FINISH_ORDER,
                    iconName: TableStringEnum.FINISH_ORDER,
                    blueIcon: true,
                },
                {
                    title: TableStringEnum.ALL_BILLS_2,
                    name: TableStringEnum.ALL_BILLS,
                    iconName: 'ic_truck',
                },
                {
                    title: TableStringEnum.BORDER,
                },
                {
                    title: TableStringEnum.SHARE_2,
                    name: TableStringEnum.SHARE,
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: TableStringEnum.SHARE,
                },
                {
                    title: TableStringEnum.PRINT_2,
                    name: TableStringEnum.PRINT,
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: TableStringEnum.PRINT,
                },
                {
                    title: TableStringEnum.BORDER,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.REPAIR_DETAIL,
                    svg: 'assets/svg/common/ic_trash.svg',
                    danger: true,
                    show: true,
                    iconName: TableStringEnum.DELETE,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }
    public getReviews(reviewsData: RepairShopResponse) {
        this.reviewsRepair = reviewsData?.ratingReviews?.map((item) => {
            return {
                ...item,
                companyUser: {
                    ...item.companyUser,
                    avatar: /*  item.companyUser.avatar
                        ? item.companyUser.avatar
                        : */ 'assets/svg/common/ic_profile.svg',
                },
                commentContent: item.comment,
                rating: item.thumb, // item.ratingFromTheReviewer doesn't exist in response
            };
        });
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public changeReviewsEvent(reviews: { data: any; action: string }) {
        if (reviews.action == 'update') {
            const review: UpdateReviewCommand = {
                id: reviews.data.id,
                comment: reviews.data.commentContent,
            };

            this.reviewRatingService
                .updateReview(review)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        } else if (reviews.action == 'delete') {
            this.reviewRatingService
                .deleteReview(reviews.data)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
        //this.reviewsRepair = [...reviews.data];
        // TODO: API CREATE OR DELETE
    }

    public openRepairDetail(repair) {
        if (this.showRepairItems[repair.id]) {
            this.showRepairItems[repair.id] = false;
        } else {
            if (repair?.items?.length > 0) {
                this.showRepairItems[repair.id] = true;
            }
        }
    }

    public stopClick(ev, data) {
        ev.stopPropagation();
        ev.preventDefault();

        if (data.truckId) {
            this.dummyData.actions[4]['iconName'] = 'ic_truck';
        } else if (data.trailerId) {
            this.dummyData.actions[4]['iconName'] = 'ic_trailer';
        }

        if (data.repairType.name != 'Bill') {
            this.dummyData.actions[3]['hide'] = false;
            this.dummyData.actions[4]['title'] = 'All Orders';
        } else {
            this.dummyData.actions[3]['hide'] = true;
            this.dummyData.actions[4]['title'] = 'All Bills';
        }
    }
}
