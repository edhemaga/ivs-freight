import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ShipperResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-shipper-details-single',
  templateUrl: './shipper-details-single.component.html',
  styleUrls: ['./shipper-details-single.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShipperDetailsSingleComponent implements OnInit, OnChanges {
  @Input() shipper: ShipperResponse | any = null;
  public shipperContacts: any;
  public shipperLikes: number;
  public shipperDislike: number;
  public reviewsRepair: any = [];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.shipper.firstChange && changes.shipper.currentValue) {
      this.shipper = changes.shipper.currentValue;

      this.shipperContacts =
        changes.shipper.currentValue[0].data.shipperContacts;
      this.shipperLikes = changes.shipper.currentValue[0].data.upRatingCount;
      this.shipperDislike =
        changes.shipper.currentValue[0].data.downRatingCount;
      this.getReviews(changes.shipper.currentValue[0].data);
    }
  }
  ngOnInit(): void {
    this.shipperLikes = this.shipper[0].data.upRatingCount;
    this.shipperDislike = this.shipper[0].data.downRatingCount;
    this.shipperContacts = this.shipper[0].data.shipperContacts;
    this.getReviews(this.shipper[0].data);
  }

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
