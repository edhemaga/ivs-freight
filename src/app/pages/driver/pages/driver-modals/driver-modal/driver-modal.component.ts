import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponseBase } from '@angular/common/http';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

// modules
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CroppieOptions } from 'croppie';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { TaUploadFileService } from '@shared/components/ta-upload-files/services/ta-upload-file.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { EditTagsService } from '@shared/services/edit-tags.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// validators
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    einNumberRegex,
    firstNameValidation,
    fuelCardValidation,
    lastNameValidation,
    name2_24Validation,
    perStopValidation,
    phoneFaxRegex,
    routingBankValidation,
    ssnNumberRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaLogoChangeComponent } from '@shared/components/ta-logo-change/ta-logo-change.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DriverModalStringEnum } from '@pages/driver/pages/driver-modals/driver-modal/enums/driver-modal-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';

// constants
import { DriverModalConstants } from '@pages/driver/pages/driver-modals/driver-modal/utils/constants/driver-modal.constants';

// models
import {
    AddressEntity,
    BankResponse,
    CheckOwnerSsnEinResponse,
    CreateResponse,
    DriverResponse,
    EnumValue,
    GetDriverModalResponse,
    OffDutyLocationResponse,
    PerMileEntity,
} from 'appcoretruckassist';
import { DropZoneConfig } from '@shared/components/ta-upload-files/components/ta-upload-dropzone/ta-upload-dropzone.component';
import { Tabs } from '@shared/models/tabs.model';
import { AnimationObject } from '@pages/driver/pages/driver-modals/driver-modal/models/animation-object.model';
import { AddUpdateDriverProperties } from '@pages/driver/pages/driver-modals/driver-modal/models/add-update-driver-properties.model';
import { SoloTeamSelectedOptions } from '@pages/driver/pages/driver-modals/driver-modal/models/solo-team-selected-options.model';
import { AddUpdateDriverPayrollProperties } from '@pages/driver/pages/driver-modals/driver-modal/models/add-update-driver-payroll-properties.model';

@Component({
    selector: 'app-driver-modal',
    templateUrl: './driver-modal.component.html',
    styleUrls: ['./driver-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService, FormService, BankVerificationService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaNgxSliderComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCheckboxCardComponent,
        TaInputDropdownComponent,
        TaLogoChangeComponent,
        TaModalTableComponent,
    ],
})
export class DriverModalComponent implements OnInit, OnDestroy {
    @ViewChild(TaTabSwitchComponent) tabSwitch: TaTabSwitchComponent;

    @Input() editData: any;

    private destroy$ = new Subject<void>();

    public driverForm: UntypedFormGroup;

    public isFormDirty: boolean;
    public isAddNewAfterSave: boolean = false;

    public driverFullName: string;
    public driverStatus: boolean = true;

    // animation
    public isCardAnimationDisabled: boolean = false;
    public animationObject: AnimationObject;

    // spinner
    public isOwnerEinLoading: boolean = false;

    // tabs
    public mainTabs: Tabs[] = [];
    public ownerTabs: Tabs[] = [];
    public payrollTabs: Tabs[] = [];

    public selectedTabId: number = 1;

    // dropdowns
    public payTypeDropdownList: EnumValue[] = [];
    public banksDropdownList: BankResponse[] = [];

    public selectedPayType: EnumValue;
    public selectedBank: BankResponse;
    public selectedOwner: CheckOwnerSsnEinResponse;

    public selectedAddress: AddressEntity;
    public longitude: number;
    public latitude: number;

    public isBankSelected: boolean = false;

    // slider
    public soloSliderOptions: Options;
    public teamSliderOptions: Options;
    public driverSliderOptions: Options;

    // items
    public isOffDutyLocationRowCreated: boolean = false;
    public isEachOffDutyLocationRowValid: boolean = true;

    public offDutyLocationItems: OffDutyLocationResponse[] = [];
    public updateOffDutyLocationItems: OffDutyLocationResponse[] = [];

    // documents
    public dropZoneConfig: DropZoneConfig;
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public tags: any[] = [];

    public isFileModified: boolean = false;

    // logo
    public croppieOptions: CroppieOptions;

    // payroll
    public payrollCompany: any;

    public fleetType: string;
    public hasMilesSameRate: boolean = false;

    public modalTableTypeEnum = ModalTableTypeEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private driverService: DriverService,
        private modalService: ModalService,
        private uploadFileService: TaUploadFileService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        private tagsService: EditTagsService,

        // bootstrap
        private ngbActiveModal: NgbActiveModal,

        // change detector
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getDriverDropdowns();

        this.isOwnerSelected();

        this.isUseCarrieraACHSelected();

        this.isSoloOrTeamDriverSelected();

