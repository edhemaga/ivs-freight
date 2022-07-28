import { AddressEntity } from './../../../../../../../../appcoretruckassist/model/addressEntity';
import { emailRegex } from './../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-settings-factoring-modal',
  templateUrl: './settings-factoring-modal.component.html',
  styleUrls: ['./settings-factoring-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class SettingsFactoringModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public factoringForm: FormGroup;

  public selectedAddress: AddressEntity = null;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService
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

    // this.formService.checkFormChange(this.factoringForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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
