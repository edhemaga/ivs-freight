import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { Subject, switchMap, takeUntil } from 'rxjs';

// modules
import { CroppieOptions } from 'croppie';
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
import { TaModalTableComponent } from '../../standalone-components/ta-modal-table/ta-modal-table.component';

// validations
import {
    addressUnitValidation,
    addressValidation,
    departmentValidation,
    fullNameValidation,
} from '../../shared/ta-input/ta-input.regex-validations';

// services
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ContactTService } from '../../contacts/state/contact.service';
import { FormService } from '../../../services/form/form.service';

// enums
import { ConstantStringEnum } from './state/enums/contact-modal.enum';

// constants
import { ContactModalConstants } from './state/utils/constants/contact-modal.constants';

// models
import {
    AddressEntity,
    CompanyContactLabelResponse,
    CompanyContactModalResponse,
    CompanyContactResponse,
    ContactColorResponse,
    CreateCompanyContactCommand,
    CreateContactEmailCommand,
    CreateContactPhoneCommand,
    CreateResponse,
    DepartmentResponse,
    EnumValue,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';
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
        TaModalTableComponent,
    ],
})
export class ContactModalComponent implements OnInit, OnDestroy {
    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public contactForm: UntypedFormGroup;
    public isFormDirty: boolean;

    public isFormValidationDisabled: boolean = false;
    public isCardAnimationDisabled: boolean = false;

    public isAddNewAfterSave: boolean = false;

    public croppieOptions: CroppieOptions =
        ContactModalConstants.CROPIE_OPTIONS;

    public contactLabels: EnumValue[] = [];
    public selectedContactLabel: CompanyContactLabelResponse = null;

    public colors: ContactColorResponse[] = [];
    public selectedContactColor: ContactColorResponse;

    public selectedAddress: AddressEntity = null;

    public sharedDepartments: EnumValue[] = [];
    public selectedSharedDepartment: DepartmentResponse = null;

    public isPhoneRowCreated: boolean = false;
    public isEachPhoneRowValid: boolean = true;
    public contactPhones: CreateContactPhoneCommand[] = [];

    public isEmailRowCreated: boolean = false;
    public isEachEmailRowValid: boolean = true;
    public contactEmails: CreateContactEmailCommand[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private changeDetector: ChangeDetectorRef,
        private inputService: TaInputService,
        private modalService: ModalService,
        private contactService: ContactTService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getCompanyContactModal();

        this.getCompanyContactColorLabels();

        this.followSharedCheckbox();
    }

