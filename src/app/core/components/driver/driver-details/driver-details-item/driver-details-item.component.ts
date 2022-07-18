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
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class DriverDetailsItemComponent
  implements OnInit, OnDestroy, OnChanges
{
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() drivers: DriverResponse | any = null;
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
    if (!changes.drivers.firstChange && changes.drivers.currentValue) {
      this.drivers = changes.drivers.currentValue;
      this.getExpireDate();
    }
  }

  ngOnInit(): void {
    this.initTableOptions();
    this.getExpireDate();
  }
  public getExpireDate() {
    this.dataCDl = this.drivers[1]?.data?.cdls?.map((ele) => {
      if (moment(ele.expDate).isBefore(moment())) {
        this.expDateCard = false;
      } else {
        this.expDateCard = true;
      }
      return {
        ...ele,
        showButton: this.expDateCard,
      };
    });
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
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
        },
        {
          title: 'Renew',
          name: 'renew',
          svg: 'assets/svg/common/ic_plus.svg',
        },
        {
          title: 'Activate',
          reverseTitle: 'Deactivate',
          name: 'activate-item',
          svg: 'assets/svg/common/ic_deactivate.svg',
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash.svg',
          danger: true,
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
            id: this.drivers[0].data.id,
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
            id: this.drivers[0].data.id,
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
            id: this.drivers[0].data.id,
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
            id: this.drivers[0].data.id,
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
    return index;
  }

  /**Function for toggle page in cards */
  public toggleResizePage(value: number, indexName: string) {
    this.toggler[value + indexName] = !this.toggler[value + indexName];
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
