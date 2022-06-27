import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ShipperResponse } from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ShipperTService } from '../state/shipper-state/shipper.service';
@Component({
  selector: 'app-shipper-details',
  templateUrl: './shipper-details.component.html',
  styleUrls: ['./shipper-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[DetailsPageService]
})
export class ShipperDetailsComponent implements OnInit,OnDestroy {
  public shipperConfig: any[] = [];
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private shipperService:ShipperTService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private detailsPageService: DetailsPageService
  ) {}

  ngOnInit(): void {
   

    this.detailsPageService.pageDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.shipperService
          .getShipperById(id)
          .pipe(untilDestroyed(this))
          .subscribe({
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
        length: 25,
        hide: true,
        hasArrow:true,
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
        length: data?.shipperContacts?.length,
        hide: false,
        icon: true,
        hasArrow:false,
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
        length: 1,
        customText: 'Date',
        hide: false,
        data: data,
        hasArrow:false,
      },
    ];
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  ngOnDestroy(): void {
      
  }
}
