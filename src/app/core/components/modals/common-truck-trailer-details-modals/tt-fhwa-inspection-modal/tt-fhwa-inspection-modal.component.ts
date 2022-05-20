import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-tt-fhwa-inspection-modal',
  templateUrl: './tt-fhwa-inspection-modal.component.html',
  styleUrls: ['./tt-fhwa-inspection-modal.component.scss'],
})
export class TtFhwaInspectionModalComponent implements OnInit {
  @Input() editData: any;

  public fhwaInspectionForm: FormGroup;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    console.log(this.editData)
  }

  private createForm() {
    this.fhwaInspectionForm = this.formBuilder.group({
      issueDate: [null],
      note: [null],
    });
  }

  public onModalAction(event: any) {

  }

  public onFilesEvent(event: any) {
    console.log(event);
  }
}
