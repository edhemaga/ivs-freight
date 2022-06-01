import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import moment from 'moment';

import { ActivatedRoute } from '@angular/router';
import { DriverShortResponse } from 'appcoretruckassist';
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
export class DriverDetailsItemComponent implements OnInit, OnDestroy {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() data: any = null;
  public cdlNote: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();
  public toggler: boolean[] = [];

  public arrayDrivers: any = [];
  public arrayDriverName: any = '';
  public currentDriverName: string = 'Milos Cirkovic';
  public driverId: number = 0;
  public showMoreEmployment: boolean = false;

  public dataTest: any;
<<<<<<< HEAD
  public driverData: DriverShortResponse;
=======
  public driverData: any;

>>>>>>> develop
  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.arrayDrivers = [
      {
        id: 434,
        name: 'Angela Martin',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 2,
        name: 'Angela Lomarion',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 3,
        name: 'Denis Rodmar',
        svg: null,
        folder: null,
      },
      {
        id: 4,
        name: 'Milos Cirkovic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 5,
        name: 'Aleksandar Djordjevic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 6,
        name: 'Mika Mikic',
        svg: null,
        folder: null,
      },
      {
        id: 7,
        name: 'Denis Rodmar',
        svg: null,
        folder: null,
      },
      {
        id: 8,
        name: 'Milos Cirkovic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 9,
        name: 'Aleksandar Djordjevic',
        svg: 'ic_owner-status.svg',
        folder: 'common',
      },
      {
        id: 10,
        name: 'Mika Mikic',
        svg: null,
        folder: null,
      },
    ];
  }

  ngOnInit(): void {
    this.initTableOptions();
    this.getDriversList();
    this.getDriverById();
  }

  /**Function return driver by id */
  public getDriverById() {
    this.driverData = this.activated_route.snapshot.data;
  }

  public getDriversList() {
    for (let i = 0; i < this.arrayDrivers.length; i++) {
      this.arrayDrivers[i];
    }
    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
    return this.arrayDrivers;
  }

  public nextDriver() {
    this.driverId < this.arrayDrivers.length - 1
      ? this.driverId++
      : (this.driverId = 0);

    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
  }

  public previousDriver() {
    this.driverId < 1
      ? (this.driverId = this.arrayDrivers.length)
      : this.driverId--;

    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
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
    console.log(any)
    console.log(this.driverData)
    switch (action) {
      case 'edit-licence': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.driverData.driver.id,
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
            id: this.driverData.driver.id,
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
            id: this.driverData.driver.id,
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
            id: this.driverData.driver.id,
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
