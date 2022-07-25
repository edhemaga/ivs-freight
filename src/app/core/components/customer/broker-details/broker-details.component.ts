import { BrokerDetailsQuery } from './../state/broker-details-state/broker-details.query';
import { BrokerResponse } from 'appcoretruckassist';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BrokerTService } from '../state/broker-state/broker.service';
import { SumArraysPipe } from 'src/app/core/pipes/sum-arrays.pipe';
@Component({
  selector: 'app-broker-details',
  templateUrl: './broker-details.component.html',
  styleUrls: ['./broker-details.component.scss'],
  providers: [DetailsPageService, SumArraysPipe],
})
export class BrokerDetailsComponent implements OnInit, OnDestroy {
  public brokerConfig: any[] = [];
  public brokerDrop: any;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private brokerQuery: BrokerDetailsQuery,
    private brokerService: BrokerTService,
    private detailsPageService: DetailsPageService,
    private sumArr: SumArraysPipe
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.detailsPageService.pageDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        let query;
        if (this.brokerQuery.hasEntity(id)) {
          query = this.brokerQuery.selectEntity(id);
        } else {
          query = this.brokerService.getBrokerById(id);
        }
        query.pipe(untilDestroyed(this)).subscribe({
          next: (res: BrokerResponse) => {
            this.brokerInitConfig(res);
            this.router.navigate([`/customer/${res.id}/broker-details`]);
            this.notificationService.success(
              'Broker successfully changed',
              'Success:'
            );
          },
          error: () => {
            this.notificationService.error("Broker can't be loaded", 'Error:');
          },
        });
      });
    this.brokerInitConfig(this.activated_route.snapshot.data.broker);
  }

  public brokerInitConfig(data: BrokerResponse) {
    let totalCost;
    if (data.loads.length) {
      totalCost = this.sumArr.transform(
        data.loads.map((item) => {
          return {
            id: item.id,
            value: item.totalRate,
          };
        })
      );
    }

    this.brokerConfig = [
      {
        id: 0,
        nameDefault: 'Broker Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        nameDefault: 'Load',
        template: 'load',
        icon: true,
        hasArrowDown: true,
        length: data?.loads?.length ? data.loads.length : 0,
        hasCost: true,
        hide: false,
        hasArrow: true,
        customText: 'Revenue',
        total: totalCost,
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
            icon: 'assets/svg/common/ic_broker-user.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_broker-half-circle.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/truckassist-table/location-icon.svg',
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
        nameDefault: 'Contact',
        template: 'contact',
        length: data?.brokerContacts?.length ? data.brokerContacts.length : 0,
        hide: false,
        icon: true,
        hasCost: false,
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
        hasCost: false,
        hide: false,
        data: data,
        hasArrow: false,
      },
    ];
  }

  /**Function for dots in cards */
  public initTableOptions(): void {
    this.brokerDrop = {
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
  ngOnDestroy(): void {}
}
