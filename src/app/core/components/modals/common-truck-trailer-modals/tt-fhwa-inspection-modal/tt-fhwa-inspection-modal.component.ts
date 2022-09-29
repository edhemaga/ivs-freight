import { FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import {
  CreateInspectionCommand,
  InspectionResponse,
  UpdateInspectionCommand,
} from 'appcoretruckassist';

import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../services/notification/notification.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from '../../../../utils/methods.calculations';

@Component({
  selector: 'app-tt-fhwa-inspection-modal',
  templateUrl: './tt-fhwa-inspection-modal.component.html',
  styleUrls: ['./tt-fhwa-inspection-modal.component.scss'],
  providers: [ModalService],
})
export class TtFhwaInspectionModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public fhwaInspectionForm: FormGroup;

  public documents: any[] = [];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private commonTruckTrailerService: CommonTruckTrailerService,
    private inputService: TaInputService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData.type === 'edit-inspection') {
      this.editInspectionById();
    }
  }

  private createForm() {
    this.fhwaInspectionForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
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

  private editInspectionById() {
    this.commonTruckTrailerService
      .getInspectionById(this.editData.file_id)
      .pipe(takeUntil(this.destroy$))
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
    const { issueDate, ...form } = this.fhwaInspectionForm.value;
    const newData: UpdateInspectionCommand = {
      ...form,
      issueDate: convertDateToBackend(issueDate),
      id: this.editData.file_id,
    };

    this.commonTruckTrailerService
      .updateInspection(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Inspection successfully updated.',
            'Success:'
          );
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
    const { issueDate, ...form } = this.fhwaInspectionForm.value;
    const newData: CreateInspectionCommand = {
      ...form,
      issueDate: convertDateToBackend(issueDate),
      truckId: this.editData.modal === 'truck' ? this.editData.id : null,
      trailerId: this.editData.modal === 'trailer' ? this.editData.id : null,
    };
    this.commonTruckTrailerService
      .addInspection(newData, this.editData.tabSelected)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Inspection successfully added.',
            'Success:'
          );
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
