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
import { ShopDetailsQuery } from '../state/shop-details-state/shop-details.query';
import { Subject, take, takeUntil } from 'rxjs';
import { SumArraysPipe } from '../../../pipes/sum-arrays.pipe';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { ShopDetailsListQuery } from '../state/shop-details-state/shop-details-list-state/shop-details-list.query';

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
  constructor(
    private act_route: ActivatedRoute,
    private detailsPageDriverService: DetailsPageService,
    private shopService: RepairTService,
    private router: Router,
    private tableService: TruckassistTableService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private shopDetailsQuery: ShopDetailsQuery,
    private sumArr: SumArraysPipe,
    private sdlq: ShopDetailsListQuery
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.shopConf(this.act_route.snapshot.data.shop);
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.shopConf(res.data);
          this.cdRef.detectChanges();
        }
      });

    this.detailsPageDriverService.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        let query;
        if (this.sdlq.hasEntity(id)) {
          query = this.sdlq.selectEntity(id).pipe(take(1));
        } else {
          query = this.shopService.getRepairShopById(id);
        }

        query.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: RepairShopResponse) => {
            this.shopConf(res);
            if (this.router.url.includes('shop-details')) {
              this.router.navigate([`/repair/${res.id}/shop-details`]);
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
        // {
        //   title: 'Send Message',
        //   name: 'dm',
        //   class: 'regular-text',
        //   contentType: 'dm',
        // },
        // {
        //   title: 'Print',
        //   name: 'print',
        //   class: 'regular-text',
        //   contentType: 'print',
        // },
        // {
        //   title: 'Deactivate',
        //   name: 'deactivate',
        //   class: 'regular-text',
        //   contentType: 'deactivate',
        // },
        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
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

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for header names and array of icons */
  shopConf(data: RepairShopResponse) {
    let total;
    if (data?.repairs?.length) {
      total = this.sumArr.transform(
        data.repairs.map((item) => {
          return {
            id: item.id,
            value: item.total,
          };
        })
      );
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
        length: data?.repairs?.length ? data.repairs.length : 0,
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
      },
      {
        id: 3,
        nameDefault: 'Review',
        template: 'review',
        length: data?.reviews?.length ? data.reviews.length : 0,
        customText: 'Date',
        hide: false,
        data: data,
      },
    ];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
