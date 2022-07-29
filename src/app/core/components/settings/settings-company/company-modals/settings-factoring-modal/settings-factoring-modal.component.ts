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
import { SettingsStoreService } from '../../../state/settings.service';
import { UpdateFactoringCompanyCommand } from 'appcoretruckassist';

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
    private formService: FormService,
    private settingsService: SettingsStoreService
  ) {}

  ngOnInit(): void {
    console.log(this.editData);
    this.createForm();
  }

  private createForm() {
    this.factoringForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
      address: [null],
      addressUnit: [null],
      noticeOfAssigment: [null],
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

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.factoringForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.factoringForm.invalid) {
          this.inputService.markInvalid(this.factoringForm);
          return;
        }
        this.updateFactoringCompany(this.editData.id);
        this.modalService.setModalSpinner({ action: null, status: true });
        break;
      }
      case 'delete': {
        this.deleteFactoringCompanyById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });

        break;
      }
      default: {
        break;
      }
    }
  }

  private updateFactoringCompany(id: number) {
    const {
      name,
      phone,
      email,
      address,
      addressUnit,
      noticeOfAssigment,
      note,
    } = this.factoringForm.value;

    const newData: UpdateFactoringCompanyCommand = {
      companyId: id,
      factoringCompany: {
        name: name,
        phone: phone,
        email: email,
        address: {
          ...this.selectedAddress,
          addressUnit: addressUnit,
        },
        noticeOfAssigment: noticeOfAssigment,
        note: note,
      },
    };

    this.settingsService
      .updateFactoringCompany(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully updated factoring company',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            "Can't update factoring company",
            'Error'
          );
        },
      });
  }

  private deleteFactoringCompanyById(id: number) {
    this.settingsService
      .deleteFactoringCompanyById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully delete factoring company',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't delete factoring company",
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {}
}
