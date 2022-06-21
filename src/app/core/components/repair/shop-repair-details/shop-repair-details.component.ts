import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RepairShopResponse } from 'appcoretruckassist';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RepairTService } from '../state/repair.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
@Component({
  selector: 'app-shop-repair-details',
  templateUrl: './shop-repair-details.component.html',
  styleUrls: ['./shop-repair-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DetailsPageService],
})
export class ShopRepairDetailsComponent implements OnInit,OnDestroy {
  public shopRepairConfig:any[]=[]
  
  constructor(
    private act_route:ActivatedRoute,
    private detailsPageDriverService: DetailsPageService,
    private shopService:RepairTService,
    private router:Router,
    private notificationService:NotificationService,
    private cdRef:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.shopConf(this.act_route.snapshot.data.shop);  
    this.detailsPageDriverService.pageDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.shopService
          .getRepairShopById(id)
          .pipe(untilDestroyed(this))
          .subscribe({
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
              this.notificationService.error(
                "Shop can't be loaded",
                'Error:'
              );
            },
          });
      });  
  }
 
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for header names and array of icons */
  shopConf(data:RepairShopResponse | any){  
    this.shopRepairConfig = [
      {
        id: 0,
        nameDefault: 'Repair Shop Details',
        template: 'general',
        data:data
      },
      {
        id: 1,
        nameDefault: 'Repair',
        template: 'repair',
        icon:true,
        length:data.repairs.length,
        customText:'Date',
        icons:[
          {
          id:Math.random() * 1000,
          icon:'assets/svg/common/ic_clock.svg'
          },
          {
            id:Math.random() * 1000,
            icon:'assets/svg/common/ic_rubber.svg'
            },
            {
              id:Math.random() * 1000,
              icon:'assets/svg/common/ic_documents.svg'
              },
              {
                id:Math.random() * 1000,
                icon:'assets/svg/common/ic_sraf.svg'
                },
                {
                  id:Math.random() * 1000,
                  icon:'assets/svg/common/ic_funnel.svg'
                  },
                  {
                    id:Math.random() * 1000,
                    icon:'assets/svg/common/ic_dollar.svg'
                    },
                
      ],
       data:data
      },
      {
        id: 2,
        nameDefault: 'Repaired Vehicle',
        template: 'repaired-vehicle',
        length:data.repairsByUnit.length,
        hide:true,
        customText:'Repairs',
        data:data
      },
      {
        id: 3,
        nameDefault: 'Review',
        template: 'review',
        length:data.reviews.length,
        customText:'Date',
        hide:false,
        data:data
      },
    ];
  }
  ngOnDestroy(): void {
   
  }
}
