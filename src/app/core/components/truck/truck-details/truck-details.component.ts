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
  public dataTest:any;
  registrationLength:number;
  inspectionLength:number;
  titleLength:number;
  public data:any;
  constructor(
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.data=this.activated_route.snapshot.data;
    this.registrationLength=this.data.truck.registrations.length;
    this.inspectionLength=this.data.truck.inspections.length;
    this.titleLength=this.data.truck.titles.length;
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
        data:this.registrationLength
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
        data:this.inspectionLength
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
        data:this.titleLength
     
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
  
  public initTableOptions(): void {
    this.dataTest = {
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
          class: 'regular-text',
          contentType: 'dm',
        },
        {
          title: 'Print',
          name: 'print',
          class: 'regular-text',
          contentType: 'print',
        },
        {
          title: 'Deactivate',
          name: 'deactivate',
          class: 'regular-text',
          contentType: 'deactivate',
        },
        {
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
