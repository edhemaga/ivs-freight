import { ContactModalService } from './contact-modal.service';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  AddressEntity,
  CompanyContactModalResponse,
  CompanyContactResponse,
  CreateCompanyContactCommand,
  UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import {
  emailRegex,
  phoneRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DropZoneConfig } from '../../shared/ta-modal-upload/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../../shared/ta-modal-upload/ta-upload-file.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
  providers: [ModalService],
})
export class ContactModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public contactForm: FormGroup;
  public contactLabels: any[] = [];
  public sharedDepartments: any[] = [];

  public selectedContactLabel: any = null;
  public selectedSharedDepartment: any = null;
  public selectedAddress: any = null;

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
    private uploadFileService: TaUploadFileService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getContactLabelsAndDepartments();
    setTimeout(() => {
      this.uploadFileService.visibilityDropZone(true);
    }, 300);

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
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

  public openCloseCheckboxCard(event: any) {
    if (this.contactForm.get('shared').value) {
      event.preventDefault();
      event.stopPropagation();
      this.contactForm.get('shared').setValue(false);
    }
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
    const { streetName, streetNumber, ...address } = this.selectedAddress || {};

    const newData: CreateCompanyContactCommand = {
      ...form,
      companyContactLabelId: this.selectedContactLabel
        ? this.selectedContactLabel.id
        : null,
      address: {
        ...address,
        addressUnit,
      },
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
    const { streetName, streetNumber, ...address } = this.selectedAddress || {};
    const newData: UpdateCompanyContactCommand = {
      id: id,
      ...form,
      companyContactLabelId: this.selectedContactLabel
        ? this.selectedContactLabel.id
        : null,
      address: {
        ...address,
        addressUnit,
      },
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

  public onSelectColorLabel(event: any): void {
    this.selectedContactLabel = event;
  }

  public onUploadImage(event: any) {
    this.contactForm.get('avatar').patchValue(event);
  }

  public onSaveLabel(event: string) {
    console.log('Contact MODAL');
    console.log(this.contactForm.get('companyContactLabelId').value);
    console.log(event, this.selectedContactLabel);
  }

  public onHandleAddress(event: {
    address: AddressEntity;
    valid: boolean;
  }): void {
    this.selectedAddress = event.address;
  }

  ngOnDestroy(): void {}
}
