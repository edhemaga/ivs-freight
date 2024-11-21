import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { Subject, takeUntil } from 'rxjs';

// services
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';

// models
import { UpdateFactoringCompanyCommand } from 'appcoretruckassist';

// validators
import {
    addressUnitValidation,
    addressValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaNoticeOfAsignmentComponent } from '@shared/components/ta-notice-of-asignment/ta-notice-of-asignment.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';

// models
import { AddressEntity } from 'appcoretruckassist';

// constants
import { SettingsFactoringModalConstants } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-factoring-modal/utils/constants/settings-factoring-modal.constants';

@Component({
    selector: 'app-settings-factoring-modal',
    templateUrl: './settings-factoring-modal.component.html',
    styleUrls: ['./settings-factoring-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaInputComponent,
        TaInputDropdownComponent,
        TaModalComponent,
        TaNoticeOfAsignmentComponent,
        TaInputNoteComponent,
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
    ],
})
export class SettingsFactoringModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @ViewChild('noticeOfAssignment', { static: false })
    public noticeOfAssignment: any;
    @Input() editData: any;

    public factoringForm: UntypedFormGroup;

    public selectedAddress: AddressEntity = null;

    public isFormDirty: boolean;

    public disableCardAnimation: boolean = false;

    public isBluredNotice: boolean = true;

    public isInitialCompanyNameSet: boolean = true;

    public constants = SettingsFactoringModalConstants;

    private nameInputBlurTimeoutCleaner: NodeJS.Timeout = null;

    noticeValue: any = '';
    range: any;
    selectedEditor: HTMLAnchorElement;
    wysiwigSettings: any = {
        fontFamily: true,
        fontSize: true,
        colorPicker: true,
        textTransform: true,
        textAligment: true,
        textIndent: false,
        textLists: false,
    };

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsCompanyService: SettingsCompanyService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();
        if (this.editData.type === 'edit') {
            this.disableCardAnimation = true;
            this.editFactoringCompany(this.editData.company);
        } else {
            this.startFormChanges();
        }
    }

    private createForm() {
        this.factoringForm = this.formBuilder.group({
            name: [null, Validators.required],
            phone: [null, phoneFaxRegex],
            email: [null],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            noticeOfAssigment: [null, Validators.required],
            note: [null],
        });

        this.inputService.customInputValidator(
            this.factoringForm.get('email'),
            'email',
            this.destroy$
        );
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
                if (this.factoringForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.factoringForm);
                    return;
                }

                this.updateFactoringCompany(this.editData.company);
                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: false,
                });

                break;
            }
            case 'delete': {
                this.deleteFactoringCompanyById();
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                    close: false,
                });

                break;
            }
            default: {
                break;
            }
        }
    }

    private updateFactoringCompany(company: any) {
        const { name, phone, email, addressUnit, noticeOfAssigment, note } =
            this.factoringForm.value;

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
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            noticeOfAssigment: noticeOfAssigment,
            note: note,
        };
        this.settingsCompanyService
            .updateFactoringCompany(newData)
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

    private deleteFactoringCompanyById() {
        this.settingsCompanyService
            .deleteFactoringCompanyById(this.editData.company.id)
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

        setTimeout(() => {
            this.startFormChanges();
            this.disableCardAnimation = false;
        }, 1000);
    }

    public onNoticeFocus(val: boolean) {
        this.isBluredNotice = val;
    }

    public onCompanyNameInputBlur(): void {
        if (
            this.isInitialCompanyNameSet && 
            this.editData.type === 'new' && 
            this.factoringForm.get('name').value
        ) {
            const noticeOfAssignmentBaseText: string = this.constants.NOTICE_OF_ASSIGNMENT_TEXT_BASE
                .replace('{{CompanyName}}', this.factoringForm.get('name').value);
    
            this.factoringForm.get('noticeOfAssigment').setValue(noticeOfAssignmentBaseText);

            this.nameInputBlurTimeoutCleaner = setTimeout(() => this.isInitialCompanyNameSet = !this.isInitialCompanyNameSet, 100);
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.factoringForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        clearTimeout(this.nameInputBlurTimeoutCleaner);
    }
}
