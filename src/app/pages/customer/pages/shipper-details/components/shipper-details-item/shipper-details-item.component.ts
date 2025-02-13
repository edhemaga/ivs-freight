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
    ShipperLoadStopsResponse,
    ShipperResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';
import { ReviewComment } from '@shared/models/review-comment.model';
import { DepartmentContacts } from '@shared/models/department-contacts.model';

// Decorators
import { Titles } from '@core/decorators/titles.decorator';

// Services
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

//Constants
import { ShipperDetailsItemSvgRoutes } from '@pages/customer/pages/shipper-details/components/shipper-details-item/utils/svg-routes';

// Enums
import { EGeneralActions } from '@shared/enums';

@Titles()
@Component({
    selector: 'app-shipper-details-item',
    templateUrl: './shipper-details-item.component.html',
    styleUrls: ['./shipper-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ShipperDetailsItemComponent implements OnChanges {
    @Input() shipper: ShipperResponse[];
    @Input() shipperLoads: ShipperLoadStopsResponse[];
    public shipperContacts: ShipperContactGroupResponse[];
    public shipperLikes: number;
    public shipperDislike: number;
    public reviewsRepair: any = [];
    public departmentContacts: DepartmentContacts[];

    //Images
    public shipperImageRoutes = ShipperDetailsItemSvgRoutes;

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

    public getReviews(reviewsData: ShipperResponse): void {
        this.reviewsRepair = reviewsData.ratingReviews.map((item) => {
            return {
                ...item,
                companyUser: {
                    ...item.companyUser,
                    avatar: 'assets/svg/common/ic_profile.svg',
                },
                commentContent: item.comment,
                rating: item.thumb,
            };
        });
    }
    public changeReviewsEvent(reviews: ReviewComment): void {
        switch (reviews.action) {
            case EGeneralActions.DELETE:
                this.deleteReview(reviews);
                break;
            case EGeneralActions.UPDATE:
                this.updateReview(reviews);
                break;
            default:
                break;
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
            .subscribe();
    }

    private deleteReview(reviews: ReviewComment) {
        this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
