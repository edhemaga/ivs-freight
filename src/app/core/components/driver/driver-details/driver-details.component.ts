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
import moment from 'moment';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  public driverDetailsConfig: any[] = [];
  public dataTest: any;
  public cdlLength: number = 0;
  public mvrLength: number = 0;
  public testLength: number = 0;
  public medicalLength: number = 0;
  public statusDriver: boolean;
  public data: any;
  public hasDangerCDL: boolean;
  public hasDangerMedical:boolean;
  public hasDangerTest:boolean;
  public hasDangerMvr:boolean;

  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.initTableOptions();
    this.data = this.activated_route.snapshot.data.driver;
    this.cdlLength = this.data?.cdls.length;
    this.mvrLength = this.data?.mvrs.length;
    this.medicalLength = this.data?.medicals.length;
    this.testLength = this.data?.tests.length;
    if (this.data.status == 0) {
      this.statusDriver = true;
    } else {
      this.statusDriver = false;
    }
    this.getDanger();
    this.detailCongif();
  }

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  /**Function template and names for header and other options in header */
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
        data: this.cdlLength,
        req: false,
        status: this.statusDriver,
        hasDangerC:this.hasDangerCDL
      },
      {
        id: 2,
        name: 'Drug & Alcohol',
        template: 'drug-alcohol',
        data: this.testLength,
        req: true,
        status: this.statusDriver,
        hasDangerC:this.hasDangerTest
      },
      {
        id: 3,
        name: 'Medical',
        template: 'medical',
        data: this.medicalLength,
        req: false,
        status: this.statusDriver,
        hasDangerC:this.hasDangerMedical
      },
      {
        id: 4,
        name: 'MVR',
        template: 'mvr',
        data: this.mvrLength,
        req: true,
        status: this.statusDriver,
        hasDangerC:this.hasDangerMvr
      },
    ];
  }
  /**Function for dots in cards */
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
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Deactivate',
          name: 'deactivate',
          class: 'regular-text',
          contentType: 'deactivate',
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
    const driver_id = this.activated_route.snapshot.paramMap.get('id');
    if (action.includes('Drug')) {
      action = 'DrugAlcohol';
    }
    switch (action) {
      case 'CDL': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          { id: driver_id, type: 'new-licence' }
        );
        break;
      }
      case 'DrugAlcohol': {
        this.modalService.openModal(
          DriverDrugAlcoholModalComponent,
          { size: 'small' },
          { id: driver_id, type: 'new-drug' }
        );
        break;
      }
      case 'Medical': {
        this.modalService.openModal(
          DriverMedicalModalComponent,
          { size: 'small' },
          { id: driver_id, type: 'new-medical' }
        );
        break;
      }
      case 'MVR': {
        this.modalService.openModal(
          DriverMvrModalComponent,
          { size: 'small' },
          { id: driver_id, type: 'new-mvr' }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  public getDanger() {
    let arrCDl=[];
    let arrMedical=[];
    let arrTests=[];
    let arrMVR=[];
    this.data.cdls=this.data.cdls.map(
      (ele)=>{
        if(moment(ele.expDate).isBefore(moment()) || ele.dateDeactivated){
         this.hasDangerCDL=false;
        }else{
          this.hasDangerCDL=true;
        }
        arrCDl.push(this.hasDangerCDL)
        if(arrCDl.includes(true)){
          this.hasDangerCDL=false;
        }else{
          this.hasDangerCDL=true;
        }
        return {
          ...ele,
          showDanger:this.hasDangerCDL,
        };
    })
  
    
    this.data.medicals=this.data.medicals.map(
      (eleMed)=>{
        if(moment(eleMed.expDate).isBefore(moment())){
          this.hasDangerMedical=false;
        }else{
          this.hasDangerMedical=true;
        }
        arrMedical.push(this.hasDangerMedical)
        if(arrMedical.includes(true)){
          this.hasDangerMedical=false;
        }else{
         this.hasDangerMedical= true;
        }
        return {
          ...eleMed,
          showDanger:this.hasDangerMedical,
        };
    })
    this.data.tests=this.data.tests.map(
      (eleTest)=>{
        if(moment(eleTest.testingDate).isBefore(moment())){
          this.hasDangerTest=false;
        }else{
          this.hasDangerTest=true;
        }
        arrTests.push(this.hasDangerTest)
        if(arrTests.includes(true)){
          this.hasDangerTest=false;
        }else{
         this.hasDangerTest= true;
        }
        return {
          ...eleTest,
          showDanger:this.hasDangerTest,
        };
    })

    this.data.mvrs=this.data.mvrs.map(
      (eleMvr)=>{
        if(moment(eleMvr.issueDate).isBefore(moment())){
          this.hasDangerMvr=false;
        }else{
          this.hasDangerMvr=true;
        }
        arrMVR.push(this.hasDangerMvr)
        if(arrMVR.includes(true)){
          this.hasDangerMvr=false;
        }else{
         this.hasDangerMvr= true;
        }
        return {
          ...eleMvr,
          showDanger:this.hasDangerMvr,
        };
    })
    
  }
  ngOnDestroy(): void {}
}
