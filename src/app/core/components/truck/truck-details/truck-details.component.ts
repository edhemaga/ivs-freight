import { TruckInterface } from './../state/truck.modal';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TruckQuery } from './../state/truck.query';
import { Subject, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss']
})
export class TruckDetailsComponent implements OnInit {

  public truckDetailsConfig:any[]=[];
  private destroy$:Subject<void>=new Subject<void>();

  constructor(
    private truckQuery:TruckQuery,
    private activated_route:ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activated_route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let truck_id = params.get('id');
          return of(
            this.truckQuery
              .getAll()
              .find((driver) => driver.id === parseInt(truck_id))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        console.log('response ', res);
        this.setDetailsConfig(res);
      });
  }
  
  private setDetailsConfig(response:TruckInterface){
    // const registrationData =response.registrationData.map((data)=>{
    //   return{
    //     ...data,
    //     showDetails:false,
    //   };
    // });

    // const fhwaData= response.fhwaData.map((data)=>{
    //   return{
    //     ...data,
    //     showDetails:false,
    //   }
    // })

    // const titleData=response.titleData.map((data)=>{
    //   return{
    //     ...data,
    //     showDetails:false,
    //   }
    // });

    // const purchaseData=response.purchaseData.map((data)=>{
    //   return{
    //     ...data,
    //    showDetails:false,
    //   }
    // });
    this.truckDetailsConfig=[{
      id:0,
      template:'general',
      data:{
         response,
         assignedTo:{
           trailer:'12345',
           driver:'Angelo Trotter'
         },
         additionalDetails:{
           gross:'G-60,001 - 61,000',
           startMilage:'237,4563',
           emptyWei:'18,360',
           engineType:'Detroid Diesel 60 12.7L',
           axles:'3',
           tireSize:'295-74-225',
           ipass_ez:'13330000123453',
           ins_policy:'123B32894'
         },
         owner:{
           company:'KSKA FREIGHT, INC',
           commision:'10.0%'
         },
         performamceTrack:{
           mileage:'300,456.3',
           fuel_cost:'190,221.48'
         },
         fuelConsumption:{
           milesPerGalon:'5.75',
           costPerGalon:'3.85'
         },
         revenue:{
           miles:'150,257.7',
           revenue:'190,568.85'
         },
         ownerHistory:{
           company:{
             name:'IVS FREIGHT, INC',
             from:'04/04/04',
             to:'04/04/04',
             duration:'6 y 247 d',
             
           },
           company2:{
            name:'KSKA FREIGHT, INC',
            from:'04/04/04',
            to:'04/04/04',
            duration:'135 d'
          }
         },
         note:{
           noteText:'How to pursue pleasure rationally encounter consequences that are extremely painful.'
         }, 
      },
    },
    // {
    //   id:1,
    //   name:'Registration',
    //   template:'registration',
    //   data:[],
    // },
    // {
    //   id:2,
    //   name:'FHWA Inspection',
    //   template:'fhwa insepction',
    //   data:[],
    // },
    // {
    //   id:3,
    //   name:'Title',
    //   template:'title',
    //   data:[],
    // },
    // {
    //   id:4,
    //   name:'Lease/Purchase',
    //   template:'lease/purchase',
    //   data:[],
    // }
  ]
  }

  public identity(item:any):number{
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
