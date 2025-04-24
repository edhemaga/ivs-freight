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
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

// svg routes
import { DriverModalSvgRoutes } from '@pages/driver/pages/driver-modals/driver-modal/utils/svg-routes/driver-modal-svg-routes';

// modules
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

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
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';

// validators
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    firstNameValidation,
    lastNameValidation,
    name2_24Validation,
    perStopValidation,
    phoneFaxRegex,
    routingBankValidation,
    ssnNumberRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import {
    CaInputAddressDropdownComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalComponent,
    CaTabSwitchComponent,
    CaUploadFilesComponent,
    InputTestComponent,
} from 'ca-components';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DriverModalStringEnum } from '@pages/driver/pages/driver-modals/driver-modal/enums/driver-modal-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { eGeneralActions } from '@shared/enums';

// constants
import { DriverModalConstants } from '@pages/driver/pages/driver-modals/driver-modal/utils/constants';

//config
import { DriverModalUploadFilesConfig } from '@pages/driver/pages/driver-modals/driver-modal/utils/config';

// models
import {
    AddressEntity,
    BankResponse,
    CheckOwnerSsnEinResponse,
    CreateResponse,
    DriverModalFuelCardResponse,
    DriverModalOwnerResponse,
    DriverResponse,
    EnumValue,
    GetDriverModalResponse,
    DriverDetailsOffDutyLocationResponse,
    PerMileEntity,
} from 'appcoretruckassist';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import { Tabs } from '@shared/models/tabs.model';
import { AnimationObject } from '@pages/driver/pages/driver-modals/driver-modal/models/animation-object.model';
import { AddUpdateDriverProperties } from '@pages/driver/pages/driver-modals/driver-modal/models/add-update-driver-properties.model';
import { SoloTeamSelectedOptions } from '@pages/driver/pages/driver-modals/driver-modal/models/solo-team-selected-options.model';
import { AddUpdateDriverPayrollProperties } from '@pages/driver/pages/driver-modals/driver-modal/models/add-update-driver-payroll-properties.model';
import { PayrollDefaultValues } from '@pages/driver/pages/driver-modals/driver-modal/models/payroll-default-values.model';
import { DriverModalEditData } from '@pages/driver/pages/driver-modals/driver-modal/models/driver-modal-edit-data.model';

// pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';
import { AddressService } from '@shared/services/address.service';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

