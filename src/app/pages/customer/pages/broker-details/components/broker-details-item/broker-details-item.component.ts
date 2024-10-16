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
import {
    BrokerContactResponse,
    BrokerResponse,
    LoadBrokerDetailsResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';
import { DepartmentContacts } from '@shared/models/department-contacts.model';
import { BrokerRatingReview } from '@pages/customer/pages/broker-details/models/';
import { BrokerLoadStop } from '@pages/customer/pages/broker-details/models/';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Svg routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/';

// Constants
import { BrokerLoadDropdownActionsConstants } from '@pages/customer/pages/broker-details/utils/constants/';

@Titles()
@Component({
    selector: 'app-broker-details-item',
    templateUrl: './broker-details-item.component.html',
    styleUrls: ['./broker-details-item.component.scss'],
})
export class BrokerDetailsItemComponent implements OnInit, OnChanges {
    @Input() brokerData: BrokerResponse;
    @Input() brokerLoads: LoadBrokerDetailsResponse[] = [];

    private destroy$ = new Subject<void>();

    public brokerContacts: BrokerContactResponse[];
    public brokerLikes: number;
    public brokerDislike: number;
    public reviewsRepair: BrokerRatingReview[] = [];
    public loadActions: DropdownItem[];
    public stopsDataPickup: BrokerLoadStop[];
    public stopsDataDelivery: BrokerLoadStop[];
    public departmentContacts: DepartmentContacts[];

    // Svg routes
    public brokerDetailsSvgRoutes = BrokerDetailsSvgRoutes;

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

            this.orderContacts();
        }
    }
    ngOnInit(): void {
        this.initTableOptions();
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getStops(data: BrokerResponse | any): void {
        data?.loadStops?.loads?.data?.map((item) => {
            let pickup = item.pickup
                ? {
                      date: item.pickup.dateFrom,
                      stopOrder: 1,
                      addressCity: item.pickup.shipper.address.city,
                      addressShortState:
                          item.pickup.shipper.address.stateShortName,
                  }
                : null;
            let delivery = item.delivery
                ? {
                      date: item.delivery.dateFrom,
                      stopOrder: 1,
                      addressCity: item.delivery.shipper.address.city,
                      addressShortState:
                          item.delivery.shipper.address.stateShortName,
                  }
                : null;

            this.stopsDataPickup = pickup ? [pickup] : [];
            this.stopsDataDelivery = delivery ? [delivery] : [];
        });
    }

    public getReviews(reviewsData: BrokerResponse): void {
        this.reviewsRepair = reviewsData.ratingReviews.map((item) => {
            return {
                ...item,
                companyUser: {
                    ...item.companyUser,
                    avatar: /* item.companyUser.avatar
                        ? item.companyUser.avatar
                        : */ BrokerDetailsSvgRoutes.profileIcon,
                },
                commentContent: item.comment,
                rating: item.thumb,
                id: item.reviewId ? item.reviewId : item.ratingId,
                prohibitEditingOthers: !item.isItCurrentCompanyUser,
            };
        });
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.loadActions =
            BrokerLoadDropdownActionsConstants.loadDropdownActions;
    }

    public changeReviewsEvent(reviews: ReviewComment): void {
        switch (reviews.action) {
            case TableStringEnum.DELETE:
                this.deleteReview(reviews);
                break;

            case TableStringEnum.UPDATE:
                this.updateReview(reviews);
                break;

            default:
                break;
        }
    }

    private updateReview(reviews: ReviewComment): void {
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

    private deleteReview(reviews: ReviewComment): void {
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
        this.brokerContacts.forEach((contact) => {
            const departmentName = contact.department.name;

            let department = this.departmentContacts.find(
                (dep) => dep.name === departmentName
            );

            if (!department) {
                department = { name: departmentName, contacts: [] };
                this.departmentContacts.push(department);
            }

            const contactData = {
                ...contact,
                fullName: contact.contactName,
                phoneExt: contact.extensionPhone,
            };

            department.contacts.push(contactData);
        });
    }
}
