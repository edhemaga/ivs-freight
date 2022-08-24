import { TrailerResponse } from './../../../../../../../appcoretruckassist/model/trailerResponse';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TtRegistrationModalComponent } from '../../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { TtTitleModalComponent } from '../../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { CommonTruckTrailerService } from '../../../modals/common-truck-trailer-modals/common-truck-trailer.service';
@UntilDestroy()
@Component({
  selector: 'app-trailer-details-item',
  templateUrl: './trailer-details-item.component.html',
  styleUrls: ['./trailer-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [card_component_animation('showHideCardBody')],
})
export class TrailerDetailsItemComponent implements OnInit, OnDestroy {
  @Input() trailer: TrailerResponse | any = null;
  public note: FormControl = new FormControl();
  public registrationNote: FormControl = new FormControl();
  public fhwaNote: FormControl = new FormControl();
  public titleNote: FormControl = new FormControl();
  public trailerData: any;
  public svgColorVar: string;
  public dropActionName: string = '';
  public trailerName: string;
  public dataTest: any;
  public toggler: boolean[] = [];
  constructor(
    private tableService: TruckassistTableService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private commonTrailerService: CommonTruckTrailerService
  ) {}

  ngOnInit(): void {
    this.note?.patchValue(this.trailer[0]?.data?.note);
    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(untilDestroyed(this))
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
  /**Function for toggle page in cards */
  public toggleResizePage(value: number, indexName: string) {
    this.toggler[value + indexName] = !this.toggler[value + indexName];
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
          show: true,
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
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
    return item.id;
  }
  public optionsEvent(file: any, data: any, action: string) {
    if (file.type === 'edit' && action === 'registration') {
      this.dropActionName = 'edit-registration';
    } else if (file.type === 'delete-item' && action === 'registration') {
      this.dropActionName = 'delete-registration';
    }
    if (file.type === 'edit' && action === 'inspection') {
      this.dropActionName = 'edit-inspection';
    } else if (file.type === 'delete-item' && action === 'inspection') {
      this.dropActionName = 'delete-inspection';
    }

    if (file.type === 'edit' && action === 'title') {
      this.dropActionName = 'edit-title';
    } else if (file.type === 'delete-item' && action === 'title') {
      this.dropActionName = 'delete-title';
    }
    switch (this.dropActionName) {
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
            type: this.dropActionName,
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
            type: this.dropActionName,
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
            type: this.dropActionName,
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
    this.commonTrailerService
      .deleteRegistrationById(id)
      .pipe(untilDestroyed(this))
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
    this.commonTrailerService
      .deleteInspectionById(id)
      .pipe(untilDestroyed(this))
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
    this.commonTrailerService
      .deleteTitleById(id)
      .pipe(untilDestroyed(this))
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
  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
  }
}
