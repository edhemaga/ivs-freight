import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { DriverResponse } from 'appcoretruckassist';
import moment from 'moment';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { DriverCdlModalComponent } from '../driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { card_component_animation } from '../../../shared/animations/card-component.animations';

@Component({
  selector: 'app-driver-details-item',
  templateUrl: './driver-details-item.component.html',
  styleUrls: ['./driver-details-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class DriverDetailsItemComponent
  implements OnInit, OnDestroy, OnChanges
{
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() driver: DriverResponse | any = null;
  public cdlNote: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();
  public toggler: boolean[] = [];
  public showMoreEmployment: boolean = false;
  public dataTest: any;
  public expDateCard: any;
  public dataCDl: any;
  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getExpireDate();
    if (!changes.driver.firstChange && changes.driver.currentValue) {
      this.driver = changes.driver.currentValue;
    }
  }
  
  ngOnInit(): void {
    this.initTableOptions();
    this.getExpireDate();
  }
 
  public setFutureYear(date:any){
             
      return moment(date).add(1,'years').format('MM/DD/YY')
  }
  public getExpireDate() {
    this.dataCDl = this.driver.data.cdls.map((ele) => {
      if (moment(ele.expDate).isBefore(moment())) {
        this.expDateCard = false;
      } else {
        this.expDateCard = true;
      }
     return{
      ...ele,
      showButton:this.expDateCard
     }
    
     
    });
    console.log(this.dataCDl);
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
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Renew',
          name: 'renew',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Activate',
          reverseTitle: 'Deactivate',
          name: 'activate-item',
          class: 'regular-text',
          contentType: 'activate',
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

  public optionsEvent(any: any, action: string) {
    switch (action) {
      case 'edit-licence': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      case 'edit-drug': {
        this.modalService.openModal(
          DriverDrugAlcoholModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      case 'edit-medical': {
        this.modalService.openModal(
          DriverMedicalModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      case 'edit-mvr': {
        this.modalService.openModal(
          DriverMvrModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driver.id,
            type: action,
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  public onButtonAction(data: { template: string; action: string }) {
    switch (data.template) {
      case 'cdl': {
        if (data.action === 'attachments') {
          // TODO: attachments
        } else if (data.action === 'notes') {
          // TODO: notes
        } else {
          // TODO: dots
        }
        break;
      }
    }
  }

  public onShowDetails(componentData: any) {
    componentData.showDetails = !componentData.showDetails;
  }
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  /**Function for toggle page in cards */
  public toggleResizePage(value: number) {
    this.toggler[value] = !this.toggler[value];
  }
  public onFileAction(action: string) {
    switch (action) {
      case 'download': {
        this.downloadFile(
          'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
          'truckassist0'
        );
        break;
      }
      default: {
        break;
      }
    }
  }
  public downloadFile(url: string, filename: string) {
    fetch(url).then((t) => {
      return t.blob().then((b) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.setAttribute('download', filename);
        a.click();
      });
    });
  }

  ngOnDestroy(): void {}
}
