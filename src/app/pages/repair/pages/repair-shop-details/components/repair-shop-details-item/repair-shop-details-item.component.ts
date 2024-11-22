import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

// components
import { RepairShopDetailsCard } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/repair-shop-details-card.component';
import { RepairShopDetailsItemRepairComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repair/repair-shop-details-item-repair.component';
import { RepairShopDetailsItemRepairedVehicleComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repaired-vehicle/repair-shop-details-item-repaired-vehicle.component';

// models
import { RepairShopResponse, UpdateReviewCommand } from 'appcoretruckassist';
import { DetailsConfig } from '@shared/models/details-config.model';

@Component({
    selector: 'app-repair-shop-details-item',
    templateUrl: './repair-shop-details-item.component.html',
    styleUrls: ['./repair-shop-details-item.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        RepairShopDetailsCard,
        RepairShopDetailsItemRepairComponent,
        RepairShopDetailsItemRepairedVehicleComponent,
    ],
})
export class RepairShopDetailsItemComponent {
    private destroy$ = new Subject<void>();

    @Input() detailsConfig: DetailsConfig;

    /////////////////////////////////////////////
    @Input() customClass: string | any = '';

    public reviewsRepair: any = [];

    constructor(private reviewRatingService: ReviewsRatingService) {}

    public trackByIdentity(_: number, item: DetailsConfig): number {
        return item.id;
    }

    ///////////////////////////////////////////////////////

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
}
