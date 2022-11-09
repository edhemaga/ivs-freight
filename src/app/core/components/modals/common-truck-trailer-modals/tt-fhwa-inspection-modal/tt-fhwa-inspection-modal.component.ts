import { FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { InspectionResponse } from 'appcoretruckassist';

import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../services/notification/notification.service';
import { FormService } from '../../../../services/form/form.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from '../../../../utils/methods.calculations';
import { UpdateInspectionCommand } from 'appcoretruckassist/model/updateInspectionCommand';
import { CreateInspectionCommand } from 'appcoretruckassist/model/createInspectionCommand';

@Component({
  selector: 'app-tt-fhwa-inspection-modal',
  templateUrl: './tt-fhwa-inspection-modal.component.html',
  styleUrls: ['./tt-fhwa-inspection-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class TtFhwaInspectionModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public fhwaInspectionForm: FormGroup;

  public documents: any[] = [];
  public fileModified: boolean = false;
  public filesForDelete: any[] = [];

  public isFormDirty: boolean;

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
      this.editInspectionById();
    }
  }

  private createForm() {
    this.fhwaInspectionForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      note: [null],
      files: [null],
    });

    this.formService.checkFormChange(this.fhwaInspectionForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
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
          if (this.isFormDirty) {
            this.updateInspection();
            this.modalService.setModalSpinner({ action: null, status: true });
          }
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
            files: res.files.length ? JSON.stringify(res.files) : null,
          });
          this.documents = res.files;
        },
        error: () => {},
      });
  }

  private updateInspection() {
    const { issueDate, ...form } = this.fhwaInspectionForm.value;
    const documents = this.documents.map((item) => {
      return item.realFile;
    });
    const newData: UpdateInspectionCommand = {
      ...form,
      issueDate: convertDateToBackend(issueDate),
      id: this.editData.file_id,
      files: documents ? documents : this.fhwaInspectionForm.value.files,
      filesForDeleteIds: this.filesForDelete,
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
    const documents = this.documents.map((item) => {
      return item.realFile;
    });
    const newData: CreateInspectionCommand = {
      ...form,
      issueDate: convertDateToBackend(issueDate),
      truckId: this.editData.modal === 'truck' ? this.editData.id : undefined,
      trailerId:
        this.editData.modal === 'trailer' ? this.editData.id : undefined,
      files: documents,
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
    switch (event.action) {
      case 'add': {
        this.fhwaInspectionForm.get('files').patchValue(JSON.stringify(event.files));
        break;
      }
      case 'delete': {
        this.fhwaInspectionForm
          .get('files')
          .patchValue(event.files.length ? JSON.stringify(event.files) : null);
        if (event.deleteId) {
          this.filesForDelete.push(event.deleteId);
        }

        this.fileModified = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
