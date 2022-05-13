import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TruckQuery } from './../state/truck.query';
import { Subject, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { TruckInterface } from '../state/truck.modal';
import { TruckTService } from '../state/truck.service';

@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss'],
})
export class TruckDetailsComponent implements OnInit {
  // @Input() data:any=null;
  public truckDetailsConfig: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private truckQuery: TruckQuery,
    private truckTService:TruckTService,
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.truckDetailsConfig = [
      {
        id: 0,
        name: 'Truck Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
   
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
     
      },
      {
        id: 4,
        name: 'Lease / Purchase',
        template: 'lease-purchase',
       
      },
    ];
  }
  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
