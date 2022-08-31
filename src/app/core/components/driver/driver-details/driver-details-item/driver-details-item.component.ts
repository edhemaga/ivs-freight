import { DriverTService } from './../../state/driver.service';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { dropActionNameDriver } from '../../../../utils/function-drop.details-page';
import {
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
import { CdlTService } from '../../state/cdl.service';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { MedicalTService } from '../../state/medical.service';
import { MvrTService } from '../../state/mvr.service';
import { TestTService } from '../../state/test.service';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() drivers: DriverResponse | any = null;
  public cdlNote: FormControl = new FormControl();
  public mvrNote: FormControl = new FormControl();
  public toggler: boolean[] = [];
  public showMoreEmployment: boolean = false;
  public dataDropDown: any;
  public expDateCard: any;
  public dataCDl: any;
  public templateName: boolean;
  public hasActiveCdl: boolean;
  public arrayOfActiveCdl: any[] = [];
  public dropActionName: string = '';
  public inactiveCdl: boolean;
  public test: boolean;
  public dataCdl: any;
  public dataMvr: any;
  public dataMedical: any;
  public dataTest: any;
  constructor(
    private modalService: ModalService,
    private driverService: DriverTService,
    private cdlService: CdlTService,
    private medicalService: MedicalTService,
    private mvrService: MvrTService,
    private testService: TestTService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private tableService: TruckassistTableService
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

    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'cdl') {
                this.deleteCdlByIdFunction(res.id);
              } else if (res.template === 'medical') {
                this.deleteMedicalByIdFunction(res.id);
              } else if (res.template === 'mvr') {
                this.deleteMvrByIdFunction(res.id);
              } else if (res.template === 'test') {
                this.deleteTestByIdFunction(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
  }
  public getExpireDate() {
    this.dataCDl = this.drivers[1]?.data?.cdls?.map((ele) => {
      let endDate = moment(ele.expDate);

      if (
        moment(ele.expDate).isBefore(moment()) ||
        endDate.diff(moment(), 'years') <= 1
      ) {
        this.expDateCard = false;
      } else {
        this.expDateCard = true;
      }
      if (ele.status == 0) {
        this.inactiveCdl = true;
      } else {
        this.inactiveCdl = false;
      }

      return {
        ...ele,
        showButton: this.expDateCard,
        inactiveCdl: this.inactiveCdl,
      };
    });
  }
  public activateDeactiveCdl(id: number) {
    this.driverService.activateDeactiveCdl(id);
  }
  public getNameForDrop(name: string) {
    switch (name) {
      case 'cdl':
        this.templateName = false;
        this.initTableOptions();
        this.getExpireDate();
        break;
      case 'test':
        this.templateName = true;
        this.initTableOptions();
        break;
      case 'medical':
        this.templateName = true;
        this.initTableOptions();
        break;
      case 'mvr':
        this.templateName = true;
        this.initTableOptions();
        break;
    }
  }
  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dataDropDown = {
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
          show: true,
        },
        {
          title: 'Renew',
          name: 'renew',
          svg: 'assets/svg/common/ic_reload_renew.svg',
          show: !this.templateName ? true : false,
        },
        {
          title: 'Void',
          name: 'activate-item',
          svg: 'assets/svg/common/ic_cancel_violation.svg',
          show: !this.templateName ? true : false,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }

  public getCdlById(id: number) {
    this.cdlService
      .getCdlById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.dataCdl = item));
  }

  public getMedicalById(id: number) {
    this.medicalService
      .getMedicalById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.dataMedical = item));
  }

  public getMvrById(id: number) {
    this.mvrService
      .getMvrById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.dataMvr = item));
  }

  public getTestById(id: number) {
    this.testService
      .getTestById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.dataTest = item));
  }
  public optionsEvent(any: any, action: string) {
    const name = dropActionNameDriver(any, action);
    switch (name) {
      case 'delete-cdl': {
        const mappedEvent = {
          ...any,
          data: {
            ...this.dataCdl,
            state: this.dataCdl.state.stateShortName,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'cdl',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-medical': {
        const mappedEvent = {
          ...any,
          data: {
            medicalIssued: this.dataMedical.issueDate,
            medicalExpDate: this.dataMedical.expDate,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'medical',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-mvr': {
        const mappedEvent = {
          ...any,
          data: {
            ...this.dataMvr,
            mvrIssueDate: this.dataMvr.issueDate,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'mvr',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-test': {
        const mappedEvent = {
          ...any,
          data: {
            testTypeName: this.dataTest.testType.name,
            reasonName: this.dataTest.testReason.name,
            issuedDataTest: this.dataTest.testingDate,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'test',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'edit-licence': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: this.drivers[0].data.id,
            type: name,
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
            type: name,
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
            type: name,
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
            type: name,
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

  public deleteCdlByIdFunction(id: number) {
    this.cdlService
      .deleteCdlById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Cdl successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Cdl with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }

  private deleteMedicalByIdFunction(id: number) {
    this.medicalService
      .deleteMedicalById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Medical successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Medical with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }

  private deleteMvrByIdFunction(id: number) {
    this.mvrService
      .deleteMvrById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Mvr successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Mvr with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }

  private deleteTestByIdFunction(id: number) {
    this.testService
      .deleteTestById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Test successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Test with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
