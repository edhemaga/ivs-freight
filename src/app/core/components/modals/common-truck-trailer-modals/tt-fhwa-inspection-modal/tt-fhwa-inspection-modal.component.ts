import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import {
  CreateInspectionCommand,
  InspectionResponse,
  UpdateInspectionCommand,
} from 'appcoretruckassist';
import moment from 'moment';

@Component({
  selector: 'app-tt-fhwa-inspection-modal',
  templateUrl: './tt-fhwa-inspection-modal.component.html',
  styleUrls: ['./tt-fhwa-inspection-modal.component.scss']
})
export class TtFhwaInspectionModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public fhwaInspectionForm: FormGroup;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private commonTruckTrailerService: CommonTruckTrailerService,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.createForm();
    console.log(this.editData);

    if (this.editData.type === 'edit-inspection') {
      this.getInspectionById();
    }
  }

  private createForm() {
    this.fhwaInspectionForm = this.formBuilder.group({
      issueDate: [null],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.fhwaInspectionForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        // If Form not valid
        if (this.fhwaInspectionForm.invalid) {
          this.inputService.markInvalid(this.fhwaInspectionForm);
          return;
        }
        if (this.editData.type === 'edit-inspection') {
          this.updateInspection();
        }
        else {
          this.addInspection();
        }
        
      }

      this.ngbActiveModal.close();
    }
  }

  private getInspectionById() {
    this.commonTruckTrailerService
      .getInspectionById(this.editData.file_id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: InspectionResponse) => {
          this.fhwaInspectionForm.patchValue({
            issueDate: moment(new Date(res.issueDate)).format('YYYY-MM-DD'),
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
      issueDate: new Date(issueDate).toISOString(),
      id: this.editData.file_id,
    };
    console.log(this.editData.file_id)
    this.commonTruckTrailerService
      .updateInspection(newData)
      .pipe(untilDestroyed(this))
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
    const { issueDate } = this.fhwaInspectionForm.value;
    const newData: CreateInspectionCommand = {
      ...this.fhwaInspectionForm.value,
      issueDate: new Date(issueDate).toISOString(),
      truckId: this.editData.modal === 'truck' ? this.editData.id : null,
      trailerId: this.editData.modal === 'trailer' ? this.editData.id : null,
    };
    this.commonTruckTrailerService
      .addInspection(newData)
      .pipe(untilDestroyed(this))
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
    console.log(event);
  }

  ngOnDestroy(): void {}
}
