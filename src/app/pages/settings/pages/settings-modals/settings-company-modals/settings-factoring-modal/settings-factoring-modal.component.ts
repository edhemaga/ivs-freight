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
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// services
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';

// models
import {
    FactoringCompany,
    UpdateFactoringCompanyCommand,
} from 'appcoretruckassist';

// validators
import {
    addressUnitValidation,
    addressValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaNoticeOfAsignmentComponent } from '@shared/components/ta-notice-of-asignment/ta-notice-of-asignment.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import {
    CaInputComponent,
    CaInputNoteComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaInputAddressDropdownComponent,
} from 'ca-components';

// models
import { AddressEntity } from 'appcoretruckassist';

// constants
import { SettingsFactoringModalConstants } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-factoring-modal/utils/constants/settings-factoring-modal.constants';

// Svg Routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Enums
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import {
    ModalButtonType,
    ModalButtonSize,
    EGeneralActions,
} from '@shared/enums';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

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
        NgbTooltipModule,

        // Component
        CaInputComponent,
        CaModalComponent,
        CaModalButtonComponent,
        TaNoticeOfAsignmentComponent,
        CaInputNoteComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaAppTooltipV2Component,

        // Pipes
        FormatDatePipe,
    ],
})
export class SettingsFactoringModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnDestroy, OnInit
{
    public destroy$ = new Subject<void>();
    @ViewChild('noticeOfAssignment', { static: false })
    public noticeOfAssignment: any;
    @Input() editData: any;

    public factoringForm: UntypedFormGroup;

    public selectedAddress: AddressEntity = null;

    public isFormDirty: boolean;

    public isCardAnimationDisabled: boolean = false;

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
    public svgRoutes = SharedSvgRoutes;
    public taModalActionEnum = TaModalActionEnum;
    public activeAction: string;
    public modalButtonType = ModalButtonType;
    public modalButtonSize = ModalButtonSize;
    public company: FactoringCompany;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private ngbActiveModal: NgbActiveModal,

        // services
        public addressService: AddressService,
        private formService: FormService,
        private inputService: TaInputService,
        private settingsCompanyService: SettingsCompanyService
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
        if (this.editData.type === EGeneralActions.EDIT) {
            this.isCardAnimationDisabled = true;
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

    public onModalAction(action: string): void {
        this.activeAction = action;

        switch (action) {
            case TaModalActionEnum.CLOSE:
                this.ngbActiveModal.close();
                break;
            case TaModalActionEnum.SAVE: {
                // If Form not valid
                if (this.factoringForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.factoringForm);
                    return;
                }

                this.updateFactoringCompany(this.editData.company);

                break;
            }
            case TaModalActionEnum.DELETE: {
                this.deleteFactoringCompanyById();

                break;
            }
            default: {
                this.ngbActiveModal.close();
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
                    this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    private deleteFactoringCompanyById() {
        this.settingsCompanyService
            .deleteFactoringCompanyById(this.editData.company.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    private editFactoringCompany(company: any) {
        this.company = company;

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
            this.isCardAnimationDisabled = false;
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
            const noticeOfAssignmentBaseText: string =
                this.constants.NOTICE_OF_ASSIGNMENT_TEXT_BASE.replace(
                    '{{CompanyName}}',
                    this.factoringForm.get('name').value
                );

            this.factoringForm
                .get('noticeOfAssigment')
                .setValue(noticeOfAssignmentBaseText);

            this.nameInputBlurTimeoutCleaner = setTimeout(
                () =>
                    (this.isInitialCompanyNameSet =
                        !this.isInitialCompanyNameSet),
                100
            );
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
