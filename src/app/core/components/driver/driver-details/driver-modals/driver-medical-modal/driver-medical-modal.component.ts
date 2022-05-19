import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverResponse } from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { MedicalModalService } from './medical-modal.service';
@Component({
  selector: 'app-driver-medical-modal',
  templateUrl: './driver-medical-modal.component.html',
  styleUrls: ['./driver-medical-modal.component.scss'],
})
export class DriverMedicalModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public medicalForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private medicalModalService: MedicalModalService,
    private inputService: TaInputService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.editData) {
      this.getDriverById(this.editData.id);
    }
  }

  private createForm() {
    this.medicalForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      expDate: [null, Validators.required],
      note: [null],
    });
  }

  private getDriverById(id: number) {
    this.medicalModalService
      .getDriverById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: DriverResponse) => {
          this.modalName = res.firstName.concat(' ', res.lastName);
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  public onFilesEvent(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {}
}
