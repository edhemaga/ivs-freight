import {
    Component,
    Input,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Models
import {
    ShipperContactGroupResponse,
    ShipperResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';
import { ReviewComment } from '@shared/models/review-comment.model';
import { DepartmentContacts } from '@shared/models/department-contacts.model';

// Decorators
import { Titles } from '@core/decorators/titles.decorator';

// Services
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

@Titles()
@Component({
    selector: 'app-shipper-details-item',
    templateUrl: './shipper-details-item.component.html',
    styleUrls: ['./shipper-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ShipperDetailsItemComponent implements OnChanges {
    @Input() shipper: ShipperResponse;
    public shipperContacts: ShipperContactGroupResponse[];
    public shipperLikes: number;
    public shipperDislike: number;
    public reviewsRepair: any = []; //leave this any, it's not going into this spring
    public departmentContacts: DepartmentContacts[];
    private destroy$ = new Subject<void>();

    constructor(private reviewRatingService: ReviewsRatingService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shipper?.currentValue != changes.shipper?.previousValue) {
            this.shipper = changes.shipper.currentValue;

            this.shipperContacts =
                changes.shipper.currentValue[0].data.shipperContacts;
            this.shipperLikes = changes.shipper.currentValue[0].data.upCount;
            this.shipperDislike =
                changes.shipper.currentValue[0].data.downCount;

            this.orderContacts();
            this.getReviews(changes.shipper.currentValue[0].data);
        }
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getReviews(reviewsData: ShipperResponse) {
        this.reviewsRepair = reviewsData.ratingReviews.map((item) => {
            return {
                ...item,
                companyUser: {
                    ...item.companyUser,
                    avatar: item.companyUser.avatar
                        ? item.companyUser.avatar
                        : 'assets/svg/common/ic_profile.svg',
                },
                commentContent: item.comment,
                rating: item.thumb, // - item.ratingFromTheReviewer doesn't exist in response
            };
        });
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

    private orderContacts(): void {
        this.departmentContacts = [];
        this.shipperContacts.forEach((contact) => {
            const departmentName = contact.department.name;

            let department = this.departmentContacts.find(
                (dep) => dep.name === departmentName
            );

            if (!department) {
                department = { name: departmentName, contacts: [] };
                this.departmentContacts.push(department);
            }

            department.contacts.push(contact);
        });
    }
}
