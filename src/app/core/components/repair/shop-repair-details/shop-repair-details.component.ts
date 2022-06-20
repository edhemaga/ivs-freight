import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-shop-repair-details',
  templateUrl: './shop-repair-details.component.html',
  styleUrls: ['./shop-repair-details.component.scss']
})
export class ShopRepairDetailsComponent implements OnInit {
  public data:any;
  public shopRepairConfig:any[]=[]
  
  constructor(
    private act_route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.shopConf(this.act_route.snapshot.data.shop);    
  }
 
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for header names and array of icons */
  shopConf(data:RepairShopResponse | any){
    console.log(data);
    
    this.shopRepairConfig = [
      {
        id: 0,
        name: 'Repair Shop Details',
        template: 'general',
        data:data
      },
      {
        id: 1,
        name: 'Repair',
        template: 'repair',
        icon:true,
        length:25,
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
        name: 'Repaired Vehicle',
        template: 'repaired-vehicle',
        length:data.repairsByUnit.length,
        hide:true,
        customText:'Repairs',
        data:data
      },
      {
        id: 3,
        name: 'Review',
        template: 'review',
        length:data.reviews.length,
        customText:'Date',
        hide:false,
        data:data
      },
    ];
  }

}