@Component({
    selector: 'app-driver-modal',
    templateUrl: './driver-modal.component.html',
    styleUrls: ['./driver-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [
        // Services
        ModalService,
        FormService,
        BankVerificationService,

        // Pipes
        NameInitialsPipe,
    ],
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
        CaModalComponent,
        CaTabSwitchComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaNgxSliderComponent,
        TaCheckboxCardComponent,
        TaModalTableComponent,
        CaUploadFilesComponent,

        CaInputDropdownComponent,
        CaUploadFilesComponent,
        CaInputNoteComponent,
        CaInputDatetimePickerComponent,
        InputTestComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class DriverModalComponent
    extends AddressMixin(class { addressService!: AddressService; })
    implements OnInit, OnDestroy {

    @Input() editData: DriverModalEditData;

    public destroy$ = new Subject<void>();

    public driverForm: UntypedFormGroup;

    public isFormDirty: boolean;
    public isAddNewAfterSave: boolean = false;

    public isOwnerAlreadyAddedAsSoleProprietor: boolean = false;

    public driverFullName: string;

    // svg routes
    public driverModalSvgRoutes: DriverModalSvgRoutes = DriverModalSvgRoutes;

    // animation
    public isCardAnimationDisabled: boolean = false;
    public animationObject: AnimationObject;

    // tabs
    public mainTabs: Tabs[] = [];
    public ownerTabs: Tabs[] = [];
    public payrollTabs: Tabs[] = [];

    public selectedTabId: number = 1;

    // dropdowns
    public payTypeDropdownList: EnumValue[] = [];
    public banksDropdownList: BankResponse[] = [];
    public ownersDropdownList: DriverModalOwnerResponse[] = [];

    public selectedPayType: EnumValue;
    public selectedBank: BankResponse;
    public selectedOwner: CheckOwnerSsnEinResponse;

    public selectedAddress: AddressEntity;

    public isBankSelected: boolean = false;

    // slider
    public soloSliderOptions: Options;
    public teamSliderOptions: Options;
    public driverSliderOptions: Options;

    // items
    public isOffDutyLocationRowCreated: boolean = false;
    public isEachOffDutyLocationRowValid: boolean = true;
    public isFuelCardRowCreated: boolean = false;
    public isEachFuelCardRowValid: boolean = true;

    public offDutyLocationItems: DriverDetailsOffDutyLocationResponse[] = [];
    public updatedOffDutyLocationItems: DriverDetailsOffDutyLocationResponse[] =
        [];
    public fuelCardItems: DriverModalFuelCardResponse[] = [];
    public updatedFuelCardItems: DriverModalFuelCardResponse[] = [];

    // documents
    public dropZoneConfig: DropZoneConfig;
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public tags: any[] = [];

    public isFileModified: boolean = false;

    public uploadDocumentsFilesConfig = DriverModalUploadFilesConfig.DRIVER_MODAL_DOCUMENTS_UPLOAD_FILES_CONFIG;

    // logo
    public uploadProfilePictureFilesConfig = DriverModalUploadFilesConfig.DRIVER_MODAL_PROFILE_PICTURE_UPLOAD_FILES_CONFIG;

    // payroll
    public payrollDefaultValues: PayrollDefaultValues;

    public fleetType: string;
    public hasMilesSameRate: boolean = false;

    // enums
    public modalTableTypeEnum = ModalTableTypeEnum;
    public taModalActionEnum = TaModalActionEnum;
    public eGeneralActions = eGeneralActions;
    
    public svgRoutes = SharedSvgRoutes;

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
        private confirmationActivationService: ConfirmationActivationService,
        private confirmationService: ConfirmationService,
        public addressService: AddressService,

        // bootstrap
        private ngbActiveModal: NgbActiveModal,

        // change detector
        private changeDetector: ChangeDetectorRef,

        // pipes
        private nameInitialsPipe: NameInitialsPipe
    ) {
        super()
    }

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getDriverDropdowns();

        this.validateMiles();

        this.isOwnerSelected();

        this.isUseCarrieraACHSelected();

        this.isSoloOrTeamDriverSelected();

        this.isTwicTypeSelected();
        this.confirmationActivationSubscribe();
        this.confirmationData();
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ngbActiveModal?.close();
            });
    }

    private confirmationData(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
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
            owner: [null],

            payrollType: [DriverModalStringEnum.COMPANY_DRIVER],
            useCarrieraAch: [false],
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

            flatRateSolo: [null, perStopValidation],
            flatRateTeam: [null, perStopValidation],

            bankId: [null, [...bankValidation]],
            account: [null, accountBankValidation],
            routing: [null, routingBankValidation],

            isOpenPayrollShared: [false],
            isPayrollCalculated: [false],

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
            fuelCardItems: [null],

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

    public onModalAction(action: string): void {
        if (action === TaModalActionEnum.CLOSE) {
            this.ngbActiveModal.close();
            return;
        }

        if (action === TaModalActionEnum.DEACTIVATE) {
            const mappedEvent = {
                ...this.editData,
                data: {
                    ...this.editData.data,
                    name: this.driverFullName,
                    textShortName: this.nameInitialsPipe.transform(
                        this.driverFullName
                    ),
                    /*   avatarImg: this.editData.data.avatar, */
                    avatarColor: AvatarColorsHelper.getAvatarColors(
                        this.editData.avatarIndex ?? 0
                    ),
                },
            };

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    subType: TableStringEnum.DRIVER_1,
                    type: TableStringEnum.DEACTIVATE,
                    template: TableStringEnum.DRIVER_1,
                    tableType: TableStringEnum.DRIVER,
                }
            );
        }
        // save and add new
        else if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
            if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);

                return;
            }

            this.addDriver();
            this.isAddNewAfterSave = true;
        }
        // save or update and close
        else if (action === TaModalActionEnum.SAVE) {
            if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);

                return;
            }

            // update
            if (this.editData?.id) this.updateDriverById(this.editData.id);
            else this.addDriver();
        }
        // delete
        else if (action === TaModalActionEnum.DELETE && this.editData?.id) {
            const mappedEvent = {
                ...this.editData,
                data: {
                    ...this.editData.data,
                    name: this.driverFullName,
                    textShortName: this.nameInitialsPipe.transform(
                        this.driverFullName
                    ),
                    /* avatarImg: this.editData.data.avatar, */
                    avatarColor: AvatarColorsHelper.getAvatarColors(
                        this.editData.avatarIndex ?? 0
                    ),
                },
            };

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

            this.updatedOffDutyLocationItems = this.offDutyLocationItems;
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
                    this.driverForm.get(DriverModalStringEnum.OWNER)
                );
            } else {
                this.inputService.changeValidators(
                    this.driverForm.get(DriverModalStringEnum.OWNER),
                    false
                );
            }
        }
    }

    public onPayrolltTabChange(event: Tabs): void {
        if (event) {
            this.driverForm
                .get(DriverModalStringEnum.PAYROLL_TYPE)
                .patchValue(event.name);

            const payrollType = this.driverForm.get(
                DriverModalStringEnum.PAYROLL_TYPE
            ).value;

            const fieldToUpdate =
                payrollType === DriverModalStringEnum.COMPANY_DRIVER
                    ? DriverModalStringEnum.IS_PAYROLL_SHARED
                    : DriverModalStringEnum.IS_PAYROLL_CALCULATED;

            this.driverForm.get(fieldToUpdate).patchValue(false);
        }
    }

    public onSelectDropdown(event: any, action: string): void {
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
            case DriverModalStringEnum.OWNER:
                if (event?.canOpenModal)
                    this.modalService.openModal(OwnerModalComponent, {
                        size: DriverModalStringEnum.SMALL,
                    });
                else this.selectedOwner = event;

                break;
            default:
                break;
        }
    }

    private onSelectPayTypeDropdown(event: EnumValue): void {
        const requiredFields = [
            DriverModalStringEnum.SOLO_EMPTY_MILE,
            DriverModalStringEnum.SOLO_LOADED_MILE,
            DriverModalStringEnum.PER_MILE_SOLO,
            DriverModalStringEnum.TEAM_EMPTY_MILE,
            DriverModalStringEnum.TEAM_LOADED_MILE,
            DriverModalStringEnum.PER_MILE_TEAM,
            DriverModalStringEnum.FLAT_RATE_SOLO,
            DriverModalStringEnum.FLAT_RATE_TEAM,
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
            this.onSelectPayTypeDropdownPerMile();
        }
        // commission
        else if (this.selectedPayType?.id === 2) {
            this.onSelectPayTypeDropdownCommission();
        }
        // flat rate
        else if (this.selectedPayType?.id === 3) {
            this.onSelectPayTypeDropdownFlatRate();
        }
    }

    private onSelectPayTypeDropdownPerMile(): void {
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
                if (index <= (this.hasMilesSameRate ? 0 : 1)) {
                    this.inputService.changeValidators(
                        this.driverForm.get(field)
                    );
                }

                this.driverForm
                    .get(field)
                    .patchValue(this.payrollDefaultValues[field]);
            });
        } else if (this.fleetType === DriverModalStringEnum.TEAM) {
            const fields = this.hasMilesSameRate
                ? [teamFields[0]]
                : teamFields.slice(1);

            fields.forEach((field, index) => {
                if (index <= (this.hasMilesSameRate ? 0 : 1)) {
                    this.inputService.changeValidators(
                        this.driverForm.get(field)
                    );
                }

                this.driverForm
                    .get(field)
                    .patchValue(this.payrollDefaultValues[field]);
            });
        } else if (this.fleetType === DriverModalStringEnum.COMBINED) {
            const fields = this.hasMilesSameRate
                ? [soloFields[0], teamFields[0]]
                : [...soloFields.slice(1), ...teamFields.slice(1)];

            fields.forEach((field) => {
                if (
                    (field
                        .toLowerCase()
                        .includes(DriverModalStringEnum.TEAM_2) &&
                        this.driverForm.get(DriverModalStringEnum.TEAM_DRIVER)
                            .value) ||
                    (field.toLowerCase().includes(DriverModalStringEnum.SOLO) &&
                        this.driverForm.get(DriverModalStringEnum.SOLO_DRIVER)
                            .value)
                ) {
                    if (!field.includes(DriverModalStringEnum.PER_STOP))
                        this.inputService.changeValidators(
                            this.driverForm.get(field)
                        );

                    this.driverForm
                        .get(field)
                        .patchValue(this.payrollDefaultValues[field]);
                }
            });
        }
    }

    private onSelectPayTypeDropdownCommission(): void {
        const changeValidatorsAndPatch = (key: string, value: number) => {
            this.inputService.changeValidators(this.driverForm.get(key));

            this.driverForm.get(key).patchValue(value);
        };

        if (
            this.fleetType === DriverModalStringEnum.SOLO ||
            this.fleetType === DriverModalStringEnum.TEAM
        ) {
            const commissionKey =
                this.fleetType === DriverModalStringEnum.SOLO
                    ? DriverModalStringEnum.COMMISSION_SOLO
                    : DriverModalStringEnum.COMMISSION_TEAM;

            changeValidatorsAndPatch(
                DriverModalStringEnum.DRIVER_COMMISSION,
                this.payrollDefaultValues[commissionKey]
            );
        } else {
            if (this.driverForm.get(DriverModalStringEnum.SOLO_DRIVER).value) {
                changeValidatorsAndPatch(
                    DriverModalStringEnum.COMMISSION_SOLO,
                    this.payrollDefaultValues[
                    DriverModalStringEnum.COMMISSION_SOLO
                    ]
                );
            }

            if (this.driverForm.get(DriverModalStringEnum.TEAM_DRIVER).value) {
                changeValidatorsAndPatch(
                    DriverModalStringEnum.COMMISSION_TEAM,
                    this.payrollDefaultValues[
                    DriverModalStringEnum.COMMISSION_TEAM
                    ]
                );
            }
        }
    }

    private onSelectPayTypeDropdownFlatRate(): void {
        const updateFlatRate = (key: string) => {
            this.inputService.changeValidators(this.driverForm.get(key));

            this.driverForm.get(key).patchValue(this.payrollDefaultValues[key]);
        };

        switch (this.fleetType) {
            case DriverModalStringEnum.SOLO:
                updateFlatRate(DriverModalStringEnum.FLAT_RATE_SOLO);

                break;
            case DriverModalStringEnum.TEAM:
                updateFlatRate(DriverModalStringEnum.FLAT_RATE_TEAM);

                break;
            default:
                if (
                    this.driverForm.get(DriverModalStringEnum.SOLO_DRIVER).value
                )
                    updateFlatRate(DriverModalStringEnum.FLAT_RATE_SOLO);

                if (
                    this.driverForm.get(DriverModalStringEnum.TEAM_DRIVER).value
                )
                    updateFlatRate(DriverModalStringEnum.FLAT_RATE_TEAM);
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSaveNewBank(bank: { data: any; action: string }): void {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: CreateResponse) => {
                this.selectedBank = {
                    id: res.id,
                    name: bank.data.name,
                };

                this.banksDropdownList = [
                    ...this.banksDropdownList,
                    this.selectedBank,
                ];
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

                            this.driverForm.get(DriverModalStringEnum.ROUTING),
                            this.driverForm.get(DriverModalStringEnum.ACCOUNT)
                        );

                    clearTimeout(timeout);
                }, 100);
            });
    }

    public onUploadImage(event: any): void {
        const base64Data = MethodsGlobalHelper.getBase64DataFromEvent(event);
        this.driverForm
            .get(DriverModalStringEnum.AVATAR)
            .patchValue(base64Data);
        this.driverForm.get(DriverModalStringEnum.AVATAR).setErrors(null);
    }

    public onImageValidation(event: boolean): void {
        if (!event) {
            this.driverForm
                .get(DriverModalStringEnum.AVATAR)
                .setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.driverForm.get(DriverModalStringEnum.AVATAR),
                false
            );
        }
    }

    public onFilesEvent(event: any): void {
        switch (event.action) {
            case DriverModalStringEnum.ADD:
                this.documents = event.files;

                this.driverForm
                    .get(DriverModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case DriverModalStringEnum.DELETE:
                this.documents = event.files;

                this.driverForm
                    .get(DriverModalStringEnum.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                this.isFileModified = true;

                break;
            case DriverModalStringEnum.TAG:
                let changedTag = false;

                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.driverForm
                    .get(DriverModalStringEnum.TAGS)
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

    public addFuelCard(): void {
        if (!this.isEachFuelCardRowValid) return;

        this.isFuelCardRowCreated = true;

        setTimeout(() => {
            this.isFuelCardRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(
        modalTableDataValue: DriverDetailsOffDutyLocationResponse[],
        type: string
    ): void {
        if (type === DriverModalStringEnum.OFF_DUTY_LOCATION) {
            this.offDutyLocationItems = modalTableDataValue;

            this.driverForm
                .get(DriverModalStringEnum.OFF_DUTY_LOCATION_ITEMS)
                .patchValue(JSON.stringify(this.offDutyLocationItems));
        } else {
            this.fuelCardItems = modalTableDataValue;

            this.driverForm
                .get(DriverModalStringEnum.FUEL_CARD_ITEMS)
                .patchValue(JSON.stringify(this.fuelCardItems));
        }

        this.changeDetector.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachRowValid: boolean,
        type: string
    ): void {
        if (type === DriverModalStringEnum.OFF_DUTY_LOCATION) {
            this.isEachOffDutyLocationRowValid = isEachRowValid;
        } else {
            this.isEachFuelCardRowValid = isEachRowValid;
        }
    }

    public handleSliderValueChange(
        event: ChangeContext | number,
        type: string
    ) {
        this.driverForm.get(type).patchValue(event);
    }

    private handlePayrollDefaultValueCombinations(
        dataSolo: PerMileEntity,
        flatRateSolo: number,
        perMileSolo: number,
        defaultSoloDriverCommission: number,
        dataTeam: PerMileEntity,
        flatRateTeam: number,
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
                flatRateSolo: flatRateSolo
                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                        flatRateSolo
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
                    flatRateTeam: flatRateTeam
                        ? MethodsCalculationsHelper.convertNumberInThousandSep(
                            flatRateTeam
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
                        ? [DriverModalStringEnum.FLAT_RATE_SOLO]
                        : [DriverModalStringEnum.FLAT_RATE_TEAM];

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

                fieldControl.patchValue(this.payrollDefaultValues[field]);
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

    public validateEmail(): void {
        const email = this.driverForm.get(DriverModalStringEnum.EMAIL).value;

        if (email) {
            this.driverService
                .validateDriverEmail(email)
                .pipe(takeUntil(this.destroy$))
                .subscribe((emailAlreadyInUse) => {
                    if (
                        emailAlreadyInUse &&
                        this.driverForm.get(DriverModalStringEnum.EMAIL).valid
                    )
                        this.driverForm
                            .get(DriverModalStringEnum.EMAIL)
                            .setErrors({ emailAlreadyExist: true });
                });
        }
    }

    public validateSsn(event: any, isClear: boolean): void {
        const ssnControl = this.driverForm.get(DriverModalStringEnum.SSN);
        const isOwnerControl = this.driverForm.get(
            DriverModalStringEnum.IS_OWNER
        );

        if (isClear && this.isOwnerAlreadyAddedAsSoleProprietor) {
            this.isOwnerAlreadyAddedAsSoleProprietor = false;
            isOwnerControl.patchValue(false);
            return;
        }

        if (ssnControl.value)
            this.driverService
                .validateDriverSsn(ssnControl.value)
                .pipe(takeUntil(this.destroy$))
                .subscribe((ssnData) => {
                    if (this.isOwnerAlreadyAddedAsSoleProprietor) {
                        this.isOwnerAlreadyAddedAsSoleProprietor = false;
                        isOwnerControl.patchValue(false);
                    }

                    if (ssnData?.driverExists && ssnControl.valid) {
                        ssnControl.setErrors({ ssnAlreadyExist: true });
                    } else if (
                        ssnData?.soleProprietorExists &&
                        ssnControl.valid
                    ) {
                        isOwnerControl.patchValue(ssnData.soleProprietorExists);
                        this.isOwnerAlreadyAddedAsSoleProprietor = true;
                    }
                });
    }

    private createAddOrUpdateDriverPayrollProperties(
        isOwner: boolean,
        payrollType: string,
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
        driverCommission: string,
        flatRateSolo: string,
        flatRateTeam: string,
        isOpenPayrollShared: boolean,
        isPayrollCalculated: boolean
    ): AddUpdateDriverPayrollProperties {
        // driver type
        const conditionalDriverType =
            !isOwner && payrollType === DriverModalStringEnum.COMPANY_DRIVER
                ? 1
                : !isOwner &&
                    payrollType === DriverModalStringEnum.THIRD_PARTY_DRIVER
                    ? 2
                    : null;

        // solo empty mile
        const conditionalSoloEmptyMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                !this.hasMilesSameRate &&
                soloEmptyMile
                ? parseFloat(soloEmptyMile)
                : null;

        // solo loaded mile
        const conditionalSoloLoadedMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                !this.hasMilesSameRate &&
                soloLoadedMile
                ? parseFloat(soloLoadedMile)
                : null;

        // solo per stop
        const conditionalSoloPerStop =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                soloPerStop
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                    soloPerStop
                )
                : null;

        // solo per mile
        const conditionalPerMileSolo =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                this.hasMilesSameRate &&
                perMileSolo
                ? parseFloat(perMileSolo)
                : null;

        // team empty mile
        const conditionalTeamEmptyMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                !this.hasMilesSameRate &&
                teamEmptyMile
                ? parseFloat(teamEmptyMile)
                : null;

        // team loaded mile
        const conditionalTeamLoadedMile =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                !this.hasMilesSameRate &&
                teamLoadedMile
                ? parseFloat(teamLoadedMile)
                : null;

        // team per stop
        const conditionalTeamPerStop =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                teamPerStop
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                    teamPerStop
                )
                : null;

        // team per mile
        const conditionalPerMileTeam =
            this.selectedPayType?.name === DriverModalStringEnum.PER_MILE &&
                this.hasMilesSameRate &&
                perMileTeam
                ? parseFloat(perMileTeam)
                : null;

        // commission solo
        const conditionalCommissionSolo =
            this.selectedPayType?.name === DriverModalStringEnum.COMMISSION &&
                ((this.fleetType === DriverModalStringEnum.COMBINED &&
                    commissionSolo) ||
                    (this.fleetType === DriverModalStringEnum.SOLO &&
                        driverCommission))
                ? parseFloat(
                    this.fleetType === DriverModalStringEnum.COMBINED
                        ? commissionSolo
                        : driverCommission
                )
                : null;

        // commission team
        const conditionalCommissionTeam =
            this.selectedPayType?.name === DriverModalStringEnum.COMMISSION &&
                ((this.fleetType === DriverModalStringEnum.COMBINED &&
                    commissionTeam) ||
                    (this.fleetType === DriverModalStringEnum.TEAM &&
                        driverCommission))
                ? parseFloat(
                    this.fleetType === DriverModalStringEnum.COMBINED
                        ? commissionTeam
                        : driverCommission
                )
                : null;

        // solo flat rate
        const conditionalFlatRateSolo =
            this.selectedPayType?.name === DriverModalStringEnum.FLAT_RATE &&
                flatRateSolo
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                    flatRateSolo
                )
                : null;

        // team flat rate
        const conditionalFlatRateTeam =
            this.selectedPayType?.name === DriverModalStringEnum.FLAT_RATE &&
                flatRateTeam
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                    flatRateTeam
                )
                : null;

        // payroll shared
        const conditionalPayrollShared =
            !isOwner && payrollType === DriverModalStringEnum.COMPANY_DRIVER
                ? isOpenPayrollShared
                : null;

        // payroll calculated
        const conditionalPayrollCalculated =
            !isOwner && payrollType === DriverModalStringEnum.THIRD_PARTY_DRIVER
                ? isPayrollCalculated
                : null;

        return {
            conditionalDriverType,
            conditionalSoloEmptyMile,
            conditionalSoloLoadedMile,
            conditionalSoloPerStop,
            conditionalPerMileSolo,
            conditionalTeamEmptyMile,
            conditionalTeamLoadedMile,
            conditionalTeamPerStop,
            conditionalPerMileTeam,
            conditionalCommissionSolo,
            conditionalCommissionTeam,
            conditionalFlatRateSolo,
            conditionalFlatRateTeam,
            conditionalPayrollShared,
            conditionalPayrollCalculated,
        };
    }

    private createAddOrUpdateDriverProperties(
        dateOfBirth: string,
        addressUnit: string,
        isOwner: boolean,
        ownerType: string,
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
                ? DriverModalStringEnum.PROPRIETOR
                : DriverModalStringEnum.COMPANY;

        // owner id
        const conditionalOwnerId =
            ownerType === DriverModalStringEnum.SOLE_PROPRIETOR
                ? null
                : this.selectedOwner?.id || null;

        // payroll
        const conditionalSoloDriver =
            this.fleetType === DriverModalStringEnum.COMBINED
                ? soloDriver
                : false;
        const conditionalTeamDriver =
            this.fleetType === DriverModalStringEnum.COMBINED
                ? teamDriver
                : false;

        const convertedFuelCards = this.fuelCardItems.map(
            (fuelCard) => fuelCard.id
        );

        // twic
        const conditionalTwicExpDate = twic
            ? MethodsCalculationsHelper.convertDateToBackend(twicExpDate)
            : null;

        // documents
        const convertedDocuments = [];
        const convertedTagsArray = [];

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
            conditionalSoloDriver,
            conditionalTeamDriver,
            convertedDocuments,
            convertedTagsArray,
            convertedFuelCards,
            conditionalTwicExpDate,
        };
    }

    private createPayrollDefaultData(data: GetDriverModalResponse): void {
        const {
            mvrExpiration,
            defaultSoloDriverCommission,
            defaultTeamDriverCommission,
            solo,
            flatRateSolo,
            perMileSolo,
            team,
            flatRateTeam,
            perMileTeam,
        } = data;

        this.payrollDefaultValues = {
            soloEmptyMile: solo?.emptyMile,
            soloLoadedMile: solo?.loadedMile,
            perMileSolo,
            soloPerStop: solo?.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                    solo?.perStop
                )
                : null,
            commissionSolo:
                defaultSoloDriverCommission ??
                this.driverForm.get(DriverModalStringEnum.COMMISSION_SOLO)
                    .value,
            flatRateSolo: flatRateSolo
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                    flatRateSolo
                )
                : null,

            teamEmptyMile: team?.emptyMile,
            teamLoadedMile: team?.loadedMile,
            perMileTeam,
            teamPerStop: team?.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                    team?.perStop
                )
                : null,
            commissionTeam:
                defaultTeamDriverCommission ??
                this.driverForm.get(DriverModalStringEnum.COMMISSION_TEAM)
                    .value,
            flatRateTeam: flatRateTeam
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                    flatRateTeam
                )
                : null,

            mvrExpiration: mvrExpiration ?? 12,
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
                    const {
                        banks,
                        payTypes,
                        owners,
                        tags,
                        fleetType,
                        loadedAndEmptySameRate,
                        mvrExpiration,
                        defaultSoloDriverCommission,
                        defaultTeamDriverCommission,
                        solo,
                        flatRateSolo,
                        perMileSolo,
                        team,
                        flatRateTeam,
                        perMileTeam,
                    } = data;

                    this.banksDropdownList = banks;
                    this.payTypeDropdownList = payTypes;
                    this.ownersDropdownList = owners;

                    this.tags = tags;

                    this.fleetType = fleetType;
                    this.hasMilesSameRate = loadedAndEmptySameRate;

                    this.driverForm.patchValue({
                        mvrExpiration: mvrExpiration,
                        ...(this.fleetType !==
                            DriverModalStringEnum.COMBINED && {
                            driverCommission:
                                defaultSoloDriverCommission ||
                                defaultTeamDriverCommission,
                        }),
                    });

                    this.handlePayrollDefaultValueCombinations(
                        solo,
                        flatRateSolo,
                        perMileSolo,
                        defaultSoloDriverCommission,
                        team,
                        flatRateTeam,
                        perMileTeam,
                        defaultTeamDriverCommission
                    );

                    this.createPayrollDefaultData(data);

                    if (this.editData?.data) {
                        this.isCardAnimationDisabled = true;

                        this.editDriverById(
                            this.editData.data as DriverResponse
                        );
                    } else {
                        this.startFormChanges();
                    }
                }
            });
    }

    private addDriver(): void {
        const {
            // eslint-disable-next-line no-unused-vars
            address, // eslint-disable-next-line no-unused-vars
            ownerId, // eslint-disable-next-line no-unused-vars
            payType, // eslint-disable-next-line no-unused-vars
            bankId, // eslint-disable-next-line no-unused-vars
            offDutyLocationItems, // eslint-disable-next-line no-unused-vars
            files, // eslint-disable-next-line no-unused-vars
            tags,

            dateOfBirth,
            addressUnit,
            isOwner,
            ownerType,
            twic,
            twicExpDate,
            mailNotificationGeneral,
            pushNotificationGeneral,
            smsNotificationGeneral,
            mailNotificationPayroll,
            pushNotificationPayroll,
            smsNotificationPayroll,

            payrollType,

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

            driverCommission,

            flatRateSolo,
            flatRateTeam,

            isOpenPayrollShared,
            isPayrollCalculated,

            ...form
        } = this.driverForm.value;

        const {
            convertedDate,
            conditionalOwnerType,
            conditionalOwnerId,
            conditionalSoloDriver,
            conditionalTeamDriver,
            convertedDocuments,
            convertedTagsArray,
            conditionalTwicExpDate,
            convertedFuelCards,
        } = this.createAddOrUpdateDriverProperties(
            dateOfBirth,
            addressUnit,
            isOwner,
            ownerType,
            soloDriver,
            teamDriver,
            twic,
            twicExpDate
        );

        const {
            conditionalDriverType,
            conditionalSoloEmptyMile,
            conditionalSoloLoadedMile,
            conditionalSoloPerStop,
            conditionalPerMileSolo,
            conditionalTeamEmptyMile,
            conditionalTeamLoadedMile,
            conditionalTeamPerStop,
            conditionalPerMileTeam,
            conditionalCommissionSolo,
            conditionalCommissionTeam,
            conditionalFlatRateSolo,
            conditionalFlatRateTeam,
            conditionalPayrollShared,
            conditionalPayrollCalculated,
        } = this.createAddOrUpdateDriverPayrollProperties(
            isOwner,
            payrollType,
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
            driverCommission,
            flatRateSolo,
            flatRateTeam,
            isOpenPayrollShared,
            isPayrollCalculated
        );

        const newData = {
            ...form,

            dateOfBirth: convertedDate,
            address: this.selectedAddress,

            isOwner,
            ownerType: conditionalOwnerType,
            ownerId: conditionalOwnerId,

            driverType: conditionalDriverType,

            payType: this.selectedPayType?.id ?? null,

            soloDriver: conditionalSoloDriver,
            teamDriver: conditionalTeamDriver,

            solo: {
                emptyMile: conditionalSoloEmptyMile,
                loadedMile: conditionalSoloLoadedMile,
                perStop: conditionalSoloPerStop,
            },
            perMileSolo: conditionalPerMileSolo,

            team: {
                emptyMile: conditionalTeamEmptyMile,
                loadedMile: conditionalTeamLoadedMile,
                perStop: conditionalTeamPerStop,
            },
            perMileTeam: conditionalPerMileTeam,

            commissionSolo: conditionalCommissionSolo,
            commissionTeam: conditionalCommissionTeam,

            flatRateSolo: conditionalFlatRateSolo,
            flatRateTeam: conditionalFlatRateTeam,

            isOpenPayrollShared: conditionalPayrollShared,
            isPayrollCalculated: conditionalPayrollCalculated,

            fleetType: this.fleetType,

            bankId: this.selectedBank?.id ?? null,

            offDutyLocations: this.offDutyLocationItems,

            files: convertedDocuments,
            tags: convertedTagsArray,

            fuelCardIds: convertedFuelCards,
            twic,
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

        this.driverService
            .addDriver(newData, this.editData?.isDispatchCall)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.isAddNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: DriverModalStringEnum.SAVE_AND_ADD_NEW,
                            status: false,
                            close: false,
                        });

                        this.ngbActiveModal.close();

                        this.modalService.openModal(DriverModalComponent, {
                            size: DriverModalStringEnum.MEDIUM,
                        });

                        this.isAddNewAfterSave = false;
                    } else {
                        this.ngbActiveModal.close();
                    }
                },
            });
    }

    private editDriverById(editData: DriverResponse): void {
        const {
            firstName,
            lastName,
            dateOfBirth,
            phone,
            email,
            ssn,
            address,

            owner,

            driverType,
            useCarrieraAch,
            fleetType,
            payType,
            soloDriver,
            teamDriver,
            solo,
            team,

            isOpenPayrollShared,
            isPayrollCalculated,

            bank,

            offDutyLocations,
            emergencyContact,
            files,
            note,

            /*     avatar, */
            twic,
            twicExpDate,
            mvrExpiration,
            general,
            payroll,
        } = editData;

        // driver full name
        this.driverFullName =
            firstName + DriverModalStringEnum.EMPTY_STRING + lastName;

        // address
        this.onHandleAddress({
            address,
            valid: !!address,
        });

        // driver type
        this.onPayrolltTabChange(driverType as Tabs);

        // fleet type
        this.fleetType = fleetType?.name;

        // pay type
        this.onSelectDropdown(payType, DriverModalStringEnum.PAY_TYPE);

        // bank
        this.onSelectDropdown(bank, DriverModalStringEnum.BANK);

        // off duty locations
        this.updatedOffDutyLocationItems = offDutyLocations?.map(
            (offDutyLocationItem) => {
                return {
                    nickname: offDutyLocationItem.nickname,
                    address: offDutyLocationItem.address,
                };
            }
        );

        // documents
        this.documents = files;
        this.selectedAddress = address;

        // patch form
        this.driverForm.patchValue({
            firstName,
            lastName,
            dateOfBirth:
                MethodsCalculationsHelper.convertDateFromBackend(dateOfBirth),
            phone,
            email,
            ssn,
            addressUnit: address?.addressUnit,

            isOwner: !!owner,
            ownerId: owner?.id ?? null,
            ownerType: owner
                ? owner.type
                    ? owner?.type.includes(DriverModalStringEnum.PROPRIETOR)
                        ? DriverModalStringEnum.SOLE_SPACE + owner?.type
                        : owner?.type
                    : null
                : null,

            useCarrieraAch,
            payType: payType?.name,
            soloDriver,
            teamDriver,
            soloEmptyMile: solo?.emptyMile
                ? String(solo.emptyMile)
                : solo.emptyMile,
            soloLoadedMile: solo?.loadedMile
                ? String(solo.loadedMile)
                : solo.loadedMile,
            soloPerStop: solo?.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                    solo?.perStop
                )
                : null,
            perMileSolo: solo?.perMile ? String(solo?.perMile) : solo?.perMile,
            teamEmptyMile: team?.emptyMile
                ? String(team?.emptyMile)
                : team?.emptyMile,
            teamLoadedMile: team?.loadedMile
                ? String(team?.loadedMile)
                : team?.loadedMile,
            teamPerStop: team?.perStop
                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                    team?.perStop
                )
                : null,
            perMileTeam: team?.perMile ? String(team?.perMile) : team?.perMile,
            commissionSolo: solo?.commission,
            commissionTeam: team?.commission,
            driverCommission:
                this.fleetType === DriverModalStringEnum.SOLO
                    ? solo?.commission
                    : this.fleetType === DriverModalStringEnum.TEAM
                        ? team?.commission
                        : null,
            flatRateSolo: solo?.flatRate,
            flatRateTeam: team?.flatRate,

            isOpenPayrollShared,
            isPayrollCalculated,

            bankId: bank?.name ?? null,
            account: bank?.account,
            routing: bank?.routing,
            offDutyLocationItems: JSON.stringify(
                this.updatedOffDutyLocationItems
            ),
            emergencyContactName: emergencyContact?.name,
            emergencyContactPhone: emergencyContact?.phone,
            emergencyContactRelationship: emergencyContact?.relationship,
            files: files?.length ? JSON.stringify(files) : null,
            note,

            /*   avatar, */
            twic,
            twicExpDate: twicExpDate
                ? MethodsCalculationsHelper.convertDateFromBackend(twicExpDate)
                : null,
            mvrExpiration,
            mailNotificationGeneral: general?.mail,
            pushNotificationGeneral: general?.push,
            smsNotificationGeneral: general?.sms,
            mailNotificationPayroll: payroll?.mail,
            pushNotificationPayroll: payroll?.push,
            smsNotificationPayroll: payroll?.sms,
        });

        // owner
        if (owner) {
            const activeOwnerTab = this.ownerTabs
                .map((tab) => {
                    return {
                        ...tab,
                        checked: owner?.type === tab.name,
                    };
                })
                .find((tab) => tab.checked);

            if (activeOwnerTab) this.onOwnerTabChange(activeOwnerTab);

            this.selectedOwner = this.ownersDropdownList?.find(
                (companyOwner) => companyOwner.id === owner.id
            );
        }

        setTimeout(() => {
            this.startFormChanges();

            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    private updateDriverById(id: number): void {
        const {
            // eslint-disable-next-line no-unused-vars
            ownerId, // eslint-disable-next-line no-unused-vars
            payType, // eslint-disable-next-line no-unused-vars
            bankId, // eslint-disable-next-line no-unused-vars
            offDutyLocationItems, // eslint-disable-next-line no-unused-vars
            files, // eslint-disable-next-line no-unused-vars
            tags,

            dateOfBirth,
            addressUnit,
            isOwner,
            ownerType,
            twic,
            twicExpDate,
            mailNotificationGeneral,
            pushNotificationGeneral,
            smsNotificationGeneral,
            mailNotificationPayroll,
            pushNotificationPayroll,
            smsNotificationPayroll,

            payrollType,

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

            driverCommission,

            flatRateSolo,
            flatRateTeam,

            isOpenPayrollShared,
            isPayrollCalculated,

            ...form
        } = this.driverForm.value;

        const {
            convertedDate,
            conditionalOwnerType,
            conditionalOwnerId,
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
            soloDriver,
            teamDriver,
            twic,
            twicExpDate
        );

        const {
            conditionalDriverType,
            conditionalSoloEmptyMile,
            conditionalSoloLoadedMile,
            conditionalSoloPerStop,
            conditionalPerMileSolo,
            conditionalTeamEmptyMile,
            conditionalTeamLoadedMile,
            conditionalTeamPerStop,
            conditionalPerMileTeam,
            conditionalCommissionSolo,
            conditionalCommissionTeam,
            conditionalFlatRateSolo,
            conditionalFlatRateTeam,
            conditionalPayrollShared,
            conditionalPayrollCalculated,
        } = this.createAddOrUpdateDriverPayrollProperties(
            isOwner,
            payrollType,
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
            driverCommission,
            flatRateSolo,
            flatRateTeam,
            isOpenPayrollShared,
            isPayrollCalculated
        );

        const newData = {
            ...form,
            id,

            dateOfBirth: convertedDate,
            address: this.selectedAddress,

            isOwner,
            ownerType: conditionalOwnerType,
            ownerId: conditionalOwnerId,

            driverType: conditionalDriverType,

            payType: this.selectedPayType?.id ?? null,

            soloDriver: conditionalSoloDriver,
            teamDriver: conditionalTeamDriver,

            solo: {
                emptyMile: conditionalSoloEmptyMile,
                loadedMile: conditionalSoloLoadedMile,
                perStop: conditionalSoloPerStop,
            },
            perMileSolo: conditionalPerMileSolo,

            team: {
                emptyMile: conditionalTeamEmptyMile,
                loadedMile: conditionalTeamLoadedMile,
                perStop: conditionalTeamPerStop,
            },
            perMileTeam: conditionalPerMileTeam,

            commissionSolo: conditionalCommissionSolo,
            commissionTeam: conditionalCommissionTeam,

            flatRateSolo: conditionalFlatRateSolo,
            flatRateTeam: conditionalFlatRateTeam,

            isOpenPayrollShared: conditionalPayrollShared ?? false,
            isPayrollCalculated: conditionalPayrollCalculated,

            fleetType: this.fleetType,

            bankId: this.selectedBank?.id ?? null,

            offDutyLocations: this.offDutyLocationItems,

            files: convertedDocuments,
            tags: convertedTagsArray,

            twic,
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

        this.driverService
            .updateDriver(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                    this.updateTags();
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
