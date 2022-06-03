import { AddressEntity } from './../../../../../../../../appcoretruckassist/model/addressEntity';
import { emailRegex } from './../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

@Component({
  selector: 'app-settings-factoring-modal',
  templateUrl: './settings-factoring-modal.component.html',
  styleUrls: ['./settings-factoring-modal.component.scss'],
})
export class SettingsFactoringModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public factoringForm: FormGroup;

  public selectedAddress: AddressEntity = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.factoringForm = this.formBuilder.group({
      companyName: [null, Validators.required],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
      address: [null],
      addressUnit: [null],
      noticeAssignment: [null],
      note: [null],
    });
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }) {
    this.selectedAddress = event;
  }

  public onModalAction(event) {}

  ngOnDestroy(): void {}
}
