import { BrokerResponse } from 'appcoretruckassist';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrokerTService } from '../state/broker-state/broker.service';
import { Subject, takeUntil, take } from 'rxjs';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { SumArraysPipe } from '../../../pipes/sum-arrays.pipe';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { BrokerMinimalListQuery } from '../state/broker-details-state/broker-minimal-list-state/broker-minimal.query';
import { BrokerMinimalListStore } from '../state/broker-details-state/broker-minimal-list-state/broker-minimal.store';
import { BrokerDetailsListQuery } from '../state/broker-details-state/broker-details-list-state/broker-details-list.query';

@Component({
  selector: 'app-broker-details',
  templateUrl: './broker-details.component.html',
  styleUrls: ['./broker-details.component.scss'],
  providers: [DetailsPageService, SumArraysPipe],
})
export class BrokerDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public brokerId: number;
  public brokerConfig: any[] = [];
  public brokerDrop: any;
  public brokerObject: any;
  public currentIndex: number = 0;
  public brokerList: any = this.brokerMimialQuery.getAll();
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private brokerMimialQuery: BrokerMinimalListQuery,
    private brokerService: BrokerTService,
    private detailsPageService: DetailsPageService,
    private sumArr: SumArraysPipe,
    private cdRef: ChangeDetectorRef,
    private dropDownService: DropDownService,
    private tableService: TruckassistTableService,
    private confirmationService: ConfirmationService,
    private brokerMinimalStore: BrokerMinimalListStore,
    private bdlq: BrokerDetailsListQuery,
    private DetailsDataService: DetailsDataService
  ) {}

  ngOnInit(): void {
    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'broker') {
                this.deleteBrokerById(res.id);
              }
              break;
            }
            case 'info': {
              if (res.template === 'broker' && res.subType === 'ban list') {
                this.moveRemoveBrokerToBan(res.id);
              }
              if (res.template === 'broker' && res.subType === 'dnu') {
                this.moveRemoveBrokerToDnu(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.brokerInitConfig(res.data);
          this.cdRef.detectChanges();
        }
      });
    this.detailsPageService.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        let query;
        if (this.bdlq.hasEntity(id)) {
          query = this.bdlq.selectEntity(id).pipe(take(1));
        } else {
          query = this.brokerService.getBrokerById(id);
        }

        query.pipe(takeUntil(this.destroy$)).subscribe({
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

  public deleteBrokerById(id: number) {
    let last = this.brokerList.at(-1);
    if (last.id === this.brokerMinimalStore.getValue().ids[this.currentIndex]) {
      this.currentIndex = --this.currentIndex;
    } else {
      this.currentIndex = ++this.currentIndex;
    }
    this.brokerService
      .deleteBrokerByIdDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.brokerMinimalStore.getValue().ids.length >= 1) {
            this.router.navigate([
              `/customer/${
                this.brokerList[this.currentIndex].id
              }/broker-details`,
            ]);
          }
          this.notificationService.success(
            'Broker successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.router.navigate(['/customer']);
        },
      });
  }

  public brokerInitConfig(data: BrokerResponse) {
    this.currentIndex = this.brokerList.findIndex(
      (broker) => broker.id === data.id
    );
    this.initTableOptions(data);
    this.getBrokerById(data.id);
    let totalCost;
    this.DetailsDataService.setNewData(data);
    if (data.loads.length) {
      totalCost = this.sumArr.transform(
        data?.loads.map((item) => {
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
            name: 'clock',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_search.svg',
            name: 'search',
          },

          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_broker-user.svg',
            name: 'broker-user',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_broker-half-circle.svg',
            name: 'half-circle',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/truckassist-table/location-icon.svg',
            name: 'location',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_dollar.svg',
            name: 'dolar',
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
    this.brokerId = data?.id ? data.id : null;
  }
  public getBrokerById(id: number) {
    this.brokerService
      .getBrokerById(id, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.brokerObject = item));
  }
  /**Function for dots in cards */
  public initTableOptions(data: BrokerResponse): void {
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
        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },
        {
          title: 'border'
        },
        {
          title: 'Create Load',
          name: 'create-load',
          svg: 'assets/svg/common/ic_plus.svg',
          show: true,
          blueIcon: true,
        },
        {
          title: 'Add Contact',
          name: 'add-contact',
          svg: 'assets/svg/truckassist-table/customer/contact-column-avatar.svg',
          show: true,
        },
        {
          title: 'Write Review',
          name: 'write-review',
          svg: 'assets/svg/common/review-pen.svg',
          show: true,
        },
        {
          title: data?.ban ? 'Remove from Ban List' : 'Move to Ban list',
          name: data?.ban ? 'remove-from-ban' : 'move-to-ban',
          svg: 'assets/svg/common/ic_disable-status.svg',
          show: true,
        },
        {
          title: data?.dnu ? 'Remove from DNU' : 'Move to DNU List',
          name: data?.dnu ? 'remove-from-dnu' : 'move-to-dnu',
          svg: 'assets/svg/common/ic_disable-status.svg',
          deactivate: true,
          show: true,
          redIcon: true,
        },
        {
          title: 'border'
        },
        {
          title: 'Share',
          name: 'share',
          svg: 'assets/svg/common/share-icon.svg',
          show: true,
        },
        {
          title: 'Print',
          name: 'print',
          svg: 'assets/svg/common/ic_fax.svg',
          show: true,
        },
        {
          title: 'border'
        },
        {
          title: 'Close Business',
          name: 'close-business',
          svg: 'assets/svg/common/close-business-icon.svg',
          redIcon: true,
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
          redIcon: true,
        },
        /*
        {
          title: 'Send Message',
          name: 'dm',
          svg: 'assets/svg/common/ic_dm.svg',
          show: true,
        },
        */
      ],
      export: true,
    };
  }
  public moveRemoveBrokerToBan(id: number) {
    this.brokerService
      .changeBanStatus(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Broker successfully change status`,
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `You can not move broker whit id: ${id}, to ban list`,
            'Error:'
          );
        },
      });
  }
  public moveRemoveBrokerToDnu(id: number) {
    this.brokerService
      .changeDnuStatus(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Broker successfully change status`,
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `You can not move broker whit id: ${id}, to ban list`,
            'Error:'
          );
        },
      });
  }
  public onDropActions(event: any) {
    this.dropDownService.dropActionsHeaderShipperBroker(
      event,
      this.brokerObject,
      'broker'
    );
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
