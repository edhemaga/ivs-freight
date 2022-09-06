import { FormControl } from '@angular/forms';
import { dropActionNameTrailerTruck } from '../../../../utils/function-drop.details-page';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TtRegistrationModalComponent } from '../../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TruckResponse } from 'appcoretruckassist';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { TtTitleModalComponent } from '../../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';

import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { CommonTruckTrailerService } from '../../../modals/common-truck-trailer-modals/common-truck-trailer.service';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-truck-details-item',
  templateUrl: './truck-details-item.component.html',
  styleUrls: ['./truck-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TruckDetailsItemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @Input() truck: TruckResponse | any = null;
  public note: FormControl = new FormControl();
  public fhwaNote: FormControl = new FormControl();
  public purchaseNote: FormControl = new FormControl();
  public registrationNote: FormControl = new FormControl();
  public titleNote: FormControl = new FormControl();
  public toggler: boolean[] = [];
  public cardNumberFake = '125335533513';
  truckName: string = '';
  isAccountVisible: boolean = true;
  accountText: string = null;
  public truckData: any;
  public dataEdit: any;
  public dropActionName: string = '';
  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private commonTruckService: CommonTruckTrailerService
  ) {}

  ngOnInit(): void {
    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'registration') {
                this.deleteRegistrationByIdFunction(res.id);
              } else if (res.template === 'inspection') {
                this.deleteInspectionByIdFunction(res.id);
              } else if (res.template === 'title') {
                this.deleteTitleByIdFunction(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    this.initTableOptions();
  }

  public onShowDetails(componentData: any) {
    componentData.showDetails = !componentData.showDetails;
  }

  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dataEdit = {
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

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return index;
  }

  /**Function for toggle page in cards */
  public toggleResizePage(value: number, indexName: string) {
    this.toggler[value + indexName] = !this.toggler[value + indexName];
  }

  public optionsEvent(file: any, data: any, action: string) {
    const name = dropActionNameTrailerTruck(file, action);
    switch (name) {
      case 'delete-inspection': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            id: file.id,
            template: 'inspection',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-registration': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            id: file.id,
            template: 'registration',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-title': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            id: file.id,
            template: 'title',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'edit-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: file.id,
            type: name,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'edit-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: file.id,
            type: name,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'edit-title': {
        this.modalService.openModal(
          TtTitleModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: file.id,
            type: name,
            modal: 'trailer',
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }
  private deleteRegistrationByIdFunction(id: number) {
    this.commonTruckService
      .deleteRegistrationById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Registration successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Registration with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }

  private deleteInspectionByIdFunction(id: number) {
    this.commonTruckService
      .deleteInspectionById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Inspection successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Inspection with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }
  private deleteTitleByIdFunction(id: number) {
    this.commonTruckService
      .deleteTitleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Title successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Title with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
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

  public hiddenPassword(value: any, numberOfCharacterToHide: number) {
    const lastFourCharaters = value.substring(
      value.length - numberOfCharacterToHide
    );
    let hiddenCharacter = '';

    for (let i = 0; i < numberOfCharacterToHide; i++) {
      hiddenCharacter += '*';
    }
    return hiddenCharacter + lastFourCharaters;
  }

  public showHideValue(value: string) {
    this.isAccountVisible = !this.isAccountVisible;
    if (!this.isAccountVisible) {
      this.accountText = this.hiddenPassword(value, 4);
      return;
    }
    this.accountText = value;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
