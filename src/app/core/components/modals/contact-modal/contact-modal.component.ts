import {
  addressUnitValidation,
  addressValidation,
  departmentValidation,
  labelValidation,
} from './../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
  AddressEntity,
  CompanyContactModalResponse,
  CompanyContactResponse,
  ContactColorResponse,
  CreateCompanyContactCommand,
  CreateResponse,
  UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import { phoneFaxRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DropZoneConfig } from '../../shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../../shared/ta-upload-files/ta-upload-file.service';
import { ContactTService } from '../../contacts/state/contact.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class ContactModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public contactForm: FormGroup;

  public sharedDepartments: any[] = [];
  public selectedSharedDepartment: any = null;

  public contactLabels: any[] = [];
  public selectedContactLabel: any = null;

  public colors: any[] = [];
  public selectedContactColor: any;

  public selectedAddress: any = null;

  public isDirty: boolean;

  public dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'image',
    dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
    dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
    multiple: false,
    globalDropZone: true,
  };

  public croppieOptions: Croppie.CroppieOptions = {
    enableExif: true,
    viewport: {
      width: 194,
      height: 194,
      type: 'circle',
    },
    boundary: {
      width: 456,
      height: 194,
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private uploadFileService: TaUploadFileService,
    private contactService: ContactTService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getCompanyContactModal();
    this.companyContactColorLabels();
    this.followSharedCheckbox();

    const timeout = setTimeout(() => {
      this.uploadFileService.visibilityDropZone(true);
      clearTimeout(timeout);
    }, 300);

    if (this.editData) {
      this.editCompanyContact(this.editData.id);
    }
  }

  private createForm() {
    this.contactForm = this.formBuilder.group({
      name: [null, [Validators.required, ...labelValidation]],
      companyContactLabelId: [null],
      phone: [null, [phoneFaxRegex, Validators.required]],
      email: [null, [Validators.required]],
      address: [null, [...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      shared: [true],
      sharedLabelId: [null, [Validators.required, ...departmentValidation]],
      avatar: [null],
      note: [null],
    });

    this.inputService.customInputValidator(
      this.contactForm.get('email'),
      'email',
      this.destroy$
    );

    // this.formService.checkFormChange(this.contactForm);

    // this.formService.formValueChange$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.contactForm.reset();
        break;
      }
      case 'save': {
        if (this.contactForm.invalid) {
          this.inputService.markInvalid(this.contactForm);
          return;
        }
        if (this.editData) {
          this.updateCompanyContact(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addCompanyContact();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteCompanyContactById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  private followSharedCheckbox() {
    this.contactForm
      .get('shared')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.contactForm.get('sharedLabelId')
          );
        } else {
          this.inputService.changeValidators(
            this.contactForm.get('sharedLabelId'),
            false
          );
        }
      });
  }

  private getCompanyContactModal() {
    this.contactService
      .getCompanyContactModal()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CompanyContactModalResponse) => {
          this.contactLabels = res.labels;
          this.sharedDepartments = res.departments;
          this.sharedDepartments = [];
        },
        error: () => {
          this.notificationService.error(
            "Can't get contact labels and departments.",
            'Error:'
          );
        },
      });
  }

  private editCompanyContact(id: number) {
    this.contactService
      .getCompanyContactById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CompanyContactResponse) => {
          this.contactForm.patchValue({
            name: res.name,
            companyContactLabelId: res.companyContactLabel
              ? res.companyContactLabel.name
              : null,
            avatar: res.avatar,
            phone: res.phone,
            email: res.email,
            address: res.address ? res.address.address : null,
            addressUnit: res.address ? res.address.addressUnit : null,
            shared: res.shared,
            sharedLabelId: null, // TODO: Ceka se BACK
            note: res.note,
          });
          this.selectedContactLabel = res.companyContactLabel;

          this.selectedAddress = res.address;
          // TODO: shared departments label selected
        },
        error: () => {
          this.notificationService.error("Can't get contact.", 'Error:');
        },
      });
  }

  private addCompanyContact(): void {
    const { sharedLabelId, addressUnit, ...form } = this.contactForm.value;

    if (this.selectedAddress) {
      this.selectedAddress = {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      };
    }

    const newData: CreateCompanyContactCommand = {
      ...form,
      companyContactLabelId: this.selectedContactLabel
        ? this.selectedContactLabel.id
        : null,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
    };

    this.contactService
      .addCompanyContact(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Contact successfully created.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            "Company Contact can't be created.",
            'Error:'
          );
        },
      });
  }

  private updateCompanyContact(id: number): void {
    const { sharedLabelId, addressUnit, ...form } = this.contactForm.value;

    if (this.selectedAddress) {
      this.selectedAddress = {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      };
    }

    const newData: UpdateCompanyContactCommand = {
      id: id,
      ...form,
      companyContactLabelId: this.selectedContactLabel
        ? this.selectedContactLabel.id
        : null,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
    };

    this.contactService
      .updateCompanyContact(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Contact successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            "Company Contact can't be updated.",
            'Error:'
          );
        },
      });
  }

  public deleteCompanyContactById(id: number): void {
    this.contactService
      .deleteCompanyContactById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Company Contact successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        },
        error: () =>
          this.notificationService.error(
            "Company Contact can't be deleted.",
            'Error:'
          ),
      });
  }

  public onSelectDropdown(event: any, action): void {
    switch (action) {
      case 'departments': {
        this.selectedSharedDepartment = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onHandleAddress(event: {
    address: AddressEntity;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  public onUploadImage(event: any) {
    this.contactForm.get('avatar').patchValue(event);
    this.contactForm.get('avatar').setErrors(null);
  }

  public onImageValidation(event: boolean) {
    if (!event) {
      this.contactForm.get('avatar').setErrors({ invalid: true });
    } else {
      this.inputService.changeValidators(this.contactForm.get('avatar'), false);
    }
  }

  private companyContactColorLabels() {
    this.contactService
      .companyContactLabelsColorList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Array<ContactColorResponse>) => {
          this.colors = res;
        },
        error: () => {
          this.notificationService.error(
            "Can't get contact color labels.",
            'Error:'
          );
        },
      });
  }

  public onPickExistLabel(event: any) {
    this.selectedContactLabel = event;
  }

  public onSelectColorLabel(event: any): void {
    this.selectedContactColor = event;
    this.selectedContactLabel = {
      ...this.selectedContactLabel,
      colorId: this.selectedContactColor.id,
      color: this.selectedContactColor.name,
      code: this.selectedContactColor.code,
      hoverCode: this.selectedContactColor.hoverCode,
    };
  }

  public onSaveLabel(data: { data: any; action: string }) {
    switch (data.action) {
      case 'edit': {
        this.selectedContactLabel = data.data;
        this.contactService
          .updateCompanyContactLabel({
            id: this.selectedContactLabel.id,
            name: this.selectedContactLabel.name,
            colorId: this.selectedContactLabel.colorId,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Successfuly update label',
                'Success'
              );

              this.contactService
                .getCompanyContactModal()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (res: CompanyContactModalResponse) => {
                    this.contactLabels = res.labels;
                  },
                  error: () => {
                    this.notificationService.error(
                      "Can't get account label list.",
                      'Error'
                    );
                  },
                });
            },
            error: () => {
              this.notificationService.error(
                "Can't update exist label",
                'Error'
              );
            },
          });
        break;
      }
      case 'new': {
        this.selectedContactLabel = {
          id: data.data.id,
          name: data.data.name,
          code: this.selectedContactColor
            ? this.selectedContactColor.code
            : this.colors[this.colors.length - 1].code,
          hoverCode: this.selectedContactColor
            ? this.selectedContactColor.hoverCode
            : this.colors[this.colors.length - 1].hoverCode,
          count: 0,
          colorId: this.selectedContactColor
            ? this.selectedContactColor.id
            : this.colors[this.colors.length - 1].id,
          color: this.selectedContactColor
            ? this.selectedContactColor.name
            : this.colors[this.colors.length - 1].name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.contactService
          .addCompanyContactLabel({
            name: this.selectedContactLabel.name,
            colorId: this.selectedContactLabel.colorId,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: CreateResponse) => {
              this.notificationService.success(
                'Successfully add contact label.',
                'Success:'
              );

              this.selectedContactLabel = {
                ...this.selectedContactLabel,
                id: res.id,
              };

              this.contactService
                .getCompanyContactModal()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (res: CompanyContactModalResponse) => {
                    this.contactLabels = res.labels;
                  },
                  error: () => {
                    this.notificationService.error(
                      "Can't get contact label list.",
                      'Error'
                    );
                  },
                });
            },
            error: () => {
              this.notificationService.error(
                "Can't add account label.",
                'Error:'
              );
            },
          });
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
