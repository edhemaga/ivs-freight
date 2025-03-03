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
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import {
    CaInputAddressDropdownComponent,
    CaInputComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalComponent,
    CaUploadFilesComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// validations
import {
    addressUnitValidation,
    addressValidation,
    departmentValidation,
    fullNameValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { ContactsService } from '@shared/services/contacts.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';
import { ContactStoreService } from '@pages/contacts/services/contact-store.service';

// enums
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums/contacts-modal-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';

// constants
import { ContactModalConfig } from '@pages/contacts/pages/contacts-modal/utils/contacts-modal.config';

// config
import { ContactsModalUploadFilesConfig } from '@pages/contacts/pages/contacts-modal/utils/config';

// models
import {
    AddressEntity,
    CompanyContactLabelResponse,
    ContactColorResponse,
    ContactEmailResponse,
    ContactPhoneResponse,
    CreateCompanyContactCommand,
    CreateResponse,
    DepartmentResponse,
    EnumValue,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import { EditData } from '@shared/models/edit-data.model';

// utils
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

@Component({
    selector: 'app-contact-modal',
    templateUrl: './contacts-modal.component.html',
    styleUrls: ['./contacts-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        CaModalComponent,
        TaCustomCardComponent,
        TaCheckboxCardComponent,
        CaInputNoteComponent,
        CaInputAddressDropdownComponent,
        TaInputDropdownLabelComponent,
        TaModalTableComponent,
        CaUploadFilesComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        TaAppTooltipV2Component,
    ],
})
export class ContactsModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    @Input() editData: EditData;

    public destroy$ = new Subject<void>();

    public uploadFilesConfig =
        ContactsModalUploadFilesConfig.CONTACTS_MODAL_UPLOAD_FILES_CONFIG;
    public contactForm: UntypedFormGroup;
    public isFormDirty: boolean;

    public isFormValidationDisabled: boolean = false;
    public isCardAnimationDisabled: boolean = false;

    public contactLabels: EnumValue[] = [];
    public selectedContactLabel: CompanyContactLabelResponse = null;

    public colors: ContactColorResponse[] = [];
    public selectedContactColor: ContactColorResponse;

    public selectedAddress: AddressEntity = null;

    public sharedDepartments: EnumValue[] = [];
    public selectedSharedDepartment: DepartmentResponse[] = [];

    public isPhoneRowCreated: boolean = false;
    public isEachPhoneRowValid: boolean = true;
    public contactPhones: ContactPhoneResponse[] = [];
    public updatedContactPhones: ContactPhoneResponse[] = [];

    public isEmailRowCreated: boolean = false;
    public isEachEmailRowValid: boolean = true;
    public contactEmails: ContactEmailResponse[] = [];
    public updatedContactEmails: ContactEmailResponse[] = [];
    public contactModalConfig = ContactModalConfig;

    private isUploadInProgress: boolean;

    public modalTableTypeEnum = ModalTableTypeEnum;
    public taModalActionEnum = ContactsModalStringEnum;

    constructor(
        private ngbActiveModal: NgbActiveModal,

        // form
        private formBuilder: UntypedFormBuilder,

        // ref
        private changeDetector: ChangeDetectorRef,

        // services
        protected contactStoreService: ContactStoreService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private contactService: ContactsService,
        private formService: FormService,
        
        public addressService: AddressService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();

        this.manageSubscriptions();

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
            addressUnit: ['', [...addressUnitValidation]],
            contactPhones: [null],
            contactEmails: [null],
            shared: [false],
            sharedLabelId: [null, [...departmentValidation]],
            avatar: [null],
            note: [null],
            departmentHelper: [null],
            contactPhonesHelper: [null],
            contactEmailsHelper: [null],
        });
    }

    public onModalAction(action: string): void {
        if (this.isUploadInProgress) return;

        switch (action) {
            case ContactsModalStringEnum.CLOSE:
                this.setModalSpinner(null, true, true, false);
                break;
            case ContactsModalStringEnum.SAVE_AND_ADD_NEW:
                if (this.contactForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.contactForm);

                    return;
                }
                this.isUploadInProgress = true;
                this.saveCompanyContact();

                this.modalService.openModal(ContactsModalComponent, {
                    size: ContactsModalStringEnum.SMALL,
                });

                break;
            case ContactsModalStringEnum.SAVE:
                if (this.contactForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.contactForm);

                    return;
                }

                this.isUploadInProgress = true;
                if (this.editData?.id) {
                    this.saveCompanyContact(this.editData.id, true);
                } else {
                    this.saveCompanyContact();
                }

                break;
            case ContactsModalStringEnum.DELETE:
                if (this.editData)
                    this.deleteCompanyContactById(this.editData.id);

                break;
            default:
                break;
        }
    }

    private followSharedCheckbox(): void {
        this.contactForm
            .get(ContactsModalStringEnum.SHARED)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.inputService.changeValidators(
                    this.contactForm.get(
                        ContactsModalStringEnum.SHARED_LABEL_ID
                    ),
                    !!value
                );
            });
    }

    public addContactPhoneOrEmail(type: string): void {
        switch (type) {
            case ContactsModalStringEnum.PHONE:
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
            case ContactsModalStringEnum.EMAIL:
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
        modalTableDataValue: ContactPhoneResponse[] | ContactEmailResponse[],
        type: string
    ): void {
        switch (type) {
            case ContactsModalStringEnum.PHONE:
                this.contactPhones = modalTableDataValue;

                this.contactForm
                    .get(ContactsModalStringEnum.CONTACT_PHONES)
                    .patchValue(this.contactPhones);

                this.contactForm
                    .get(ContactsModalStringEnum.CONTACT_PHONES_HELPER)
                    .patchValue(JSON.stringify(this.contactPhones));

                break;
            case ContactsModalStringEnum.EMAIL:
                this.contactEmails = modalTableDataValue;

                this.contactForm
                    .get(ContactsModalStringEnum.CONTACT_EMAILS)
                    .patchValue(this.contactEmails);

                this.contactForm
                    .get(ContactsModalStringEnum.CONTACT_EMAILS_HELPER)
                    .patchValue(JSON.stringify(this.contactEmails));

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
            case ContactsModalStringEnum.PHONE:
                this.isEachPhoneRowValid = validStatus;

                break;
            case ContactsModalStringEnum.EMAIL:
                this.isEachEmailRowValid = validStatus;

                break;
            default:
                break;
        }
    }

    private listenToStoreContactModal(): void {
        this.contactStoreService.modalData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.contactLabels = data.labels.map((item) => {
                    return { ...item, dropLabel: true };
                });

                this.sharedDepartments = data.departments;

                if (this.editData.id) {
                    this.isCardAnimationDisabled = true;

                    this.getCompanyContactById(this.editData.id);
                } else {
                    this.startFormChanges();
                }
            });
    }

    private listenToStoreContactLabelsColor(): void {
        this.contactStoreService.contactLabelsColor$
            .pipe(takeUntil(this.destroy$))
            .subscribe((colors) => {
                this.colors = colors;
            });
    }

    private manageSubscriptions(): void {
        this.listenToStoreContactModal();
        this.listenToStoreContactLabelsColor();
    }

    private getCompanyContactModal(): void {
        this.contactStoreService.dispatchGetContactModalData();
    }

    private getCompanyContactById(id: number): void {
        this.contactService
            .getCompanyContactById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.contactForm.patchValue({
                        name: res.name,
                        companyName: res.companyName,
                        companyContactLabelId: res.companyContactLabel
                            ? res.companyContactLabel.name
                            : null,
                        /*  avatar: res.avatar ? res.avatar : null, */
                        address: res.address.address ? res.address : null,
                        addressUnit: res.address
                            ? res.address.addressUnit
                            : null,
                        shared: res.shared,
                        contactPhones: res.contactPhones,
                        contactEmails: res.contactEmails,
                        departmentHelper: JSON.stringify(
                            res.departmentContacts
                        ),
                        contactPhonesHelper: JSON.stringify(res.contactPhones),
                        contactEmailsHelper: JSON.stringify(res.contactEmails),
                        note: res.note,
                    });

                    this.selectedContactLabel = res.companyContactLabel;
                    this.selectedSharedDepartment = res.departmentContacts;

                    this.updatedContactPhones = res.contactPhones;
                    this.updatedContactEmails = res.contactEmails;

                    this.inputService.changeValidators(
                        this.contactForm.get(
                            ContactsModalStringEnum.SHARED_LABEL_ID
                        ),
                        false
                    );

                    this.changeDetector.detectChanges();

                    setTimeout(() => {
                        this.startFormChanges();

                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
            });
    }

    private prepareCompanyContactData(
        id: number | null,
        isUpdate: boolean
    ): CreateCompanyContactCommand | UpdateCompanyContactCommand {
        const { addressUnit, address, ...form } = this.contactForm.value;

        const updatedAddress = address ? { address, addressUnit } : null;

        const contactPhones = this.contactPhones.map((contactPhone, index) => ({
            ...contactPhone,
            primary: !index,
        }));

        const contactEmails = this.contactEmails.map((contactEmail, index) => ({
            ...contactEmail,
            primary: !index,
        }));

        const companyContactUsers = this.selectedSharedDepartment.map(
            (department) => ({
                departmentId: department.id,
                companyUserIds: department.companyUsers.map(
                    (companyUser) => companyUser.id
                ),
            })
        );

        const data = {
            ...form,
            address: updatedAddress?.address ? updatedAddress : null,
            companyContactLabelId: this.selectedContactLabel
                ? this.selectedContactLabel.id
                : null,
            contactPhones,
            contactEmails,
            companyContactUsers,
        };

        if (isUpdate && id !== null) data.id = id;

        return data;
    }

    private saveCompanyContact(
        id: number | null = null,
        isUpdate: boolean = false
    ): void {
        const mappedContactData = this.prepareCompanyContactData(id, isUpdate);

        isUpdate
            ? this.contactStoreService.dispatchUpdateContact(mappedContactData)
            : this.contactStoreService.dispatchCreateContact(mappedContactData);

        this.setModalSpinner(null, isUpdate, true, true);
    }

    private enableSaving(): void {
        // wait for modal to close
        setTimeout(() => {
            this.isUploadInProgress = false;
        }, 200);
    }

    public deleteCompanyContactById(id: number): void {
        this.contactService
            .deleteCompanyContactById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner(
                        ContactsModalStringEnum.DELETE,
                        true,
                        true,
                        false
                    );
                },
                error: () => {
                    this.setModalSpinner(
                        ContactsModalStringEnum.DELETE,
                        false,
                        false,
                        false
                    );
                },
            });
    }

    public onSelectDropdown(event: DepartmentResponse[]): void {
        this.selectedSharedDepartment = event;

        this.contactForm
            .get(ContactsModalStringEnum.DEPARTMENT_HELPER)
            .patchValue(JSON.stringify(event));

        if (this.selectedSharedDepartment?.length) {
            this.inputService.changeValidators(
                this.contactForm.get(ContactsModalStringEnum.SHARED_LABEL_ID),
                false
            );
        } else {
            this.inputService.changeValidators(
                this.contactForm.get(ContactsModalStringEnum.SHARED_LABEL_ID)
            );
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onUploadImage(event) {
        const base64Data = MethodsGlobalHelper.getBase64DataFromEvent(event);
        this.contactForm
            .get(ContactsModalStringEnum.AVATAR)
            .patchValue(base64Data);
        this.contactForm.get(ContactsModalStringEnum.AVATAR).setErrors(null);
    }

    public onImageValidation(event: boolean): void {
        if (!event) {
            this.contactForm
                .get(ContactsModalStringEnum.AVATAR)
                .setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.contactForm.get(ContactsModalStringEnum.AVATAR),
                false
            );
        }
    }

    private getCompanyContactColorLabels(): void {
        this.contactStoreService.dispatchGetContactColorLabels();
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
            case ContactsModalStringEnum.EDIT:
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
            case ContactsModalStringEnum.NEW:
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

    private setModalSpinner(
        action: string,
        status: boolean,
        close: boolean,
        enableSaving: boolean
    ): void {
        this.modalService.setModalSpinner({
            action,
            status,
            close,
        });

        if (enableSaving) this.enableSaving();

        if (close) this.ngbActiveModal.close();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
