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
import { Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { driver_details_animation } from '../driver-details.animation';

import { DriversQuery } from '../../state/driver.query';
import { ActivatedRoute } from '@angular/router';
import { DriverTService } from '../../state/driver.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-driver-details-item',
  templateUrl: './driver-details-item.component.html',
  styleUrls: ['./driver-details-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [driver_details_animation('showHideDetails')],
})
export class DriverDetailsItemComponent implements OnInit, OnDestroy {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() data: any = null;
  public cdlNote: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();
  public toggler: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  public arrayDrivers: any = [];
  public arrayDriverName: any = '';
  public currentDriverName: string = 'Milos Cirkovic';
  public driverId: number = 0;
  public showMoreEmployment: boolean = false;

  public dataTest: any;
  public driverData: any;
  constructor(
    private activated_route: ActivatedRoute,
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
    console.log(this.data);
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
    console.log(this.driverId);
    this.arrayDriverName =
      this.arrayDrivers[Object.keys(this.arrayDrivers)[this.driverId]];
    console.log(this.arrayDrivers.length);
  }

  public previousDriver() {
    this.driverId < 1
      ? (this.driverId = this.arrayDrivers.length)
      : this.driverId--;
    console.log(this.driverId);
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
  
  public optionsEv(any:any,action:string){
    const option={id:any.id, type:action}
    console.log(option);
  }
  public onModalAction() {
    // const data = {
    //   type: 'new',
    //   vehicle: 'truck',
    // };
    // switch (this.data.template) {
    //   case 'cdl': {
    //     this.customModalService.openModal(
    //       DriverCdlModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   case 'drugAlcohol': {
    //     this.customModalService.openModal(
    //       DriverDrugAlcoholModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   case 'medical': {
    //     this.customModalService.openModal(
    //       DriverMedicalModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   case 'mvr': {
    //     this.customModalService.openModal(
    //       DriverMvrModalComponent,
    //       { data },
    //       null,
    //       { size: 'small' }
    //     );
    //     break;
    //   }
    //   default: {
    //     break;
    //   }
    // }
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
  /**Function format date */
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
  /**Function format phone number */
  public formatPhone(phoneNumberString: string) {
    const value = phoneNumberString;
    const number = value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    phoneNumberString = number;
    return number;
  }

  public formatHistoryDays(workDate: string) {
    const dateB = moment(workDate);
    const dateC = moment().format();
    const year = dateB.diff(dateC, 'year');
    const days = dateB.diff(dateC, 'days');
    console.log(year);
  }

  public formatText(data: any, type: boolean, numOfCharacters: string) {
    if (!type) {
      return data.map((item) =>
        item.endorsementName?.substring(0, numOfCharacters)
      );
    }
    return data.map(
      (item) =>
        `<span class='first-character'>${item.endorsementName?.substring(
          0,
          numOfCharacters
        )}</span>` + item.endorsementName.substring(numOfCharacters)
    );
  }
  
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  
   /**Function for toggle page in cards */
  public toggleResizePage(value: boolean) {
    this.toggler = value;
    console.log(this.toggler);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