    private createForm(): void {
        this.contactForm = this.formBuilder.group({
            name: [null, [Validators.required, ...fullNameValidation]],
            companyName: [null],
            companyContactLabelId: [null],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            shared: [true],
            sharedLabelId: [
                null,
                [Validators.required, ...departmentValidation],
            ],
            avatar: [null],
            note: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case ConstantStringEnum.CLOSE:
                break;
            case ConstantStringEnum.SAVE_AND_ADD_NEW:
                if (this.contactForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.contactForm);

                    return;
                }

                this.addCompanyContact();

                this.modalService.setModalSpinner({
                    action: ConstantStringEnum.SAVE_AND_ADD_NEW,
                    status: true,
                    close: false,
                });

                this.isAddNewAfterSave = true;

                break;
            case ConstantStringEnum.SAVE:
                if (this.contactForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.contactForm);

                    return;
                }

                if (this.editData) {
                    this.updateCompanyContact(this.editData.id);
                } else {
                    this.addCompanyContact();
                }

                break;
            case ConstantStringEnum.DELETE:
                if (this.editData) {
                    this.deleteCompanyContactById(this.editData.id);
                }

                break;
            default:
                break;
        }
    }

    private followSharedCheckbox(): void {
        this.contactForm
            .get(ConstantStringEnum.SHARED)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.contactForm.get(ConstantStringEnum.SHARED_LABEL_ID)
                    );
                } else {
                    this.inputService.changeValidators(
                        this.contactForm.get(
                            ConstantStringEnum.SHARED_LABEL_ID
                        ),
                        false
                    );
                }
            });
    }

    public addContactPhoneOrEmail(
        _: { check: boolean; action: string },
        type: string
    ): void {
        switch (type) {
            case ConstantStringEnum.PHONE:
                if (
                    !this.isEachPhoneRowValid ||
                    this.contactPhones.length === 3
                )
                    return;

                this.isPhoneRowCreated = true;

                setTimeout(() => {
                    this.isPhoneRowCreated = false;
                }, 400);

                break;
            case ConstantStringEnum.EMAIL:
                if (
                    !this.isEachEmailRowValid ||
                    this.contactEmails.length === 2
                )
                    return;

                this.isEmailRowCreated = true;

                setTimeout(() => {
                    this.isEmailRowCreated = false;
                }, 400);

                break;
            default:
                break;
        }

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(
        modalTableDataValue: CreateContactPhoneCommand[],
        type: string
    ): void {
        switch (type) {
            case ConstantStringEnum.PHONE:
                this.contactPhones = modalTableDataValue;

                break;
            case ConstantStringEnum.EMAIL:
                this.contactEmails = modalTableDataValue;

                break;
            default:
                break;
        }
    }

    public handleModalTableValidStatusEmit(
        validStatus: boolean,
        type: string
    ): void {
        switch (type) {
            case ConstantStringEnum.PHONE:
                this.isEachPhoneRowValid = validStatus;

                break;
            case ConstantStringEnum.EMAIL:
                this.isEachEmailRowValid = validStatus;

                break;
            default:
                break;
        }
    }

    private getCompanyContactModal(): void {
        this.contactService
            .getCompanyContactModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: CompanyContactModalResponse) => {
                this.contactLabels = res.labels.map((item) => {
                    return { ...item, dropLabel: true };
                });

                this.sharedDepartments = res.departments;

                if (this.editData) {
                    this.isCardAnimationDisabled = true;

                    this.getCompanyContactById(this.editData.id);
                } else {
                    this.startFormChanges();
                }
            });
    }

    private getCompanyContactById(id: number): void {
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

                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
            });
    }

    private addCompanyContact(): void {
        const { addressUnit, ...form } = this.contactForm.value;

        if (this.selectedAddress)
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit,
            };

        const contactPhones = this.contactPhones.map((contactPhone, index) => {
            return {
                ...contactPhone,
                primary: !index,
            };
        });

        const contactEmails = this.contactEmails.map((contactEmail, index) => {
            return {
                ...contactEmail,
                primary: !index,
            };
        });

        const newData: CreateCompanyContactCommand = {
            ...form,
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            companyContactLabelId: this.selectedContactLabel
                ? this.selectedContactLabel.id
                : null,
            contactPhones,
            contactEmails,
            companyContactUsers: [
                {
                    departmentId: this.selectedSharedDepartment.id,
                    companyUserIds: [],
                },
            ],
        };

        console.log('newData', newData);

        /*   this.contactService
            .addCompanyContact(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.isAddNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: ConstantStringEnum.SAVE_AND_ADD_NEW,
                            status: false,
                            close: false,
                        });

                        this.formService.resetForm(this.contactForm);

                        this.selectedAddress = null;
                        this.selectedContactColor = null;
                        this.selectedContactLabel = null;
                        this.selectedSharedDepartment = null;

                        this.contactForm
                            .get(ConstantStringEnum.SHARED)
                            .patchValue(true);

                        this.isAddNewAfterSave = false;
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
            }); */
    }

    private updateCompanyContact(id: number): void {
        const { addressUnit, ...form } = this.contactForm.value;

        if (this.selectedAddress)
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };

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
                        action: ConstantStringEnum.DELETE,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: ConstantStringEnum.DELETE,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    public onSelectDropdown(event: EnumValue): void {
        this.selectedSharedDepartment = event;
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onUploadImage(event) {
        this.contactForm.get(ConstantStringEnum.AVATAR).patchValue(event);
        this.contactForm.get(ConstantStringEnum.AVATAR).setErrors(null);
    }

    public onImageValidation(event: boolean): void {
        if (!event) {
            this.contactForm
                .get(ConstantStringEnum.AVATAR)
                .setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.contactForm.get(ConstantStringEnum.AVATAR),
                false
            );
        }
    }

    private getCompanyContactColorLabels(): void {
        this.contactService
            .companyContactLabelsColorList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.colors = res;
            });
    }

    public onPickExistLabel(event: EnumValue): void {
        this.selectedContactLabel = event;
    }

    public onSelectColorLabel(event: EnumValue): void {
        this.selectedContactColor = event;

        this.selectedContactLabel = {
            ...this.selectedContactLabel,
            colorId: this.selectedContactColor.id,
            color: this.selectedContactColor.name,
            code: this.selectedContactColor.code,
            hoverCode: this.selectedContactColor.hoverCode,
        };
    }

    public onSaveLabel(data: { data: EnumValue; action: string }): void {
        switch (data.action) {
            case ConstantStringEnum.EDIT:
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
                    .subscribe((res) => {
                        this.contactLabels = res.labels;
                    });

                break;
            case ConstantStringEnum.NEW:
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
                    .subscribe((res) => {
                        this.contactLabels = res.labels;
                    });

                break;
            default:
                break;
        }
    }

    public companyContactLabelMode(event: boolean): void {
        this.isFormValidationDisabled = event;
    }

    private startFormChanges(): void {
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
