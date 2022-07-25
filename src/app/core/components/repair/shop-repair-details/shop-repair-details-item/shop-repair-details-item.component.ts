import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-shop-repair-details-item',
  templateUrl: './shop-repair-details-item.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shop-repair-details-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopRepairDetailsItemComponent implements OnInit, OnChanges {
  @Input() shopData: RepairShopResponse | any = null;
  public dummyData: any;
  public reviewsRepair: any = [];
  public repairShopLikes: number;
  public repairShopDislike: number;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.shopData?.firstChange && changes?.shopData) {
      this.shopData = changes.shopData.currentValue;
      this.repairShopLikes = changes.shopData.currentValue.data.upRatingCount;
      this.repairShopDislike =
        changes.shopData.currentValue.data.downRatingCount;
      this.getReviews(changes.shopData.currentValue.data);
    }
  }
  ngOnInit(): void {
    this.initTableOptions();

    this.repairShopLikes = this.shopData.data.upRatingCount;
    this.repairShopDislike = this.shopData.data.downRatingCount;
    this.getReviews(this.shopData.data);
  }
  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dummyData = {
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
  public getReviews(reviewsData: RepairShopResponse) {
    this.reviewsRepair = reviewsData?.reviews.map((item) => {
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
  public changeReviewsEvent(reviews: { data: any[]; action: string }) {
    this.reviewsRepair = [...reviews.data];
    // TODO: API CREATE OR DELETE
  }
}
