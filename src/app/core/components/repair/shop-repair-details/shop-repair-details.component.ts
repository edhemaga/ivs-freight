import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RepairShopResponse } from 'appcoretruckassist';
import { RepairTService } from '../state/repair.service';
import { Subject, take, takeUntil } from 'rxjs';
import { SumArraysPipe } from '../../../pipes/sum-arrays.pipe';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { ShopDetailsListQuery } from '../state/shop-details-state/shop-details-list-state/shop-details-list.query';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { RepairShopMinimalListStore } from '../state/shop-details-state/shop-minimal-list-state/shop-minimal.store';
import { RepairShopMinimalListQuery } from '../state/shop-details-state/shop-minimal-list-state/shop-minimal.query';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { RepairDQuery } from '../state/details-state/repair-d.query';

@Component({
  selector: 'app-shop-repair-details',
  templateUrl: './shop-repair-details.component.html',
  styleUrls: ['./shop-repair-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DetailsPageService, SumArraysPipe],
})
export class ShopRepairDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public shopRepairConfig: any[] = [];
  public repairDrop: any;
  public repairShopId: number;
  public repairList: any = this.shopDetailsMinimalQuery.getAll();
  public currentIndex: number = 0;
  public repairObject: any;
  public togglerWorkTime: boolean;
  public repairsDataCmp: any;
  constructor(
    private act_route: ActivatedRoute,
    private detailsPageDriverService: DetailsPageService,
    private shopService: RepairTService,
    private router: Router,
    private tableService: TruckassistTableService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private shopDetailsMinimalQuery: RepairShopMinimalListQuery,
    private sumArr: SumArraysPipe,
    private DetailsDataService: DetailsDataService,
    private sdlq: ShopDetailsListQuery,
    private dropDownService: DropDownService,
    private rsmlist: RepairShopMinimalListStore,
    private repairDQuery: RepairDQuery
  ) {}

  ngOnInit(): void {
    // this.currentIndex = this.repairList.findIndex(
    //   (shop) => shop.id === this.act_route.snapshot.data.shop.id
    // );
    this.repairDQuery.repairShop$.subscribe((data: RepairShopResponse[]) => {
      const repairShop = data.find(
        (item) => item.id === +this.act_route.snapshot.params['id']
      );
      console.log('finded repar shop: ', repairShop);
      this.shopConf(repairShop);
    });
    // (this.act_route.snapshot.data.shop.id)
    // this.shopQ.shopDetails$.subscribe((data) =>
    //   console.log('shop - component: ', data)
    // );
    // this.repairsQ.repairDetails$.subscribe((data) =>
    //   console.log('repair - component ', data)
    // );
    this.initTableOptions();

    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation === 'update' && res.tab === 'repair-shop') {
          this.shopConf(res.data);

          this.cdRef.detectChanges();
        }
      });
    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'repair-shop') {
                this.deleteRepairShopById(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });

    this.detailsPageDriverService.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id: number) => {
        // let query;
        // if (this.sdlq.hasEntity(id)) {
        //   query = this.sdlq.selectEntity(id).pipe(take(1));
        // } else {
        //   query = this.shopService.getRepairShopById(id);
        // }

        this.repairDQuery.repairShop$.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: RepairShopResponse[]) => {
            console.log('shop repair list: ', res);
            console.log('shop repair id: ', id);
            const repairShop = res.find((item) => item.id === id);
            console.log('shop repair details: ', repairShop);
            this.shopConf(repairShop);
            if (this.router.url.includes('shop-details')) {
              this.router.navigate([`/repair/${repairShop.id}/shop-details`]);
            }
            this.notificationService.success(
              'Shop successfully changed',
              'Success:'
            );
            this.cdRef.detectChanges();
          },
          error: () => {
            this.notificationService.error("Shop can't be loaded", 'Error:');
          },
        });
      });
  }

  public initTableOptions() {
    this.repairDrop = {
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
          title: 'Print',
          name: 'print',
          svg: 'assets/svg/common/ic_fax.svg',
          show: true,
        },

        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },
        {
          title: 'Add to favourites',
          name: 'add-favourites',
          svg: 'assets/svg/common/ic_star.svg',
          activate: true,
          show: true,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }
  public dropActionRepair(event: any) {
    this.dropDownService.dropActionsHeaderRepair(
      event,
      this.repairObject,
      event.id
    );
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  public deleteRepairShopById(id: number) {
    let last = this.repairList.at(-1);
    if (last.id === this.rsmlist.getValue().ids[this.currentIndex]) {
      this.currentIndex = --this.currentIndex;
    } else {
      this.currentIndex = ++this.currentIndex;
    }
    this.shopService
      .deleteRepairShopByIdDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.rsmlist.getValue().ids.length >= 1) {
            this.router.navigate([
              `/repair/${this.repairList[this.currentIndex].id}/shop-details`,
            ]);
          }
          this.notificationService.success(
            'Repair Shop successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.router.navigate(['/repair']);
        },
      });
  }
  public getRepairById(id: number) {
    this.shopService
      .getRepairShopById(id, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.repairObject = item));
  }
  /**Function for header names and array of icons */
  shopConf(data: RepairShopResponse) {
    // this.getRepairById(data.id);
    console.log('shop conf: ', data);
    let total;
    this.DetailsDataService.setNewData(data);
    /* if (data?.repairs?.length) {
      total = this.sumArr.transform(
        data.repairs.map((item) => {
          return {
            id: item.id,
            value: item.total,
          };
        })
      );
    } */
    if (data?.openHoursToday === 'Closed') {
      this.togglerWorkTime = false;
    } else {
      this.togglerWorkTime = true;
    }

    this.shopRepairConfig = [
      {
        id: 0,
        nameDefault: 'Repair Shop Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        nameDefault: 'Repair',
        template: 'repair',
        icon: true,
        repairOpen: data?.openHoursToday === 'Closed' ? false : true,
        length: 2,
        customText: 'Date',
        total: total,
        icons: [
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_clock.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_rubber.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_documents.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_sraf.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_funnel.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_dollar.svg',
          },
        ],
        data: data,
      },
      {
        id: 2,
        nameDefault: 'Repaired Vehicle',
        template: 'repaired-vehicle',
        length: data?.repairsByUnit?.length ? data.repairsByUnit.length : 0,
        hide: true,
        customText: 'Repairs',
        data: data,
        repairOpen: data?.openHoursToday === 'Closed' ? false : true,
      },
      {
        id: 3,
        nameDefault: 'Review',
        template: 'review',
        length: data?.reviews?.length ? data.reviews.length : 0,
        customText: 'Date',
        hide: false,
        data: data,
        repairOpen: data?.openHoursToday === 'Closed' ? false : true,
      },
    ];
    this.repairShopId = data?.id ? data.id : null;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
