import { DriverMvrModalComponent } from './driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from './driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from './driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverCdlModalComponent } from './driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { ModalService } from './../../shared/ta-modal/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { DriversQuery } from '../state/driver.query';
import { DriverTService } from '../state/driver.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  public driverDetailsConfig: any[] = [];
  dataTest: any;
  cdlLength:number;
  mvrLength:number;
  testLength:number;
  medicalLength:number;
  public data:any;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private driversQuery: DriversQuery,
    private activated_route: ActivatedRoute,
    private driverTService: DriverTService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initTableOptions();
    this.data=this.activated_route.snapshot.data;
    this.cdlLength=this.data.driver.cdls.length
    this.mvrLength=this.data.driver.mvrs.length
    this.medicalLength=this.data.driver.medicals.length
    this.testLength=this.data.driver.tests.length
    
    this.detailCongif();
    
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
  detailCongif() {
    this.driverDetailsConfig = [
      {
        id: 0,
        name: 'Driver Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'CDL',
        template: 'cdl',
        data:this.cdlLength
      },
      {
        id: 2,
        name: 'Drug & Alcohol',
        template: 'drug-alcohol',
        data:this.testLength
      },
      {
        id: 3,
        name: 'Medical',
        template: 'medical',
        data:this.medicalLength
      },
      {
        id: 4,
        name: 'MVR',
        template: 'mvr',
        data:this.mvrLength
        }
    ];
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

  public onModalAction(action: string): void {
    const driver_id=this.activated_route.snapshot.paramMap.get('id');
    if(action.includes('Drug')) {
      action = 'DrugAlcohol'
    }
    console.log(action)
    switch (action) {
      case 'CDL': {
        this.modalService.openModal(DriverCdlModalComponent, {size: 'small'}, {id: driver_id, type: 'new-licence'})
        break;
      }
      case 'DrugAlcohol': {
        this.modalService.openModal(DriverDrugAlcoholModalComponent, {size: 'small'}, {id: driver_id, type: 'new-drug'})
        break;
      }
      case 'Medical': {
        this.modalService.openModal(DriverMedicalModalComponent, {size: 'small'}, {id: driver_id, type: 'new-medical'})
        break;
      }
      case 'MVR': {
        this.modalService.openModal(DriverMvrModalComponent, {size: 'small'}, {id: driver_id, type: 'new-mvr'})
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
