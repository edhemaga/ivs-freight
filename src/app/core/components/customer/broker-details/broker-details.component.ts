import { BrokerDetailsQuery } from './../state/broker-details-state/broker-details.query';
import { BrokerResponse } from 'appcoretruckassist';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BrokerTService } from '../state/broker-state/broker.service';
@Component({
  selector: 'app-broker-details',
  templateUrl: './broker-details.component.html',
  styleUrls: ['./broker-details.component.scss'],
  providers: [DetailsPageService],
})
export class BrokerDetailsComponent implements OnInit, OnDestroy {
  public brokerConfig: any[] = [];
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private brokerQuery: BrokerDetailsQuery,
    private brokerService: BrokerTService,
    private detailsPageService: DetailsPageService
  ) {}

  ngOnInit(): void {
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
            this.cdRef.detectChanges();
          },
          error: () => {
            this.notificationService.error("Broker can't be loaded", 'Error:');
          },
        });
      });
    this.brokerInitConfig(this.activated_route.snapshot.data.broker);
  }

  public brokerInitConfig(data: BrokerResponse | any) {
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
        length: 25,
        hasCost: true,
        hide: false,
        hasArrow: false,
        customText: 'Revenue',
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
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  ngOnDestroy(): void {}
}
