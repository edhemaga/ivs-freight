import { AddressEntity } from './../../../../../../../../appcoretruckassist/model/addressEntity';
import {
  addressUnitValidation,
  addressValidation,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SettingsCompanyService } from '../../../state/company-state/settings-company.service';
import { UpdateFactoringCompanyCommand } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import { phoneFaxRegex } from '../../../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../../../services/form/form.service';

@Component({
  selector: 'app-settings-factoring-modal',
  templateUrl: './settings-factoring-modal.component.html',
  styleUrls: ['./settings-factoring-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class SettingsFactoringModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public factoringForm: FormGroup;

  public selectedAddress: AddressEntity = null;

  public isFormDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private settingsCompanyService: SettingsCompanyService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.editData.type === 'edit') {
      this.editFactoringCompany(this.editData.company);
    }
  }

  private createForm() {
    this.factoringForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, phoneFaxRegex],
      email: [null],
      address: [null, [...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      noticeOfAssigment: [null],
      note: [null],
    });

    this.inputService.customInputValidator(
      this.factoringForm.get('email'),
      'email',
      this.destroy$
    );

    this.formService.checkFormChange(this.factoringForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }) {
    if (event.valid) this.selectedAddress = event.address;
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.factoringForm.invalid) {
          this.inputService.markInvalid(this.factoringForm);
          return;
        }
        if (this.editData.type === 'edit') {
          if (this.isFormDirty) {
            this.updateFactoringCompany(this.editData.company);
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        }

        break;
      }
      case 'delete': {
        this.deleteFactoringCompanyById(this.editData.company);
        this.modalService.setModalSpinner({ action: 'delete', status: true });

        break;
      }
      default: {
        break;
      }
    }
  }

  private updateFactoringCompany(company: any) {
    const {
      name,
      phone,
      email,
      address,
      addressUnit,
      noticeOfAssigment,
      note,
    } = this.factoringForm.value;

    if (this.selectedAddress) {
      this.selectedAddress = {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      };
    }

    const newData: UpdateFactoringCompanyCommand = {
      companyId: company.divisions.length ? null : company.id,
      name: name,
      phone: phone,
      email: email,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
      noticeOfAssigment: noticeOfAssigment,
      note: note,
    };
    this.settingsCompanyService
      .updateFactoringCompany(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Successfully ${
              this.editData.type === 'new' ? 'created' : 'updated'
            } factoring company`,
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't update factoring company",
            'Error'
          );
        },
      });
  }

  private deleteFactoringCompanyById(company: any) {
    this.settingsCompanyService
      .deleteFactoringCompanyById(this.editData.company.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully delete factoring company',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't delete factoring company",
            'Error'
          );
        },
      });
  }

  private editFactoringCompany(company: any) {
    this.factoringForm.patchValue({
      name: company.factoringCompany.name,
      phone: company.factoringCompany.phone,
      email: company.factoringCompany.email,
      address: company.factoringCompany.address.address,
      addressUnit: company.factoringCompany.address.addressUnit,
      noticeOfAssigment: company.factoringCompany.noticeOfAssigment,
      note: company.factoringCompany.note,
    });

    this.onHandleAddress({
      address: company.factoringCompany.address,
      valid: company.factoringCompany.address.address ? true : false,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
