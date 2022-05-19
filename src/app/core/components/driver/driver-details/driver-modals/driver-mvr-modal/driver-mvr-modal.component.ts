import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { MvrModalService } from './mvr-modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DriverResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-driver-mvr-modal',
  templateUrl: './driver-mvr-modal.component.html',
  styleUrls: ['./driver-mvr-modal.component.scss'],
})
export class DriverMvrModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public mvrForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private mvrModalService: MvrModalService,
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
    this.mvrForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      note: [null],
    });
  }

  private getDriverById(id: number) {
    this.mvrModalService
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
