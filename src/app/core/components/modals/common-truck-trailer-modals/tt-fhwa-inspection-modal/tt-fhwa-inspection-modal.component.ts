import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import {
  CreateInspectionCommand,
  InspectionResponse,
  UpdateInspectionCommand,
} from 'appcoretruckassist';
import moment from 'moment';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
  selector: 'app-tt-fhwa-inspection-modal',
  templateUrl: './tt-fhwa-inspection-modal.component.html',
  styleUrls: ['./tt-fhwa-inspection-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class TtFhwaInspectionModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public fhwaInspectionForm: FormGroup;

  public documents: any[] = [];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private commonTruckTrailerService: CommonTruckTrailerService,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData.type === 'edit-inspection') {
      this.getInspectionById();
    }
  }

  private createForm() {
    this.fhwaInspectionForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      note: [null],
    });

    // this.formService.checkFormChange(this.fhwaInspectionForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.fhwaInspectionForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.fhwaInspectionForm.invalid) {
          this.inputService.markInvalid(this.fhwaInspectionForm);
          return;
        }
        if (this.editData.type === 'edit-inspection') {
          this.updateInspection();
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addInspection();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
      }
    }
  }

  private getInspectionById() {
    this.commonTruckTrailerService
      .getInspectionById(this.editData.file_id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: InspectionResponse) => {
          this.fhwaInspectionForm.patchValue({
            issueDate: convertDateFromBackend(res.issueDate),
            note: res.note,
          });
        },
        error: () => {},
      });
  }

  private updateInspection() {
    const { issueDate } = this.fhwaInspectionForm.value;
    const newData: UpdateInspectionCommand = {
      ...this.fhwaInspectionForm.value,
      issueDate: convertDateToBackend(issueDate),
      id: this.editData.file_id,
    };

    this.commonTruckTrailerService
      .updateInspection(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Inspection successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Inspection can't be updated.",
            'Error:'
          );
        },
      });
  }

  private addInspection() {
    const { issueDate } = this.fhwaInspectionForm.value;
    const newData: CreateInspectionCommand = {
      ...this.fhwaInspectionForm.value,
      issueDate: convertDateToBackend(issueDate),
      truckId: this.editData.modal === 'truck' ? this.editData.id : null,
      trailerId: this.editData.modal === 'trailer' ? this.editData.id : null,
    };
    this.commonTruckTrailerService
      .addInspection(newData, this.editData.tabSelected)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Inspection successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Inspection can't be added.",
            'Error:'
          );
        },
      });
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  ngOnDestroy(): void {}
}
