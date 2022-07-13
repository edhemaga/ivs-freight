import { BrokerResponse } from 'appcoretruckassist';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

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
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.brokerData?.firstChange && changes?.brokerData) {
      this.brokerContacts =
        changes.brokerData.currentValue[0].data.brokerContacts;
      this.brokerLikes = changes.brokerData.currentValue[0].data.upRatingCount;
      this.brokerDislike =
        changes.brokerData.currentValue[0].data.downRatingCount;
      this.getReviews(changes.brokerData.currentValue[0].data);
    }
  }
  ngOnInit(): void {
    this.brokerLikes = this.brokerData[0].data.upRatingCount;
    this.brokerDislike = this.brokerData[0].data.downRatingCount;
    this.brokerContacts = this.brokerData[0].data.brokerContacts;
    this.getReviews(this.brokerData[0].data);
  }

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
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
  public changeReviewsEvent(reviews: BrokerResponse) {
    // this.reviewsRepair = this.brokerData[0].data.reviews.map((item) => {
    //   return {
    //     ...item,
    //     companyUser: {
    //       ...item.companyUser,
    //       avatar: item.companyUser.avatar
    //         ? item.companyUser.avatar
    //         : 'assets/svg/common/ic_profile.svg',
    //     },
    //     commentContent: item.comment,
    //     rating: item.ratingFromTheReviewer,
    //   };
    // });
    //TODO: add edit and update
  }
}
