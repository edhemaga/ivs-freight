import { ContactModalService } from './contact-modal.service';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AddressEntity,
  CompanyContactModalResponse,
  CompanyContactResponse,
  ContactColorResponse,
  CreateCompanyContactCommand,
  CreateResponse,
  UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import {
  emailRegex,
  phoneRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { v4 as uuidv4 } from 'uuid';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DropZoneConfig } from '../../shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../../shared/ta-upload-files/ta-upload-file.service';
import { FormService } from 'src/app/core/services/form/form.service';

@UntilDestroy()
@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class ContactModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public contactForm: FormGroup;

  public sharedDepartments: any[] = [];
  public selectedSharedDepartment: any = null;

  public contactLabels: any[] = [];
  public selectedContactLabel: any = null;
  public sendContactLabelId: any = null;

  public colors: any[] = [];
  public selectedContactColor: any = {
    id: 1,
    name: 'No Color',
    code: null,
    count: 0,
  };

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
    private contactModalService: ContactModalService,
    private notificationService: NotificationService,
    private uploadFileService: TaUploadFileService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getContactLabelsAndDepartments();
    this.companyContactColorLabels();
    this.followSharedCheckbox();

    const timeout = setTimeout(() => {
      this.uploadFileService.visibilityDropZone(true);
      clearTimeout(timeout);
    }, 300);

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editCompanyContact(this.editData.id);
    }
  }

  private createForm() {
    this.contactForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(23)]],
      companyContactLabelId: [null],
      phone: [null, [phoneRegex]],
      email: [null, [emailRegex]],
      address: [null],
      addressUnit: [null, [Validators.maxLength(6)]],
      shared: [true],
      sharedLabelId: [null, Validators.required],
      avatar: [null],
      note: [null],
    });

    // this.formService.checkFormChange(this.contactForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
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
      .valueChanges.pipe(untilDestroyed(this))
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

  private getContactLabelsAndDepartments() {
    this.contactModalService
      .companyContactLabelsAndDeparments()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyContactModalResponse) => {
          this.contactLabels = res.labels;
          this.sharedDepartments = res.departments;
          this.sharedDepartments = [];
          console.log(res.labels);
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
    this.contactModalService
      .getCompanyContactById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyContactResponse) => {
          this.contactForm.patchValue({
            name: res.name,
            companyContactLabelId: res.companyContactLabel
              ? res.companyContactLabel.name
              : null,
            avatar: null,
            phone: res.phone,
            email: res.email,
            address: res.address ? res.address.address : null,
            addressUnit: res.address ? res.address.addressUnit : null,
            shared: res.shared,
            sharedLabelId: null, // TODO: Ceka se BACK
            note: res.note,
          });
          this.selectedContactLabel = res.companyContactLabel;
          console.log(res.address);
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
      companyContactLabelId: this.sendContactLabelId
        ? this.sendContactLabelId
        : this.selectedContactLabel
        ? this.selectedContactLabel.id
        : null,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
    };

    this.contactModalService
      .addCompanyContact(newData)
      .pipe(untilDestroyed(this))
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
      companyContactLabelId: this.sendContactLabelId
        ? this.sendContactLabelId
        : this.selectedContactLabel
        ? this.selectedContactLabel.id
        : null,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
    };

    this.contactModalService
      .updateCompanyContact(newData)
      .pipe(untilDestroyed(this))
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
    this.contactModalService
      .deleteCompanyContactById(id)
      .pipe(untilDestroyed(this))
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
  }

  private companyContactColorLabels() {
    this.contactModalService
      .companyContactLabelsColorList()
      .pipe(untilDestroyed(this))
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
  }

  public onSaveLabel(data: { action: string; label: string }) {
    if (data.action === 'cancel') {
      this.selectedContactLabel = {
        name: data.label,
        code: this.selectedContactColor.code,
        count: this.selectedContactLabel.count
          ? this.selectedContactLabel.count
          : null,
        createdAt: null,
        updatedAt: null,
      };
      return;
    }
    this.selectedContactLabel = {
      id: uuidv4(),
      name: data.label,
      code: this.selectedContactColor.code,
      count: this.selectedContactColor.count,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.contactLabels = [...this.contactLabels, this.selectedContactLabel];

    this.contactModalService
      .addCompanyContactLabel({
        name: data.label,
        colorId: this.selectedContactColor.id,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CreateResponse) => {
          this.sendContactLabelId = res.id;
          this.notificationService.success(
            'Successfully add contact label.',
            'Success:'
          );
          this.getContactLabelsAndDepartments();
        },
        error: () => {
          this.notificationService.error("Can't add contact label.", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {}
}