        this.isTwicTypeSelected();
    }

    private createForm(): void {
        this.driverForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            dateOfBirth: [null, Validators.required],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            ssn: [null, [Validators.required, ssnNumberRegex]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],

            isOwner: [false],
            ownerId: [null],
            ownerType: [DriverModalStringEnum.SOLE_PROPRIETOR],
            ein: [null, einNumberRegex],
            bussinesName: [null],

            payrollType: [DriverModalStringEnum.COMPANY_DRIVER],
            useCarrieraACH: [false],
            payType: [null, [Validators.required]],
            soloDriver: [true],
            teamDriver: [true],

            soloEmptyMile: [null],
            soloLoadedMile: [null],
            soloPerStop: [null, perStopValidation],
            perMileSolo: [null], // if has same rate loaded and empty

            teamEmptyMile: [null],
            teamLoadedMile: [null],
            teamPerStop: [null, perStopValidation],
            perMileTeam: [null], // if has same rate loaded and empty

            commissionSolo: [25],
            commissionTeam: [25],
            driverCommission: [25],

            soloFlatRate: [null, perStopValidation],
            teamFlatRate: [null, perStopValidation],

            bankId: [null, [...bankValidation]],
            account: [null, accountBankValidation],
            routing: [null, routingBankValidation],

            isOpenPayrollShared: [false],

            offDutyLocationItems: [null],

            emergencyContactName: [null, [...name2_24Validation]],
            emergencyContactPhone: [null, [phoneFaxRegex]],
            emergencyContactRelationship: [null, name2_24Validation],

            files: [null],
            tags: [null],

            note: [null],

            avatar: [null],
            twic: [false],
            twicExpDate: [null],
            mvrExpiration: [null, Validators.required],
            fuelCard: [null, [...fuelCardValidation]],

            mailNotificationGeneral: [true],
            pushNotificationGeneral: [true],
            smsNotificationGeneral: [false],
            mailNotificationPayroll: [true],
            pushNotificationPayroll: [true],
            smsNotificationPayroll: [false],
        });

        this.inputService.customInputValidator(
            this.driverForm.get(DriverModalStringEnum.EMAIL),
            DriverModalStringEnum.EMAIL,
            this.destroy$
        );
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.driverForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private getConstantData(): void {
        this.mainTabs = JSON.parse(
            JSON.stringify(DriverModalConstants.MAIN_TABS)
        );

        this.ownerTabs = JSON.parse(
            JSON.stringify(DriverModalConstants.OWNER_TABS)
        );

        this.payrollTabs = JSON.parse(
            JSON.stringify(DriverModalConstants.PAYROLL_TABS)
        );

        this.animationObject = JSON.parse(
            JSON.stringify(DriverModalConstants.ANIMATION_OBJECT)
        );

        this.soloSliderOptions = JSON.parse(
            JSON.stringify(DriverModalConstants.SLIDER_OPTIONS)
        );

        this.teamSliderOptions = JSON.parse(
            JSON.stringify(DriverModalConstants.SLIDER_OPTIONS)
        );

        this.driverSliderOptions = JSON.parse(
            JSON.stringify(DriverModalConstants.SLIDER_OPTIONS)
        );

        this.croppieOptions = DriverModalConstants.CROPPIE_OPTIONS;
    }

    private isOwnerSelected(): void {
        this.driverForm
            .get(DriverModalStringEnum.IS_OWNER)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value &&
                    !this.driverForm.get(DriverModalStringEnum.OWNER_TYPE).value
                ) {
                    this.driverForm
                        .get(DriverModalStringEnum.OWNER_TYPE)
                        .patchValue(DriverModalStringEnum.SOLE_PROPRIETOR);
                }
            });
    }

    private isUseCarrieraACHSelected(): void {
        this.driverForm
            .get(DriverModalStringEnum.USE_CARRIERA_ACH)
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.driverForm.get(DriverModalStringEnum.BANK_ID)
                    );
                } else {
                    this.inputService.changeValidators(
                        this.driverForm.get(DriverModalStringEnum.BANK_ID),
                        false,
                        [],
                        false
                    );
                }
            });
    }

    private isTwicTypeSelected(): void {
        this.driverForm
            .get(DriverModalStringEnum.TWIC)
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.driverForm.get(DriverModalStringEnum.TWIC_EXP_DATE)
                    );
                } else {
                    this.inputService.changeValidators(
                        this.driverForm.get(
                            DriverModalStringEnum.TWIC_EXP_DATE
                        ),
                        false
                    );
                }
            });
    }

    private isSoloOrTeamDriverSelected(): void {
        this.driverForm
            .get(DriverModalStringEnum.SOLO_DRIVER)
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (this.fleetType === DriverModalStringEnum.COMBINED)
                    this.handleIsSoloOrTeamDriverSelected(
                        value,
                        DriverModalStringEnum.SOLO
                    );
            });

        this.driverForm
            .get(DriverModalStringEnum.TEAM_DRIVER)
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (this.fleetType === DriverModalStringEnum.COMBINED)
                    this.handleIsSoloOrTeamDriverSelected(
                        value,
                        DriverModalStringEnum.TEAM
                    );
            });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        if (data.action === TableStringEnum.CLOSE) return;

        if (data.action === TableStringEnum.DEACTIVATE && this.editData) {
            const mappedEvent = {
                ...this.editData,
                data: {
                    ...this.editData.data,
                    name: this.editData.data?.fullName,
                },
            };

            this.ngbActiveModal.close();

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.DRIVER,
                    type: data.bool
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    image: true,
                }
            );
        }
        // save and add new
        else if (data.action === DriverModalStringEnum.SAVE_AND_ADD_NEW) {
            if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);

                return;
            }

            this.addDriver();

            this.modalService.setModalSpinner({
                action: DriverModalStringEnum.SAVE_AND_ADD_NEW,
                status: true,
                close: false,
            });

            this.isAddNewAfterSave = true;
        }
        // save or update and close
        else if (data.action === TableStringEnum.SAVE) {
            if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);

                return;
            }

            // update
            if (this.editData?.id) {
                this.updateDriver(this.editData.id);

                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: false,
                });
            }

            // save
            else {
                this.addDriver();

                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: false,
                });
            }
        }
        // delete
        else if (data.action === TableStringEnum.DELETE && this.editData?.id) {
            const mappedEvent = {
                ...this.editData,
                data: {
                    ...this.editData.data,
                    name: this.editData.data?.fullName,
                },
            };

            this.ngbActiveModal.close();

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.DRIVER,
                    type: TableStringEnum.DELETE,
                    image: true,
                }
            );
        }
    }

    public onTabChange(event: Tabs): void {
        this.selectedTabId = event.id;

        this.mainTabs = this.mainTabs?.map((tab) => {
            return {
                ...tab,
                checked: tab.id === event?.id,
            };
        });

        this.uploadFileService.visibilityDropZone(this.selectedTabId === 2);

        const dotAnimation = document.querySelector(
            DriverModalStringEnum.ANIMATION_TWO_TABS_CLASS
        );

        this.animationObject = {
            value: this.selectedTabId,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };

        if (this.selectedTabId === 1) {
            this.dropZoneConfig =
                DriverModalConstants.DROPZONE_CONFIG_BASIC_TAB;
        } else {
            this.dropZoneConfig =
                DriverModalConstants.DROPZONE_CONFIG_ADDITIONAL_TAB;
        }
    }

    public onOwnerTabChange(event: Tabs): void {
        if (event) {
            this.driverForm
                .get(DriverModalStringEnum.OWNER_TYPE)
                .patchValue(event.name);

            if (
                this.driverForm.get(DriverModalStringEnum.IS_OWNER).value &&
                event.name === DriverModalStringEnum.COMPANY
            ) {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.EIN),
                    true,
                    [einNumberRegex],
                    false
                );

                this.einNumberChange();
            } else {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.EIN),
                    false,
                    [],
                    false
                );
            }
        }

        this.ownerTabs = this.ownerTabs?.map((ownerTab) => {
            return {
                ...ownerTab,
                checked: ownerTab.id === event.id,
            };
        });
    }

    public onPayrolltTabChange(event: Tabs): void {
        if (event) {
            this.driverForm
                .get(DriverModalStringEnum.PAYROLL_TYPE)
                .patchValue(event.name);
        }

        this.payrollTabs = this.payrollTabs?.map((payrollTab) => {
            return {
                ...payrollTab,
                checked: payrollTab.id === event?.id,
            };
        });
    }

    public onSelectDropdown(event: EnumValue, action: string): void {
        switch (action) {
            case DriverModalStringEnum.BANK:
                this.selectedBank = event;

                if (!event)
                    this.driverForm
                        .get(DriverModalStringEnum.BANK_ID)
                        .patchValue(null);

                this.onBankSelected();

                break;
            case DriverModalStringEnum.PAY_TYPE:
                this.onSelectPayTypeDropdown(event);

                break;
            default:
                break;
        }
    }

    private onSelectPayTypeDropdown(event: any): void {
        const requiredFields = [
            DriverModalStringEnum.SOLO_EMPTY_MILE,
            DriverModalStringEnum.SOLO_LOADED_MILE,
            DriverModalStringEnum.PER_MILE_SOLO,
            DriverModalStringEnum.TEAM_EMPTY_MILE,
            DriverModalStringEnum.TEAM_LOADED_MILE,
            DriverModalStringEnum.PER_MILE_TEAM,
            DriverModalStringEnum.SOLO_FLAT_RATE,
            DriverModalStringEnum.TEAM_FLAT_RATE,
        ];

        this.selectedPayType = event;

        // first remove all requred
        requiredFields.forEach((field) => {
            this.inputService.changeValidators(
                this.driverForm.get(field),
                false,
                [],
                false
            );
        });

        // per mile
        if (this.selectedPayType?.id === 1) {
            const soloFields = [
                DriverModalStringEnum.PER_MILE_SOLO,
                DriverModalStringEnum.SOLO_EMPTY_MILE,
                DriverModalStringEnum.SOLO_LOADED_MILE,
                DriverModalStringEnum.SOLO_PER_STOP,
            ];
            const teamFields = [
                DriverModalStringEnum.PER_MILE_TEAM,
                DriverModalStringEnum.TEAM_EMPTY_MILE,
                DriverModalStringEnum.TEAM_LOADED_MILE,
                DriverModalStringEnum.TEAM_PER_STOP,
            ];

            if (this.fleetType === DriverModalStringEnum.SOLO) {
                const fields = this.hasMilesSameRate
                    ? [soloFields[0]]
                    : soloFields.slice(1);

                fields.forEach((field, index) => {
                    if (index < 3) {
                        this.inputService.changeValidators(
                            this.driverForm.get(field)
                        );
                    }

                    this.driverForm
                        .get(field)
                        .patchValue(this.payrollCompany[field]);
                });
            } else if (this.fleetType === DriverModalStringEnum.TEAM) {
                const fields = this.hasMilesSameRate
                    ? [teamFields[0]]
                    : teamFields.slice(1);

                fields.forEach((field, index) => {
                    if (index < 3) {
                        this.inputService.changeValidators(
                            this.driverForm.get(field)
                        );
                    }

                    this.driverForm
                        .get(field)
                        .patchValue(this.payrollCompany[field]);
                });
            } else if (this.fleetType === DriverModalStringEnum.COMBINED) {
                const fields = this.hasMilesSameRate
                    ? [soloFields[0], teamFields[0]]
                    : [...soloFields.slice(1), ...teamFields.slice(1)];

                fields.forEach((field, index) => {
                    if (index < 3) {
                        this.inputService.changeValidators(
                            this.driverForm.get(field)
                        );
                    }

                    this.driverForm
                        .get(field)
                        .patchValue(this.payrollCompany[field]);
                });
            }
        }
        // commission
        else if (this.selectedPayType?.id === 2) {
            if (
                this.fleetType === DriverModalStringEnum.SOLO ||
                this.fleetType === DriverModalStringEnum.TEAM
            ) {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.DRIVER_COMMISSION)
                );

                if (this.fleetType === DriverModalStringEnum.SOLO) {
                    this.driverForm
                        .get(DriverModalStringEnum.DRIVER_COMMISSION)
                        .patchValue(
                            this.payrollCompany[
                                DriverModalStringEnum.COMMISSION_SOLO
                            ]
                        );
                } else {
                    this.driverForm
                        .get(DriverModalStringEnum.DRIVER_COMMISSION)
                        .patchValue(
                            this.payrollCompany[
                                DriverModalStringEnum.COMMISSION_TEAM
                            ]
                        );
                }
            } else {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.COMMISSION_SOLO)
                );

                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.COMMISSION_TEAM)
                );

                this.driverForm.patchValue({
                    commissionSolo:
                        this.payrollCompany[
                            DriverModalStringEnum.COMMISSION_SOLO
                        ],
                    commissionTeam:
                        this.payrollCompany[
                            DriverModalStringEnum.COMMISSION_TEAM
                        ],
                });
            }
        }
        // flat rate
        else if (this.selectedPayType?.id === 3) {
            if (this.fleetType === DriverModalStringEnum.SOLO) {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.SOLO_FLAT_RATE)
                );
            } else if (this.fleetType === DriverModalStringEnum.TEAM) {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.TEAM_FLAT_RATE)
                );
            } else if (this.fleetType === DriverModalStringEnum.COMBINED) {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.SOLO_FLAT_RATE)
                );
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.TEAM_FLAT_RATE)
                );
            }
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
            this.longitude = event.longLat.longitude;
            this.latitude = event.longLat.latitude;
        }
    }

    public onSaveNewBank(bank: { data: any; action: string }): void {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.banksDropdownList = [
                        ...this.banksDropdownList,
                        this.selectedBank,
                    ];
                },
                error: () => {},
            });
    }

    private onBankSelected(): void {
        this.driverForm
            .get(DriverModalStringEnum.BANK_ID)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.driverForm.get('routing'),
                            this.driverForm.get('account')
                        );

                    clearTimeout(timeout);
                }, 100);
            });
    }

    public onUploadImage(event: any): void {
        this.driverForm.get('avatar').patchValue(event);
        this.driverForm.get('avatar').setErrors(null);
    }

    public onImageValidation(event: boolean): void {
        if (!event) {
            this.driverForm.get('avatar').setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.driverForm.get('avatar'),
                false
            );
        }
    }

    public onFilesEvent(event: any): void {
        switch (event.action) {
            case 'add':
                this.documents = event.files;

                this.driverForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));

                break;
            case 'delete':
                this.documents = event.files;

                this.driverForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.isFileModified = true;

                break;
            case 'tag':
                let changedTag = false;

                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.driverForm
                    .get('tags')
                    .patchValue(changedTag ? true : null);

                break;
            default:
                break;
        }
    }

    public addOffDutyLocation(): void {
        if (
            !this.isEachOffDutyLocationRowValid ||
            this.offDutyLocationItems?.length === 8
        )
            return;

        this.isOffDutyLocationRowCreated = true;

        setTimeout(() => {
            this.isOffDutyLocationRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(
        modalTableDataValue: OffDutyLocationResponse[]
    ): void {
        this.offDutyLocationItems = modalTableDataValue;

        this.driverForm
            .get(DriverModalStringEnum.OFF_DUTY_LOCATION_ITEMS)
            .patchValue(JSON.stringify(this.offDutyLocationItems));

        this.changeDetector.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachOffDutyLocationRowValid: boolean
    ): void {
        this.isEachOffDutyLocationRowValid = isEachOffDutyLocationRowValid;
    }

    public handleSliderValueChange(
        event: ChangeContext | number,
        type: string
    ) {
        this.driverForm.get(type).patchValue(event);
    }

    private handlePayrollDefaultValueCombinations(
        dataSolo: PerMileEntity,
        soloFlatRate: number,
        perMileSolo: number,
        defaultSoloDriverCommission: number,
        dataTeam: PerMileEntity,
        teamFlatRate: number,
        perMileTeam: number,
        defaultTeamDriverCommission: number
    ): void {
        if (
            [
                DriverModalStringEnum.SOLO,
                DriverModalStringEnum.COMBINED,
            ].includes(this.fleetType as DriverModalStringEnum)
        ) {
            this.driverForm.patchValue({
                soloEmptyMile: dataSolo.emptyMile,
                soloLoadedMile: dataSolo.loadedMile,
                soloPerStop: dataSolo.perStop
                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                          dataSolo.perStop
                      )
                    : null,
                soloFlatRate: soloFlatRate
                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                          soloFlatRate
                      )
                    : null,
                perMileSolo,
                ...(defaultSoloDriverCommission && {
                    commissionSolo: defaultSoloDriverCommission,
                }),
            });
        }

        if (
            [
                DriverModalStringEnum.TEAM,
                DriverModalStringEnum.COMBINED,
            ].includes(this.fleetType as DriverModalStringEnum)
        ) {
            this.driverForm.patchValue(
                {
                    teamEmptyMile: dataTeam.emptyMile,
                    teamLoadedMile: dataTeam.loadedMile,
                    teamPerStop: dataTeam.perStop
                        ? MethodsCalculationsHelper.convertNumberInThousandSep(
                              dataTeam.perStop
                          )
                        : null,
                    teamFlatRate: teamFlatRate
                        ? MethodsCalculationsHelper.convertNumberInThousandSep(
                              teamFlatRate
                          )
                        : null,
                    perMileTeam,
                    ...(defaultTeamDriverCommission && {
                        commissionTeam: defaultTeamDriverCommission,
                    }),
                },
                {
                    emitEvent: false,
                }
            );
        }
    }

    public handlePayrollFleetType(
        fleetType: string,
        dropdownsInit: boolean = false
    ): void {
        if (fleetType === DriverModalStringEnum.COMBINED) {
            if (dropdownsInit) {
                this.driverForm.get('teamDriver').patchValue(true);
                this.driverForm
                    .get(DriverModalStringEnum.SOLO_DRIVER)
                    .patchValue(true);
            }

            this.driverForm
                .get(DriverModalStringEnum.SOLO_DRIVER)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    if (
                        !value &&
                        !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                            .value
                    ) {
                        this.driverForm.get('teamDriver').patchValue(true);

                        this.inputService.changeValidators(
                            this.driverForm.get(
                                DriverModalStringEnum.SOLO_EMPTY_MILE
                            ),
                            false,
                            [],
                            false
                        );

                        this.inputService.changeValidators(
                            this.driverForm.get(
                                DriverModalStringEnum.SOLO_LOADED_MILE
                            ),
                            false,
                            [],
                            false
                        );
                    }
                });

            this.driverForm
                .get('teamDriver')
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    if (
                        !value &&
                        !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                            .value
                    ) {
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_DRIVER)
                            .patchValue(true);

                        this.inputService.changeValidators(
                            this.driverForm.get(
                                DriverModalStringEnum.TEAM_EMPTY_MILE
                            ),
                            false,
                            [],
                            false
                        );

                        this.inputService.changeValidators(
                            this.driverForm.get(
                                DriverModalStringEnum.TEAM_LOADED_MILE
                            ),
                            false,
                            [],
                            false
                        );
                    }
                });
        }
    }

    private handleIsSoloOrTeamDriverSelected(
        isSelected: boolean,
        type: string
    ): void {
        let inputFields: string[];
        let options: SoloTeamSelectedOptions = {
            inputField: null,
            sliderOptions: {},
        };

        switch (this.selectedPayType?.name) {
            case DriverModalStringEnum.PER_MILE:
                inputFields =
                    type === DriverModalStringEnum.SOLO
                        ? [
                              DriverModalStringEnum.SOLO_EMPTY_MILE,
                              DriverModalStringEnum.SOLO_LOADED_MILE,
                              DriverModalStringEnum.PER_MILE_SOLO,
                              DriverModalStringEnum.SOLO_PER_STOP,
                          ]
                        : [
                              DriverModalStringEnum.TEAM_EMPTY_MILE,
                              DriverModalStringEnum.TEAM_LOADED_MILE,
                              DriverModalStringEnum.PER_MILE_TEAM,
                              DriverModalStringEnum.TEAM_PER_STOP,
                          ];

                options.inputField = this.hasMilesSameRate ? 10 : 0 || 1;

                break;
            case DriverModalStringEnum.COMMISSION:
                inputFields =
                    type === DriverModalStringEnum.SOLO
                        ? [DriverModalStringEnum.COMMISSION_SOLO]
                        : [DriverModalStringEnum.COMMISSION_TEAM];

                options.sliderOptions.floor = isSelected ? 10 : 0;

                break;
            case DriverModalStringEnum.FLAT_RATE:
                inputFields =
                    type === DriverModalStringEnum.SOLO
                        ? [DriverModalStringEnum.SOLO_FLAT_RATE]
                        : [DriverModalStringEnum.TEAM_FLAT_RATE];

                break;
            default:
                break;
        }

        this.handleSoloOrTeamDriverSelectedData(inputFields, isSelected, {
            ...options,
        });
    }

    private handleSoloOrTeamDriverSelectedData(
        requiredFields: string[],
        isSelected: boolean,
        options?: SoloTeamSelectedOptions
    ): void {
        requiredFields?.forEach((field, index) => {
            const fieldControl = this.driverForm.get(field);

            if (isSelected) {
                if (index === options?.inputField)
                    this.inputService.changeValidators(fieldControl);

                fieldControl.patchValue(this.payrollCompany[field]);
            } else {
                this.inputService.changeValidators(fieldControl, false);

                fieldControl.patchValue(null);
            }
        });

        if (requiredFields?.includes(DriverModalStringEnum.COMMISSION_SOLO))
            this.soloSliderOptions = {
                ...this.soloSliderOptions,
                ...options.sliderOptions,
            };

        if (requiredFields?.includes(DriverModalStringEnum.COMMISSION_TEAM))
            this.teamSliderOptions = {
                ...this.teamSliderOptions,
                ...options.sliderOptions,
            };
    }

    public validateMiles(): void {
        if (
            [
                DriverModalStringEnum.SOLO,
                DriverModalStringEnum.COMBINED,
            ].includes(this.fleetType as DriverModalStringEnum)
        ) {
            this.driverForm
                .get(DriverModalStringEnum.SOLO_EMPTY_MILE)
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_EMPTY_MILE)
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_EMPTY_MILE)
                            .setErrors(null);
                    }
                });

            this.driverForm
                .get(DriverModalStringEnum.SOLO_LOADED_MILE)
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_LOADED_MILE)
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_LOADED_MILE)
                            .setErrors(null);

                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_EMPTY_MILE)
                            .patchValue(value);
                    }
                });
        }

        if (
            [
                DriverModalStringEnum.TEAM,
                DriverModalStringEnum.COMBINED,
            ].includes(this.fleetType as DriverModalStringEnum)
        ) {
            this.driverForm
                .get(DriverModalStringEnum.TEAM_EMPTY_MILE)
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_EMPTY_MILE)
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_EMPTY_MILE)
                            .setErrors(null);
                    }
                });

            this.driverForm
                .get(DriverModalStringEnum.TEAM_LOADED_MILE)
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_LOADED_MILE)
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_LOADED_MILE)
                            .setErrors(null);

                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_EMPTY_MILE)
                            .patchValue(value);
                    }
                });
        }
    }

    private einNumberChange(): void {
        this.driverForm
            .get(DriverModalStringEnum.EIN)
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value?.length === 10) {
                    this.isOwnerEinLoading = true;

                    this.driverService
                        .checkOwnerEinNumber(value.toString())
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: CheckOwnerSsnEinResponse) => {
                                this.selectedOwner = res?.name ? res : null;

                                this.isOwnerEinLoading = false;

                                if (this.selectedOwner?.name) {
                                    this.driverForm
                                        .get('bussinesName')
                                        .patchValue(this.selectedOwner.name);
                                }
                            },
                            error: () => {},
                        });
                } else {
                    this.driverForm.get('bussinesName').patchValue(null);
                }
            });
    }

    private createAddOrUpdateDriverPayrollProperties(
        soloEmptyMile: string,
        soloLoadedMile: string,
        soloPerStop: string,
        perMileSolo: string,
        teamEmptyMile: string,
        teamLoadedMile: string,
        teamPerStop: string,
        perMileTeam: string,
        commissionSolo: string,
        commissionTeam: string,
        soloFlatRate: string,
        teamFlatRate: string
    ): AddUpdateDriverPayrollProperties {
        const convertedSoloEmptyMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            !this.hasMilesSameRate &&
            soloEmptyMile
                ? parseFloat(soloEmptyMile)
                : null;

        const convertedSoloLoadedMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            !this.hasMilesSameRate &&
            soloLoadedMile
                ? parseFloat(soloLoadedMile)
                : null;

        const convertedSoloPerStop =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            soloPerStop
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      soloPerStop
                  )
                : null;

        const convertedPerMileSolo =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            this.hasMilesSameRate &&
            perMileSolo
                ? parseFloat(perMileSolo)
                : null;

        const convertedTeamEmptyMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            !this.hasMilesSameRate &&
            teamEmptyMile
                ? parseFloat(teamEmptyMile)
                : null;

        const convertedTeamLoadedMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            !this.hasMilesSameRate &&
            teamLoadedMile
                ? parseFloat(teamLoadedMile)
                : null;

        const convertedTeamPerStop =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            teamPerStop
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      teamPerStop
                  )
                : null;

        const convertedPerMileTeam =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
            this.hasMilesSameRate &&
            perMileTeam
                ? parseFloat(perMileTeam)
                : null;

        const convertedCommissionSolo =
            this.selectedPayType?.name === DriverModalStringEnum.COMMISSION &&
            commissionSolo
                ? parseFloat(commissionSolo)
                : null;

        const convertedCommissionTeam =
            this.selectedPayType?.name === DriverModalStringEnum.COMMISSION &&
            commissionTeam
                ? parseFloat(commissionTeam)
                : null;

        const convertedSoloFlatRate =
            this.selectedPayType?.name === DriverModalStringEnum.FLAT_RATE &&
            soloFlatRate
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      soloFlatRate
                  )
                : null;

        const convertedTeamFlatRate =
            this.selectedPayType?.name === DriverModalStringEnum.FLAT_RATE &&
            teamFlatRate
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      teamFlatRate
                  )
                : null;

        return {
            convertedSoloEmptyMile,
            convertedSoloLoadedMile,
            convertedSoloPerStop,
            convertedPerMileSolo,
            convertedTeamEmptyMile,
            convertedTeamLoadedMile,
            convertedTeamPerStop,
            convertedPerMileTeam,
            convertedCommissionSolo,
            convertedCommissionTeam,
            convertedSoloFlatRate,
            convertedTeamFlatRate,
        };
    }

    private createAddOrUpdateDriverProperties(
        dateOfBirth: string,
        addressUnit: string,
        isOwner: boolean,
        ownerType: string,
        ein: string,
        bussinesName: string,
        soloDriver: boolean,
        teamDriver: boolean,
        twic: boolean,
        twicExpDate: string
    ): AddUpdateDriverProperties {
        // date
        const convertedDate =
            MethodsCalculationsHelper.convertDateToBackend(dateOfBirth);

        // address
        this.selectedAddress = {
            ...this.selectedAddress,
            addressUnit,
        };

        // owner type
        const conditionalOwnerType = !isOwner
            ? null
            : ownerType === DriverModalStringEnum.SOLE_PROPRIETOR
            ? 'Proprietor'
            : 'Company';

        // owner id
        const conditionalOwnerId =
            ownerType === DriverModalStringEnum.SOLE_PROPRIETOR
                ? null
                : this.selectedOwner?.id || null;

        // ein
        const conditionalEin =
            !isOwner || ownerType === DriverModalStringEnum.SOLE_PROPRIETOR
                ? null
                : ein;

        // bussines name
        const conditionalBussinesName =
            !isOwner || ownerType === DriverModalStringEnum.SOLE_PROPRIETOR
                ? null
                : bussinesName;

        // payroll
        const conditionalSoloDriver = !isOwner
            ? this.fleetType === DriverModalStringEnum.COMBINED
                ? soloDriver
                : false
            : null;
        const conditionalTeamDriver = !isOwner
            ? this.fleetType === DriverModalStringEnum.COMBINED
                ? teamDriver
                : false
            : null;

        // twic
        const conditionalTwicExpDate = twic
            ? MethodsCalculationsHelper.convertDateToBackend(twicExpDate)
            : null;

        // documents
        const convertedDocuments = [];
        let convertedTagsArray = [];

        this.documents.map((item) => {
            if (item.tagId?.length)
                convertedTagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) convertedDocuments.push(item.realFile);
        });

        return {
            convertedDate,
            conditionalOwnerType,
            conditionalOwnerId,
            conditionalEin,
            conditionalBussinesName,
            conditionalSoloDriver,
            conditionalTeamDriver,
            convertedDocuments,
            convertedTagsArray,
            conditionalTwicExpDate,
        };
    }

    private updateTags(): void {
        const tags = [];

        this.documents.map((item) => {
            if (item?.tagChanged && item?.fileId) {
                const tagsData = {
                    storageId: item.fileId,
                    tagId: item.tagId?.length ? item.tagId[0] : null,
                };

                tags.push(tagsData);
            }
        });

        if (tags.length) {
            this.tagsService.updateTag({ tags: tags }).subscribe();
        }
    }

    private getDriverDropdowns(): void {
        this.driverService
            .getDriverDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: GetDriverModalResponse) => {
                if (data) {
                    this.banksDropdownList = data.banks;
                    this.payTypeDropdownList = data.payTypes;

                    this.tags = data.tags;

                    this.fleetType = data.fleetType;
                    this.hasMilesSameRate = data.loadedAndEmptySameRate;

                    this.driverForm.patchValue({
                        mvrExpiration: data.mvrExpiration,
                        ...(this.fleetType !==
                            DriverModalStringEnum.COMBINED && {
                            driverCommission:
                                data.defaultSoloDriverCommission ||
                                data.defaultTeamDriverCommission,
                        }),
                    });

                    this.handlePayrollDefaultValueCombinations(
                        data.solo,
                        data.soloFlatRate,
                        data.perMileSolo,
                        data.defaultSoloDriverCommission,
                        data.team,
                        data.teamFlatRate,
                        data.perMileTeam,
                        data.defaultTeamDriverCommission
                    );

                    this.payrollCompany = {
                        soloEmptyMile: data.solo.emptyMile,
                        soloLoadedMile: data.solo.loadedMile,
                        perMileSolo: data.perMileSolo,
                        soloPerStop: data.solo.perStop
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  data.solo.perStop
                              )
                            : null,
                        commissionSolo:
                            data.defaultSoloDriverCommission ??
                            this.driverForm.get('commissionSolo').value,
                        soloFlatRate: data.soloFlatRate
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  data.soloFlatRate
                              )
                            : null,

                        teamEmptyMile: data.team.emptyMile,
                        teamLoadedMile: data.team.loadedMile,
                        perMileTeam: data.perMileTeam,
                        teamPerStop: data.team.perStop
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  data.team.perStop
                              )
                            : null,
                        commissionTeam:
                            data.defaultTeamDriverCommission ??
                            this.driverForm.get('commissionTeam').value,
                        teamFlatRate: data.teamFlatRate
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  data.teamFlatRate
                              )
                            : null,
                        mvrExpiration: data.mvrExpiration ?? 12,
                    };

                    this.handlePayrollFleetType(this.fleetType, true);

                    if (this.editData) {
                        this.isCardAnimationDisabled = true;

                        this.editDriverById(this.editData.data);
                    } else {
                        this.startFormChanges();
                    }
                }
            });
    }

    private editDriverById(editData: DriverResponse): void {
        console.log('editData', editData);
        const {
            firstName,
            lastName,
            dateOfBirth,
            phone,
            email,
            ssn,
            address,
            payType,
            soloDriver,
            teamDriver,
            solo,
            perMileSolo,
            team,
            perMileTeam,
            commissionSolo,
            commissionTeam,
            soloFlatRate,
            teamFlatRate,
        } = editData;

        // address
        this.onHandleAddress({
            address,
            valid: !!address,
            longLat: {
                longitude: null,
                latitude: null,
            },
        });

        // pay type
        this.selectedPayType = payType;

        // patch form
        this.driverForm.patchValue({
            firstName,
            lastName,
            dateOfBirth:
                MethodsCalculationsHelper.convertDateFromBackend(dateOfBirth),
            phone,
            email,
            ssn,
            address: address?.address,
            addressUnit: address?.addressUnit,
            payType: payType?.name,
            soloDriver,
            teamDriver,
            soloEmptyMile: solo?.emptyMile,
            soloLoadedMile: solo?.loadedMile,
            soloPerStop: solo?.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                      solo?.perStop
                  )
                : null,
            perMileSolo,
            teamEmptyMile: team?.emptyMile,
            teamLoadedMile: team?.loadedMile,
            teamPerStop: team?.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                      team?.perStop
                  )
                : null,
            perMileTeam,
            commissionSolo,
            commissionTeam,
            driverCommision: this.fleetType === DriverModalStringEnum.SOLO?commissionSolo :this.fleetType ===DriverModalStringEnum.TEAM?commissionTeam:null,
            soloFlatRate,
            teamFlatRate,
            /* 
           
            mvrExpiration: editData.mvrExpiration,
            bankId: editData.bank ? editData.bank.name : null,
            account: editData.account,
            routing: editData.routing,
           
      
           
            teamPerStop: editData.team.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                      editData.team.perStop
                  )
                : null,
           
          
            ownerId: editData.owner ? editData.owner.id : null,
            useCarrieraACH: editData.useTruckAssistAch,
            isOwner: !!editData.owner,
            ownerType: editData.owner
                ? editData.owner?.ownerType?.name
                    ? editData.owner?.ownerType?.name.includes('Proprietor')
                        ? 'Sole'.concat(' ', editData.owner?.ownerType?.name)
                        : editData.owner?.ownerType?.name
                    : null
                : null,
            ein: editData.owner
                ? editData.owner?.ownerType?.name.includes('Proprietor')
                    ? null
                    : editData.owner?.ssnEin
                : null,
            bussinesName: editData.owner
                ? editData.owner?.ownerType?.name.includes('Proprietor')
                    ? null
                    : editData.owner?.name
                : null,
            emergencyContactName: editData.emergencyContactName,
            emergencyContactPhone: editData.emergencyContactPhone,
            emergencyContactRelationship: editData.emergencyContactRelationship,

            note: editData.note,
            avatar: editData.avatar ? editData.avatar : null,

            twic: editData.twic,
            twicExpDate: editData.twicExpDate
                ? MethodsCalculationsHelper.convertDateFromBackend(
                      editData.twicExpDate
                  )
                : null,
            fuelCard: editData.fuelCard,

            mailNotificationGeneral: editData.general.mailNotification,
            pushNotificationGeneral: editData.general.pushNotification,
            smsNotificationGeneral: editData.general.smsNotification,

            mailNotificationPayroll: editData.payroll.mailNotification,
            pushNotificationPayroll: editData.payroll.pushNotification,
            smsNotificationPayroll: editData.payroll.smsNotification,
            files: editData.files?.length
                ? JSON.stringify(editData.files)
                : null, */
        });

        /*

        
         
       

        editData.firstName =
            editData.firstName.charAt(0).toUpperCase() +
            editData.firstName.slice(1);

        editData.lastName =
            editData.lastName.charAt(0).toUpperCase() +
            editData.lastName.slice(1);

        this.driverFullName = editData.firstName.concat(' ', editData.lastName);

        this.selectedBank = editData.bank ? editData.bank : null;

        this.isBankSelected = !!this.selectedBank;

        this.documents = editData.files;

       
      

        this.modalService.changeModalStatus({
            name: 'deactivate',
            status: editData.status !== 1,
        });

        this.driverStatus = editData.status !== 1;

        this.fleetType = editData.fleetType.name;

        this.handlePayrollFleetType(this.fleetType);

        if (editData.owner) {
            if (this.driverForm.get(DriverModalStringEnum.EIN).value) {
                this.einNumberChange();
            }

            const activeOwnerTab = this.ownerTabs
                .map((item) => {
                    return {
                        ...item,
                        checked: editData.owner?.ownerType.name === item.name,
                    };
                })
                .find((item) => item.checked);

            if (activeOwnerTab) {
                this.onOwnerTabChange(activeOwnerTab);
            }
        } */

        setTimeout(() => {
            this.startFormChanges();

            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    private addDriver(): void {
        const {
            // eslint-disable-next-line no-unused-vars
            address, // eslint-disable-next-line no-unused-vars
            ownerId, // eslint-disable-next-line no-unused-vars
            payType, // eslint-disable-next-line no-unused-vars
            driverCommission, // eslint-disable-next-line no-unused-vars
            bankId, // eslint-disable-next-line no-unused-vars
            offDutyLocationItems, // eslint-disable-next-line no-unused-vars
            files, // eslint-disable-next-line no-unused-vars
            tags,

            dateOfBirth,
            addressUnit,
            isOwner,
            ownerType,
            ein,
            bussinesName,
            useCarrieraACH,
            twic,
            twicExpDate,
            mailNotificationGeneral,
            pushNotificationGeneral,
            smsNotificationGeneral,
            mailNotificationPayroll,
            pushNotificationPayroll,
            smsNotificationPayroll,

            soloDriver,
            teamDriver,

            soloEmptyMile,
            soloLoadedMile,
            soloPerStop,
            perMileSolo,
            commissionSolo,

            teamEmptyMile,
            teamLoadedMile,
            teamPerStop,
            perMileTeam,
            commissionTeam,

            soloFlatRate,
            teamFlatRate,

            ...form
        } = this.driverForm.value;

        console.log('...form', form);

        const {
            convertedDate,
            conditionalOwnerType,
            conditionalOwnerId,
            conditionalEin,
            conditionalBussinesName,
            conditionalSoloDriver,
            conditionalTeamDriver,
            convertedDocuments,
            convertedTagsArray,
            conditionalTwicExpDate,
        } = this.createAddOrUpdateDriverProperties(
            dateOfBirth,
            addressUnit,
            isOwner,
            ownerType,
            ein,
            bussinesName,
            soloDriver,
            teamDriver,
            twic,
            twicExpDate
        );

        const {
            convertedSoloEmptyMile,
            convertedSoloLoadedMile,
            convertedSoloPerStop,
            convertedPerMileSolo,
            convertedTeamEmptyMile,
            convertedTeamLoadedMile,
            convertedTeamPerStop,
            convertedPerMileTeam,
            convertedCommissionSolo,
            convertedCommissionTeam,
            convertedSoloFlatRate,
            convertedTeamFlatRate,
        } = this.createAddOrUpdateDriverPayrollProperties(
            soloEmptyMile,
            soloLoadedMile,
            soloPerStop,
            perMileSolo,
            teamEmptyMile,
            teamLoadedMile,
            teamPerStop,
            perMileTeam,
            commissionSolo,
            commissionTeam,
            soloFlatRate,
            teamFlatRate
        );

        const newData = {
            ...form,

            dateOfBirth: convertedDate,
            address: this.selectedAddress,
            longitude: this.longitude,
            latitude: this.latitude,

            ownerType: conditionalOwnerType,
            ownerId: conditionalOwnerId,
            ein: conditionalEin,
            bussinesName: conditionalBussinesName,

            useTruckAssistAch: useCarrieraACH,
            payType: this.selectedPayType?.id ?? null,

            soloDriver: conditionalSoloDriver,
            teamDriver: conditionalTeamDriver,

            solo: {
                emptyMile: convertedSoloEmptyMile,
                loadedMile: convertedSoloLoadedMile,
                perStop: convertedSoloPerStop,
            },
            perMileSolo: convertedPerMileSolo,

            team: {
                emptyMile: convertedTeamEmptyMile,
                loadedMile: convertedTeamLoadedMile,
                perStop: convertedTeamPerStop,
            },
            perMileTeam: convertedPerMileTeam,

            commissionSolo: convertedCommissionSolo,
            commissionTeam: convertedCommissionTeam,

            soloFlatRate: convertedSoloFlatRate,
            teamFlatRate: convertedTeamFlatRate,

            fleetType: this.fleetType,

            bankId: this.selectedBank?.id ?? null,

            offDutyLocations: this.offDutyLocationItems,

            files: convertedDocuments,
            tags: convertedTagsArray,

            twicExpDate: conditionalTwicExpDate,

            general: {
                mailNotification: mailNotificationGeneral,
                pushNotification: pushNotificationGeneral,
                smsNotification: smsNotificationGeneral,
            },
            payroll: {
                mailNotification: mailNotificationPayroll,
                pushNotification: pushNotificationPayroll,
                smsNotification: smsNotificationPayroll,
            },
        };

        console.log('newData', newData);

        this.driverService
            .addDriver(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    // If clicked Save and Add New, reset form and fields
                    if (this.isAddNewAfterSave) {
                        this.formService.resetForm(this.driverForm);
                        this.modalService.setModalSpinner({
                            action: DriverModalStringEnum.SAVE_AND_ADD_NEW,
                            status: false,
                            close: false,
                        });
                        this.driverForm
                            .get(DriverModalStringEnum.OWNER_TYPE)
                            .patchValue(null);
                        this.driverForm.get('payType').patchValue(null);

                        this.onTabChange({ id: 1 });

                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_EMPTY_MILE)
                            .patchValue(this.payrollCompany.solo.emptyMile);
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_LOADED_MILE)
                            .patchValue(this.payrollCompany.solo.loadedMile);
                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_PER_STOP)
                            .patchValue(this.payrollCompany.solo.perStop);
                        this.driverForm
                            .get(DriverModalStringEnum.PER_MILE_SOLO)
                            .patchValue(this.payrollCompany.solo.perMileSolo);
                        this.driverForm
                            .get('commissionSolo')
                            .patchValue(
                                this.payrollCompany.solo.commissionSolo
                            );

                        this.driverForm
                            .get(DriverModalStringEnum.SOLO_FLAT_RATE)
                            .patchValue(this.payrollCompany.solo.soloFlatRate);

                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_EMPTY_MILE)
                            .patchValue(this.payrollCompany.team.emptyMile);
                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_LOADED_MILE)
                            .patchValue(this.payrollCompany.team.loadedMile);
                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_PER_STOP)
                            .patchValue(this.payrollCompany.team.perStop);
                        this.driverForm
                            .get(DriverModalStringEnum.PER_MILE_TEAM)
                            .patchValue(this.payrollCompany.team.perMileTeam);
                        this.driverForm
                            .get('commissionTeam')
                            .patchValue(
                                this.payrollCompany.team.commissionTeam
                            );

                        this.driverForm
                            .get(DriverModalStringEnum.TEAM_FLAT_RATE)
                            .patchValue(this.payrollCompany.team.teamFlatRate);

                        this.driverForm
                            .get(DriverModalStringEnum.MVR_EXPIRATION)
                            .patchValue(this.payrollCompany.mvrExpiration);

                        this.driverForm
                            .get('mailNotificationGeneral')
                            .patchValue(true);
                        this.driverForm
                            .get('mailNotificationPayroll')
                            .patchValue(true);
                        this.driverForm
                            .get('smsNotificationGeneral')
                            .patchValue(false);
                        this.driverForm
                            .get('smsNotificationPayroll')
                            .patchValue(false);
                        this.driverForm
                            .get('pushNotificationGeneral')
                            .patchValue(false);
                        this.driverForm
                            .get('pushNotificationPayroll')
                            .patchValue(false);

                        this.driverForm.get('useCarrieraACH').patchValue(false);

                        this.driverForm
                            .get(DriverModalStringEnum.TWIC)
                            .patchValue(false);

                        this.driverForm
                            .get(DriverModalStringEnum.IS_OWNER)
                            .patchValue(false);

                        if (this.fleetType === DriverModalStringEnum.COMBINED) {
                            this.driverForm.get('teamDriver').patchValue(true);
                            this.driverForm
                                .get(DriverModalStringEnum.SOLO_DRIVER)
                                .patchValue(true);
                        }

                        this.documents = [];
                        this.isFileModified = false;
                        this.filesForDelete = [];
                        this.tags = [];

                        this.isAddNewAfterSave = false;
                        this.selectedPayType = null;
                        this.selectedBank = null;
                        this.selectedAddress = null;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: this.isAddNewAfterSave
                            ? DriverModalStringEnum.SAVE_AND_ADD_NEW
                            : null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateDriver(id: number): void {
        const {
            soloEmptyMile,
            soloLoadedMile,
            soloPerStop,
            perMileSolo,
            commissionSolo,

            teamEmptyMile,
            teamLoadedMile,
            teamPerStop,
            perMileTeam,
            commissionTeam,

            soloFlatRate,
            teamFlatRate,

            mvrExpiration,

            soloDriver,
            teamDriver,

            mailNotificationGeneral,
            pushNotificationGeneral,
            smsNotificationGeneral,

            mailNotificationPayroll,
            pushNotificationPayroll,
            smsNotificationPayroll,

            addressUnit,
            ...form
        } = this.driverForm.value;

        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length && item?.realFile?.name)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        const newData: any = {
            id: id,
            ...form,
            dateOfBirth: MethodsCalculationsHelper.convertDateToBackend(
                this.driverForm.get('dateOfBirth').value
            ),
            mvrExpiration: mvrExpiration,
            ownerId:
                this.driverForm.get(DriverModalStringEnum.OWNER_TYPE).value ===
                DriverModalStringEnum.SOLE_PROPRIETOR
                    ? null
                    : this.selectedOwner
                    ? this.selectedOwner.id
                    : null,
            ownerType: !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                .value
                ? null
                : this.driverForm.get(DriverModalStringEnum.OWNER_TYPE)
                      .value === DriverModalStringEnum.SOLE_PROPRIETOR
                ? 2
                : 1,
            bussinesName:
                this.driverForm.get(DriverModalStringEnum.OWNER_TYPE).value ===
                DriverModalStringEnum.SOLE_PROPRIETOR
                    ? null
                    : this.driverForm.get('bussinesName').value,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            payType: this.selectedPayType ? this.selectedPayType.id : null,
            solo: {
                emptyMile:
                    this.selectedPayType?.name ===
                    DriverModalStringEnum.PER_MILE
                        ? !this.hasMilesSameRate
                            ? [
                                  DriverModalStringEnum.SOLO,
                                  DriverModalStringEnum.COMBINED,
                              ].includes(
                                  this.fleetType as DriverModalStringEnum
                              )
                                ? this.fleetType ===
                                  DriverModalStringEnum.COMBINED
                                    ? soloDriver
                                        ? soloEmptyMile
                                            ? parseFloat(soloEmptyMile)
                                            : null
                                        : null
                                    : soloEmptyMile
                                    ? parseFloat(soloEmptyMile)
                                    : null
                                : null
                            : null
                        : null,
                loadedMile:
                    this.selectedPayType?.name ===
                    DriverModalStringEnum.PER_MILE
                        ? !this.hasMilesSameRate
                            ? [
                                  DriverModalStringEnum.SOLO,
                                  DriverModalStringEnum.COMBINED,
                              ].includes(
                                  this.fleetType as DriverModalStringEnum
                              )
                                ? this.fleetType ===
                                  DriverModalStringEnum.COMBINED
                                    ? soloDriver
                                        ? soloLoadedMile
                                            ? parseFloat(soloLoadedMile)
                                            : null
                                        : null
                                    : soloLoadedMile
                                    ? parseFloat(soloLoadedMile)
                                    : null
                                : null
                            : null
                        : null,
                perStop:
                    this.selectedPayType?.name ===
                    DriverModalStringEnum.PER_MILE
                        ? !this.hasMilesSameRate
                            ? [
                                  DriverModalStringEnum.SOLO,
                                  DriverModalStringEnum.COMBINED,
                              ].includes(
                                  this.fleetType as DriverModalStringEnum
                              )
                                ? this.fleetType ===
                                  DriverModalStringEnum.COMBINED
                                    ? soloDriver
                                        ? soloPerStop
                                            ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                                  soloPerStop
                                              )
                                            : null
                                        : null
                                    : soloPerStop
                                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                          soloPerStop
                                      )
                                    : null
                                : null
                            : null
                        : null,
            },
            perMileSolo:
                this.selectedPayType?.name === DriverModalStringEnum.PER_MILE
                    ? this.hasMilesSameRate
                        ? [
                              DriverModalStringEnum.SOLO,
                              DriverModalStringEnum.COMBINED,
                          ].includes(this.fleetType as DriverModalStringEnum)
                            ? this.fleetType === DriverModalStringEnum.COMBINED
                                ? soloDriver
                                    ? perMileSolo
                                        ? parseFloat(perMileSolo)
                                        : null
                                    : null
                                : perMileSolo
                                ? parseFloat(perMileSolo)
                                : null
                            : null
                        : null
                    : null,
            team: {
                emptyMile:
                    this.selectedPayType?.name ===
                    DriverModalStringEnum.PER_MILE
                        ? !this.hasMilesSameRate
                            ? [
                                  DriverModalStringEnum.TEAM,
                                  DriverModalStringEnum.COMBINED,
                              ].includes(
                                  this.fleetType as DriverModalStringEnum
                              )
                                ? this.fleetType ===
                                  DriverModalStringEnum.COMBINED
                                    ? teamDriver
                                        ? teamEmptyMile
                                            ? parseFloat(teamEmptyMile)
                                            : null
                                        : null
                                    : teamEmptyMile
                                    ? parseFloat(teamEmptyMile)
                                    : null
                                : null
                            : null
                        : null,
                loadedMile:
                    this.selectedPayType?.name ===
                    DriverModalStringEnum.PER_MILE
                        ? !this.hasMilesSameRate
                            ? [
                                  DriverModalStringEnum.TEAM,
                                  DriverModalStringEnum.COMBINED,
                              ].includes(
                                  this.fleetType as DriverModalStringEnum
                              )
                                ? this.fleetType ===
                                  DriverModalStringEnum.COMBINED
                                    ? teamDriver
                                        ? teamLoadedMile
                                            ? parseFloat(teamLoadedMile)
                                            : null
                                        : null
                                    : teamLoadedMile
                                    ? parseFloat(teamLoadedMile)
                                    : null
                                : null
                            : null
                        : null,
                perStop:
                    this.selectedPayType?.name ===
                    DriverModalStringEnum.PER_MILE
                        ? !this.hasMilesSameRate
                            ? [
                                  DriverModalStringEnum.TEAM,
                                  DriverModalStringEnum.COMBINED,
                              ].includes(
                                  this.fleetType as DriverModalStringEnum
                              )
                                ? this.fleetType ===
                                  DriverModalStringEnum.COMBINED
                                    ? teamDriver
                                        ? teamPerStop
                                            ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                                  teamPerStop
                                              )
                                            : null
                                        : null
                                    : teamPerStop
                                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                          teamPerStop
                                      )
                                    : null
                                : null
                            : null
                        : null,
            },
            perMileTeam:
                this.selectedPayType?.name === DriverModalStringEnum.PER_MILE
                    ? this.hasMilesSameRate
                        ? [
                              DriverModalStringEnum.TEAM,
                              DriverModalStringEnum.COMBINED,
                          ].includes(this.fleetType as DriverModalStringEnum)
                            ? this.fleetType === DriverModalStringEnum.COMBINED
                                ? teamDriver
                                    ? perMileTeam
                                        ? parseFloat(perMileTeam)
                                        : null
                                    : null
                                : perMileTeam
                                ? parseFloat(perMileTeam)
                                : null
                            : null
                        : null
                    : null,
            commissionSolo:
                this.selectedPayType?.name === DriverModalStringEnum.COMMISSION
                    ? [
                          DriverModalStringEnum.SOLO,
                          DriverModalStringEnum.COMBINED,
                      ].includes(this.fleetType as DriverModalStringEnum)
                        ? this.fleetType === DriverModalStringEnum.COMBINED
                            ? soloDriver
                                ? commissionSolo
                                    ? parseFloat(commissionSolo)
                                    : null
                                : null
                            : commissionSolo
                            ? parseFloat(commissionSolo)
                            : null
                        : null
                    : null,
            commissionTeam:
                this.selectedPayType?.name === DriverModalStringEnum.COMMISSION
                    ? [
                          DriverModalStringEnum.TEAM,
                          DriverModalStringEnum.COMBINED,
                      ].includes(this.fleetType as DriverModalStringEnum)
                        ? this.fleetType === DriverModalStringEnum.COMBINED
                            ? commissionTeam
                                ? commissionTeam
                                    ? parseFloat(commissionTeam)
                                    : null
                                : null
                            : commissionTeam
                            ? parseFloat(commissionTeam)
                            : null
                        : null
                    : null,
            soloFlatRate:
                this.selectedPayType?.name === DriverModalStringEnum.FLAT_RATE
                    ? soloFlatRate
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              soloFlatRate
                          )
                        : null
                    : null,
            teamFlatRate:
                this.selectedPayType?.name === DriverModalStringEnum.FLAT_RATE
                    ? teamFlatRate
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              teamFlatRate
                          )
                        : null
                    : null,
            general: {
                mailNotification: mailNotificationGeneral,
                pushNotification: pushNotificationGeneral,
                smsNotification: smsNotificationGeneral,
            },
            payroll: {
                mailNotification: mailNotificationPayroll,
                pushNotification: pushNotificationPayroll,
                smsNotification: smsNotificationPayroll,
            },
            twicExpDate: this.driverForm.get(DriverModalStringEnum.TWIC).value
                ? MethodsCalculationsHelper.convertDateToBackend(
                      this.driverForm.get(DriverModalStringEnum.TWIC_EXP_DATE)
                          .value
                  )
                : null,
            fleetType: this.fleetType,
            soloDriver: !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                .value
                ? this.fleetType === DriverModalStringEnum.COMBINED
                    ? soloDriver
                    : false
                : null,
            teamDriver: !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                .value
                ? this.fleetType === DriverModalStringEnum.COMBINED
                    ? teamDriver
                    : false
                : null,
            files: documents ? documents : this.driverForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
            tags: tagsArray,
        };

        this.driverService
            .updateDriver(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                    this.updateTags();
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

    private deleteDriverById(id: number): void {
        this.driverService
            .deleteDriverById(id, !this.driverStatus ? 'active' : 'inactive')
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

    private updateDriverStatus() {
        this.driverService
            .changeDriverStatus(
                this.editData.id,
                !this.driverStatus ? 'active' : 'inactive'
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: HttpResponseBase) => {
                    if (res.status === 200 || res.status === 204) {
                        this.driverStatus = !this.driverStatus;

                        this.modalService.changeModalStatus({
                            name: 'deactivate',
                            status: this.driverStatus,
                        });
                    }
                },
                error: () => {},
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
