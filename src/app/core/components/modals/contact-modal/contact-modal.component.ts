import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    UntypedFormArray,
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { Subject, switchMap, takeUntil } from 'rxjs';

// modules
import Croppie from 'croppie';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaCheckboxCardComponent } from '../../shared/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaLogoChangeComponent } from '../../shared/ta-logo-change/ta-logo-change.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../shared/input-address-dropdown/input-address-dropdown.component';
import { TaInputDropdownLabelComponent } from '../../shared/ta-input-dropdown-label/ta-input-dropdown-label.component';

// validations
import {
    addressUnitValidation,
    addressValidation,
    departmentValidation,
    phoneFaxRegex,
    fullNameValidation,
    phoneExtension,
} from '../../shared/ta-input/ta-input.regex-validations';

// services
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ContactTService } from '../../contacts/state/contact.service';
import { FormService } from '../../../services/form/form.service';

// models
import {
    AddressEntity,
    CompanyContactModalResponse,
    CompanyContactResponse,
    ContactColorResponse,
    CreateCompanyContactCommand,
    CreateResponse,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import { DropZoneConfig } from '../../shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { EditData } from '../load-modal/state/models/load-modal-model/edit-data.model';

@Component({
    selector: 'app-contact-modal',
    templateUrl: './contact-modal.component.html',
    styleUrls: ['./contact-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaCustomCardComponent,
        TaCheckboxCardComponent,
        TaInputDropdownComponent,
        TaLogoChangeComponent,
        TaInputNoteComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
        TaInputDropdownLabelComponent,
    ],
})
export class ContactModalComponent implements OnInit, OnDestroy {
    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public contactForm: UntypedFormGroup;
    public isFormDirty: boolean;

    public sharedDepartments: any[] = [];
    public selectedSharedDepartment: any = null;

    public contactLabels: any[] = [];
    public selectedContactLabel: any = null;

    public colors: any[] = [];
    public selectedContactColor: any;

    public selectedAddress: any = null;

    public labelsContactPhones: any[] = [];
    public isContactPhoneExtExist: boolean[] = [];
    public selectedContactPhone: any[] = [];

    public labelsContactEmails: any[] = [];
    public selectedContactEmail: any[] = [];

    public disabledFormValidation: boolean = false;

    public disableCardAnimation: boolean = false;

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

    public addNewAfterSave: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private contactService: ContactTService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getCompanyContactModal();

        this.companyContactColorLabels();

        /*  this.followSharedCheckbox(); */
    }

    private createForm() {
        this.contactForm = this.formBuilder.group({
            name: [null, [Validators.required, ...fullNameValidation]],
            companyContactLabelId: [null],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            contactPhones: this.formBuilder.array([]),
            contactEmails: this.formBuilder.array([]),
            shared: [true],
            sharedLabelId: [
                null,
                [Validators.required, ...departmentValidation],
            ],
            avatar: [null],
            note: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close':
                break;
            case 'save and add new':
                if (this.contactForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.contactForm);
                    return;
                }
                this.addCompanyContact();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;

                break;
            case 'save':
                if (this.contactForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.contactForm);
                    return;
                }
                if (this.editData) {
                    this.updateCompanyContact(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addCompanyContact();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }

                break;
            case 'delete':
                if (this.editData) {
                    this.deleteCompanyContactById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: false,
                    });
                }

                break;
            default:
                break;
        }
    }

    public get contactPhones(): UntypedFormArray {
        return this.contactForm.get('contactPhones') as UntypedFormArray;
    }

    public createContactPhones(element?: any) {
        return this.formBuilder.group({
            id: [element?.id ? element.id : 0],
            phone: [element?.phone ? element.phone : null, phoneFaxRegex],
            phoneExt: [
                element?.phoneExt ? element.phoneExt : null,
                phoneExtension,
            ],
            contactPhoneType: [
                element?.contactPhoneType
                    ? element.contactPhoneType.name
                    : null,
            ],
            primary: element?.primary
                ? element.primary
                : this.editData
                ? false
                : !this.contactPhones.length,
        });
    }

    public addContactPhones(event: { check: boolean; action: string }) {
        if (event.check) {
            this.contactPhones.push(this.createContactPhones());
            this.isContactPhoneExtExist.push(false);
        }
    }

    public get contactEmails(): UntypedFormArray {
        return this.contactForm.get('contactEmails') as UntypedFormArray;
    }

    public createContactEmails(element?: any) {
        return this.formBuilder.group({
            id: [element?.id ? element.id : 0],
            email: [element?.email ? element.email : null],
            contactEmailType: [
                element?.contactEmailType
                    ? element.contactEmailType.name
                    : null,
            ],
            primary: element?.primary
                ? element.primary
                : this.editData
                ? false
                : !this.contactEmails.length,
        });
    }

    public addContactEmails(event: { check: boolean; action: string }) {
        const form = this.createContactEmails();
        if (event.check) {
            this.contactEmails.push(form);
        }

        this.inputService.customInputValidator(
            form.get('email'),
            'email',
            this.destroy$
        );
    }

    public removeContactFeature(action: string, index: number) {
        switch (action) {
            case 'contact-phone': {
                this.contactPhones.removeAt(index);
                this.selectedContactPhone.splice(index, 1);
                this.isContactPhoneExtExist.splice(index, 1);
                break;
            }
            case 'contact-email': {
                this.contactEmails.removeAt(index);
                this.selectedContactEmail.splice(index, 1);
                break;
            }
            default: {
                break;
            }
        }
    }

    public setPrimary(formControl: AbstractControl, action: string) {
        switch (action) {
            case 'phone': {
                this.contactPhones.controls.map((item) =>
                    item.get('primary').patchValue(false)
                );
                formControl
                    .get('primary')
                    .patchValue(!formControl.get('primary').value);
                break;
            }
            case 'email': {
                this.contactEmails.controls.map((item) =>
                    item.get('primary').patchValue(false)
                );
                formControl
                    .get('primary')
                    .patchValue(!formControl.get('primary').value);
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
            .subscribe((res: CompanyContactModalResponse) => {
                this.contactLabels = res.labels.map((item) => {
                    return { ...item, dropLabel: true };
                });

                this.sharedDepartments = res.departments;
                this.labelsContactEmails = res.contactEmailType;
                this.labelsContactPhones = res.contactPhoneType;

                if (this.editData) {
                    this.disableCardAnimation = true;
                    this.getCompanyContactById(this.editData.id);
                } else {
                    this.startFormChanges();
                }
            });
    }

    private getCompanyContactById(id: number) {
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
                        avatar: res.avatar ? res.avatar : null,
                        address: res.address ? res.address.address : null,
                        addressUnit: res.address
                            ? res.address.addressUnit
                            : null,
                        shared: res.shared,
                        sharedLabelId: 'Recruitment', // TODO: Ceka se BACK
                        note: res.note,
                    });

                    if (res.contactPhones.length) {
                        for (
                            let index = 0;
                            index < res.contactPhones.length;
                            index++
                        ) {
                            this.contactPhones.push(
                                this.createContactPhones(
                                    res.contactPhones[index]
                                )
                            );
                            this.selectedContactPhone[index] =
                                res.contactPhones[index].contactPhoneType;
                            this.isContactPhoneExtExist[index] =
                                !!res.contactPhones[index].phoneExt;
                        }
                    }

                    if (res.contactEmails.length) {
                        for (
                            let index = 0;
                            index < res.contactEmails.length;
                            index++
                        ) {
                            this.contactEmails.push(
                                this.createContactEmails(
                                    res.contactEmails[index]
                                )
                            );
                            this.selectedContactEmail[index] =
                                res.contactEmails[index].contactEmailType;
                        }
                    }

                    this.selectedContactLabel = res.companyContactLabel;

                    this.selectedAddress = res.address;
                    // TODO: Ceka se BACK
                    this.selectedSharedDepartment = {
                        id: 3,
                        name: 'Recruitment',
                        count: 0,
                        companyUsers: [],
                    };

                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private addCompanyContact(): void {
        const { addressUnit, ...form } = this.contactForm.value;

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
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            companyContactUsers: [
                {
                    departmentId: this.selectedSharedDepartment.id,
                    companyUserIds: [],
                },
            ],
        };

        this.contactService
            .addCompanyContact(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });

                        this.formService.resetForm(this.contactForm);

                        this.selectedAddress = null;
                        this.selectedContactColor = null;
                        this.selectedContactEmail = [];
                        this.selectedContactLabel = null;
                        this.selectedContactPhone = [];
                        this.isContactPhoneExtExist = [];
                        this.selectedSharedDepartment = null;

                        this.contactForm.get('shared').patchValue(true);

                        this.contactPhones.controls = [];
                        this.contactEmails.controls = [];

                        this.addNewAfterSave = false;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: false,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateCompanyContact(id: number): void {
        const { addressUnit, ...form } = this.contactForm.value;

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
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            companyContactUsers: [
                {
                    departmentId: this.selectedSharedDepartment.id,
                    companyUserIds: [],
                },
            ],
        };

        this.contactService
            .updateCompanyContact(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    public deleteCompanyContactById(id: number): void {
        this.contactService
            .deleteCompanyContactById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    public onSelectDropdown(event: any, action: string, index?: number): void {
        switch (action) {
            case 'departments': {
                this.selectedSharedDepartment = event;

                break;
            }
            case 'contact-email': {
                this.selectedContactEmail[index] = event;
                break;
            }
            case 'contact-phone': {
                this.selectedContactPhone[index] = event;
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
            this.inputService.changeValidators(
                this.contactForm.get('avatar'),
                false
            );
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
                error: () => {},
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
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap(() => {
                            return this.contactService.getCompanyContactModal();
                        })
                    )
                    .subscribe({
                        next: (res: CompanyContactModalResponse) => {
                            this.contactLabels = res.labels;
                        },
                        error: () => {},
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
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap((res: CreateResponse) => {
                            this.selectedContactLabel = {
                                ...this.selectedContactLabel,
                                id: res.id,
                            };
                            return this.contactService.getCompanyContactModal();
                        })
                    )
                    .subscribe({
                        next: (res: CompanyContactModalResponse) => {
                            this.contactLabels = res.labels;
                        },
                        error: () => {},
                    });
                break;
            }
            default: {
                break;
            }
        }
    }

    public companyContactLabelMode(event: boolean) {
        this.disabledFormValidation = event;
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.contactForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
