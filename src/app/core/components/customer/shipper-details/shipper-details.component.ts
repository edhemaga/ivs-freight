import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ShipperResponse } from 'appcoretruckassist';
import { ShipperTService } from '../state/shipper-state/shipper.service';
import { ShipperDetailsQuery } from '../state/shipper-state/shipper-details-state/shipper.details.query';
import { Subject, takeUntil } from 'rxjs';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-shipper-details',
  templateUrl: './shipper-details.component.html',
  styleUrls: ['./shipper-details.component.scss'],
  providers: [DetailsPageService],
})
export class ShipperDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public shipperConfig: any[] = [];
  public shipperDrop: any;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private shipperService: ShipperTService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private detailsPageService: DetailsPageService,
    private shipperQuery: ShipperDetailsQuery
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.detailsPageService.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        let query;
        if (this.shipperQuery.hasEntity(id)) {
          query = this.shipperQuery.selectEntity(id);
        } else {
          query = this.shipperService.getShipperById(id);
        }
        query.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: ShipperResponse) => {
            this.shipperConf(res);
            this.router.navigate([`/customer/${res.id}/shipper-details`]);
            this.notificationService.success(
              'Shipper successfully changed',
              'Success:'
            );
            this.cdRef.detectChanges();
          },
          error: () => {
            this.notificationService.error("Shipper can't be loaded", 'Error:');
          },
        });
      });
    this.shipperConf(this.activated_route.snapshot.data.shipper);
  }

  public shipperConf(data: ShipperResponse) {
    this.shipperConfig = [
      {
        id: 0,
        nameDefault: 'Shipper Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        nameDefault: 'Load',
        template: 'load',
        icon: true,
        length: data?.loadStops?.length ? data.loadStops.length : 0,
        hide: true,
        hasArrow: true,
        customText: 'Date',
        icons: [
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_clock.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_search.svg',
          },

          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_arrow-right-line.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_arrow-right-line.svg',
          },
        ],
        data: data,
      },
      {
        id: 2,
        nameDefault: 'Contact',
        template: 'contact',
        length: data?.shipperContacts?.length ? data.shipperContacts.length : 0,
        hide: false,
        icon: true,
        hasArrow: false,
        icons: [
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_search.svg',
          },
        ],
        customText: '',
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
        hasArrow: false,
      },
    ];
  }

  /**Function for dots in cards */
  public initTableOptions(): void {
    this.shipperDrop = {
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
          title: 'Send Message',
          name: 'dm',
          svg: 'assets/svg/common/ic_dm.svg',
          show: true,
        },
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
