import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-repair-details',
  templateUrl: './shop-repair-details.component.html',
  styleUrls: ['./shop-repair-details.component.scss']
})
export class ShopRepairDetailsComponent implements OnInit {
  public data:any;
  public shopRepairConfig:any[]=[]
  
  constructor(
    private _act_route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.data=this._act_route.snapshot.data;
    this.shopConf();    
  }
 
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for header names and array of icons */
  shopConf(){
    this.shopRepairConfig = [
      {
        id: 0,
        name: 'Repair Shop Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'Repair',
        template: 'repair',
        icon:true,
        data:25,
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
                
      ]
      },
      {
        id: 2,
        name: 'Repaired Vehicle',
        template: 'repaired-vehicle',
        data:18,
        hide:true,
        customText:'Repairs'
      },
      {
        id: 3,
        name: 'Review',
        template: 'review',
        data:9,
        customText:'Date'
      },
    ];
  }

}
