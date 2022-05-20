import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-tt-registration-modal',
  templateUrl: './tt-registration-modal.component.html',
  styleUrls: ['./tt-registration-modal.component.scss'],
})
export class TtRegistrationModalComponent implements OnInit {
  @Input() editData: any;

  public registrationForm: FormGroup;

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
    this.registrationForm = this.formBuilder.group({
      issueDate: [null],
      expDate: [null],
      licensePlate: [null],
      note: [null],
    });
  }

  public onModalAction(event: any) {

  }

  public onFilesEvent(event: any) {
    console.log(event);
  }
}
