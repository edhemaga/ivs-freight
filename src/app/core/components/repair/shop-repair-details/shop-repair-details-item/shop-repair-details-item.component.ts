import { ActivatedRoute } from '@angular/router';
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
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { RepairOrderModalComponent } from '../../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairTService } from '../../state/repair.service';

@Component({
  selector: 'app-shop-repair-details-item',
  templateUrl: './shop-repair-details-item.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shop-repair-details-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [card_component_animation('showHideCardBody', '0px', '0px')],
})
export class ShopRepairDetailsItemComponent implements OnInit, OnChanges {
  @Input() shopData: RepairShopResponse | any = null;
  @Input() repairsData: any;
  public data;
  public dummyData: any;
  public reviewsRepair: any = [];
  public repairShopLikes: number;
  public repairShopDislike: number;
  public showRepairItems: boolean[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dropDownService: DropDownService,
    private modalService: ModalService,
    private confirmationService: ConfirmationService,
    private shopService: RepairTService,
    private act_route: ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.shopData?.currentValue != changes.shopData?.previousValue) {
      this.shopData = changes.shopData.currentValue;
      this.repairShopLikes = changes.shopData.currentValue.data.upRatingCount;
      this.repairShopDislike =
        changes.shopData.currentValue.data.downRatingCount;
      this.getReviews(changes.shopData.currentValue.data);
      changes?.repairsData?.currentValue?.map((item) => {
        this.showRepairItems[item.id] = false;
      });
    }
  }
  ngOnInit(): void {
    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              // if (res.template === 'repair') {
              //   this.deleteRepairByIdFunction(res.id);
              // }
              break;
            }
            default: {
              break;
            }
          }
        },
      });

    this.initTableOptions();
  }

  public deleteRepairByIdFunction(id: number) {
    this.shopService
      .deleteRepairById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  public toggleRepairs(index: number, event?: any) {
    event.stopPropagation();
    event.preventDefault();
    this.showRepairItems[index] = !this.showRepairItems[index];
  }
  public optionsEvent(any: any, action: string) {
    const name = dropActionNameDriver(any, action);
    setTimeout(() => {
      this.dropDownService.dropActions(
        any,
        name,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        any,
        null,
        null
      );
    }, 100);
  }

  public finishOrder(repairId: number, data: any, event?: any) {
    event.stopPropagation();
    event.preventDefault();
    this.modalService.openModal(
      RepairOrderModalComponent,
      { size: 'small' },
      {
        id: data.id,
        payload: data,
        file_id: repairId,
        type: 'edit',
        modal: 'repair',
      }
    );
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
    this.reviewsRepair = reviewsData?.reviews?.map((item) => {
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
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  public changeReviewsEvent(reviews: { data: any[]; action: string }) {
    this.reviewsRepair = [...reviews.data];
    // TODO: API CREATE OR DELETE
  }
}
