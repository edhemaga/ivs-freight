import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { ShipperResponse } from 'appcoretruckassist';
import { Titles } from 'src/app/core/utils/application.decorators';

@Titles()
@Component({
    selector: 'app-shipper-details-single',
    templateUrl: './shipper-details-single.component.html',
    styleUrls: ['./shipper-details-single.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ShipperDetailsSingleComponent implements OnInit, OnChanges {
    @Input() shipper: any = null;
    public shipperContacts: any;
    public shipperLikes: number;
    public shipperDislike: number;
    public reviewsRepair: any = [];
    constructor() {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shipper?.currentValue != changes.shipper?.previousValue) {
            this.shipper = changes.shipper.currentValue;

            this.shipperContacts =
                changes.shipper.currentValue[0].data.shipperContacts;
            this.shipperLikes =
                changes.shipper.currentValue[0].data.upCount;
            this.shipperDislike =
                changes.shipper.currentValue[0].data.downCount;
        
            this.getReviews(changes.shipper.currentValue[0].data);
        }
    }
    ngOnInit(): void {}

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getReviews(reviewsData: ShipperResponse) {
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
    public changeReviewsEvent() {
        // TODO: API CREATE OR DELETE
    }
}
