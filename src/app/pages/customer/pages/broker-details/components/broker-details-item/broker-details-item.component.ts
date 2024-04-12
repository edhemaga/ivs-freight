import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Modals
import { ReviewComment } from '@shared/models/review-comment.model';

// Decorators
import { Titles } from '@core/decorators/titles.decorator';

// Services
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

// Models
import { BrokerResponse, UpdateReviewCommand } from 'appcoretruckassist';

@Titles()
@Component({
    selector: 'app-broker-details-item',
    templateUrl: './broker-details-item.component.html',
    styleUrls: ['./broker-details-item.component.scss'],
})
export class BrokerDetailsItemComponent implements OnInit, OnChanges {
    private destroy$ = new Subject<void>();
    @Input() brokerData: BrokerResponse | any;
    public brokerContacts: any;
    public brokerLikes: number;
    public brokerDislike: number;
    public reviewsRepair: any = [];
    public dotsData: any;
    public stopsDataPickup: any;
    public stopsDataDelivery: any;

    constructor(private reviewRatingService: ReviewsRatingService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.brokerData?.currentValue !=
            changes.brokerData?.previousValue
        ) {
            this.brokerContacts =
                changes.brokerData.currentValue[0].data?.brokerContacts;
            this.brokerLikes = changes.brokerData.currentValue[0].data.upCount;
            this.brokerDislike =
                changes.brokerData.currentValue[0].data.downCount;
            this.getReviews(changes.brokerData.currentValue[0].data);
            this.getStops(changes.brokerData.currentValue[0].data);
        }
    }
    ngOnInit(): void {
        this.initTableOptions();
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getStops(data: BrokerResponse) {
        let datas;
        data?.loads?.map((item) => {
            datas = item.stops.map((itemStop) => {
                if (itemStop.stopType.name === 'Pickup') {
                    return {
                        date: itemStop.dateFrom,
                        stopOrder: itemStop.stopOrder,
                        addressCity: itemStop.shipper.address.city,
                        addressShortState:
                            itemStop.shipper.address.stateShortName,
                    };
                }
                if (itemStop.stopType.name === 'Delivery') {
                    return {
                        date: itemStop.dateFrom,
                        stopOrder: itemStop.stopOrder,
                        addressCity: itemStop.shipper.address.city,
                        addressShortState:
                            itemStop.shipper.address.stateShortName,
                    };
                }
            });
            this.stopsDataPickup = datas[0];
            this.stopsDataDelivery = datas[1];
        });
    }
    public getReviews(reviewsData: BrokerResponse) {
        this.reviewsRepair = reviewsData.reviews.map((item) => {
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

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dotsData = {
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
                    iconName: 'view-details',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    iconName: 'share',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    iconName: 'print',
                    show: true,
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
                    iconName: 'delete',
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }
    public changeReviewsEvent(reviews: ReviewComment) {
        switch (reviews.action) {
            case 'delete': {
                this.deleteReview(reviews);
                break;
            }
            case 'add': {
                //this.addReview(reviews);
                break;
            }
            case 'update': {
                this.updateReview(reviews);
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateReview(reviews: ReviewComment) {
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
    }

    private deleteReview(reviews: ReviewComment) {
        this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
}
