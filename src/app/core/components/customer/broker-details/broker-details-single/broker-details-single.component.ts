import { BrokerResponse } from 'appcoretruckassist';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { ReviewCommentModal } from '../../../shared/ta-user-review/ta-user-review.component';

@Component({
    selector: 'app-broker-details-single',
    templateUrl: './broker-details-single.component.html',
    styleUrls: ['./broker-details-single.component.scss'],
})
export class BrokerDetailsSingleComponent implements OnInit, OnChanges {
    @Input() brokerData: BrokerResponse | any;
    public brokerContacts: any;
    public brokerLikes: number;
    public brokerDislike: number;
    public reviewsRepair: any = [];
    public dotsData: any;
    public stopsDataPickup: any;
    public stopsDataDelivery: any;
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.brokerData?.currentValue !=
            changes.brokerData?.previousValue
        ) {
            this.brokerContacts =
                changes.brokerData.currentValue[0].data.brokerContacts;
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
        data.loads.map((item) => {
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
                },

                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash.svg',
                    danger: true,
                    show: true,
                },
            ],
            export: true,
        };
    }
    public changeReviewsEvent(reviews: ReviewCommentModal) {
        // switch (reviews.action) {
        //   case 'delete': {
        //     this.deleteReview(reviews);
        //     break;
        //   }
        //   case 'add': {
        //     this.addReview(reviews);
        //     break;
        //   }
        //   case 'update': {
        //     this.updateReview(reviews);
        //     break;
        //   }
        //   default: {
        //     break;
        //   }
        // }
    }
}
