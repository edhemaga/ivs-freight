import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { ShipperResponse, UpdateReviewCommand } from 'appcoretruckassist';
import { Titles } from 'src/app/core/utils/application.decorators';
import { ReviewCommentModal } from '../../../shared/ta-user-review/ta-user-review.component';
import { ReviewsRatingService } from '../../../../services/reviews-rating/reviewsRating.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';

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
    private destroy$ = new Subject<void>();
    constructor(private reviewRatingService: ReviewsRatingService,) {}
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
    public changeReviewsEvent(reviews: ReviewCommentModal) {
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

    private updateReview(reviews: ReviewCommentModal) {
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

    private deleteReview(reviews: ReviewCommentModal) {
        this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
}
