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

// constants
import { DriverModalConstants } from '@pages/driver/pages/driver-modals/driver-modal/utils/constants/driver-modal.constants';

// models
import {
    AddressEntity,
    BankResponse,
    CheckOwnerSsnEinResponse,
    CreateResponse,
    EnumValue,
    GetDriverModalResponse,
    OffDutyLocationResponse,
} from 'appcoretruckassist';
import { DropZoneConfig } from '@shared/components/ta-upload-files/components/ta-upload-dropzone/ta-upload-dropzone.component';
import { Tabs } from '@shared/models/tabs.model';
import { AnimationObject } from '@pages/driver/pages/driver-modals/driver-modal/models/animation-object.model';
import { AddUpdateDriverProperties } from '@pages/driver/pages/driver-modals/driver-modal/models/add-update-driver-properties.model';

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
    public animationObject: AnimationObject;

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

    // Delete when back coming
    public hasMilesSameRate: boolean = false;
    public fleetType: string = 'Solo';
    public payrollCompany: any;
    public loadingOwnerEin: boolean = false;
    public isCardAnimationDisabled: boolean = false;

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

            soloFlatRate: [null, perStopValidation],
            teamFlatRate: [null, perStopValidation],

            commissionSolo: [25],
            commissionTeam: [25],
            driverCommission: [25],

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
            mailNotificationPayroll: [false],
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
            /*    if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);
                return;
            } */

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

    public onSelectDropdown(event: any, action: string): void {
        switch (action) {
            case 'bank':
                this.selectedBank = event;
                if (!event)
                    this.driverForm
                        .get(DriverModalStringEnum.BANK_ID)
                        .patchValue(null);

                this.onBankSelected();

                break;
            case 'paytype':
                const requiredFields = [
                    'soloEmptyMile',
                    'soloLoadedMile',
                    'perMileSolo',
                    'teamEmptyMile',
                    'teamLoadedMile',
                    'perMileTeam',
                    'soloFlatRate',
                    'teamFlatRate',
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

                // Per Mile
                if (this.selectedPayType?.id === 1) {
                    if (this.fleetType === 'Solo') {
                        if (this.hasMilesSameRate) {
                            this.inputService.changeValidators(
                                this.driverForm.get('perMileSolo')
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.driverForm.get('soloEmptyMile')
                            );
                            this.inputService.changeValidators(
                                this.driverForm.get('soloLoadedMile')
                            );
                        }
                    } else if (this.fleetType === 'Team') {
                        if (this.hasMilesSameRate) {
                            this.inputService.changeValidators(
                                this.driverForm.get('perMileTeam')
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.driverForm.get('teamEmptyMile')
                            );
                            this.inputService.changeValidators(
                                this.driverForm.get('teamLoadedMile')
                            );
                        }
                    } else if (this.fleetType === 'Combined') {
                        this.inputService.changeValidators(
                            this.driverForm.get('soloEmptyMile')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('soloLoadedMile')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamEmptyMile')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamLoadedMile')
                        );
                    }
                }
                // Flat Rate
                else if (this.selectedPayType?.id === 3) {
                    if (this.fleetType === 'Solo') {
                        this.inputService.changeValidators(
                            this.driverForm.get('soloFlatRate')
                        );
                    } else if (this.fleetType === 'Team') {
                        this.inputService.changeValidators(
                            this.driverForm.get('teamFlatRate')
                        );
                    } else if (this.fleetType === 'Combined') {
                        this.inputService.changeValidators(
                            this.driverForm.get('soloFlatRate')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamFlatRate')
                        );
                    }
                }

                break;
            default:
                break;
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

    public handlingPayrollFleetType(
        fleetType: string,
        dropdownsInit: boolean = false
    ): void {
        if (fleetType === 'Combined') {
            if (dropdownsInit) {
                this.driverForm.get('teamDriver').patchValue(true);
                this.driverForm.get('soloDriver').patchValue(true);
            }

            this.driverForm
                .get('soloDriver')
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((val) => {
                    if (
                        !val &&
                        !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                            .value
                    ) {
                        this.driverForm.get('teamDriver').patchValue(true);
                        this.inputService.changeValidators(
                            this.driverForm.get('soloEmptyMile'),
                            false,
                            [],
                            false
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('soloLoadedMile'),
                            false,
                            [],
                            false
                        );
                    }
                });

            this.driverForm
                .get('teamDriver')
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((val) => {
                    if (
                        !val &&
                        !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                            .value
                    ) {
                        this.driverForm.get('soloDriver').patchValue(true);
                        this.inputService.changeValidators(
                            this.driverForm.get('teamEmptyMile'),
                            false,
                            [],
                            false
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamLoadedMile'),
                            false,
                            [],
                            false
                        );
                    }
                });
        }
    }

    private getDriverDropdowns(): void {
        this.driverService
            .getDriverDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: GetDriverModalResponse) => {
                    this.banksDropdownList = data.banks;
                    this.payTypeDropdownList = data.payTypes;
                    this.driverForm
                        .get('mvrExpiration')
                        .patchValue(data.mvrExpiration);
                    this.fleetType = data.fleetType;
                    this.hasMilesSameRate = data.loadedAndEmptySameRate;
                    this.tags = data.tags;

                    if (['Solo', 'Combined'].includes(this.fleetType)) {
                        this.driverForm
                            .get('soloEmptyMile')
                            .patchValue(
                                data.solo?.emptyMile
                                    ? data.solo.emptyMile
                                    : null
                            );

                        this.driverForm
                            .get('soloLoadedMile')
                            .patchValue(
                                data.solo?.loadedMile
                                    ? data.solo.loadedMile
                                    : null
                            );

                        this.driverForm
                            .get('soloPerStop')
                            .patchValue(
                                data.solo?.perStop
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          data.solo?.perStop
                                              ? data.solo.perStop
                                              : null
                                      )
                                    : null
                            );

                        this.driverForm
                            .get('soloFlatRate')
                            .patchValue(
                                data.soloFlatRate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          data.soloFlatRate
                                      )
                                    : null
                            );

                        this.driverForm
                            .get('perMileSolo')
                            .patchValue(data.perMileSolo);

                        if (data.defaultSoloDriverCommission) {
                            this.driverForm
                                .get('commissionSolo')
                                .patchValue(data.defaultSoloDriverCommission);
                        }
                    }

                    if (['Team', 'Combined'].includes(this.fleetType)) {
                        this.driverForm
                            .get('teamEmptyMile')
                            .patchValue(
                                data.team?.emptyMile
                                    ? data.team.emptyMile
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('teamLoadedMile')
                            .patchValue(
                                data.team?.loadedMile
                                    ? data.team.loadedMile
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('teamPerStop')
                            .patchValue(
                                data.team?.perStop
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          data.team?.perStop
                                              ? data.team.perStop
                                              : null
                                      )
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('teamFlatRate')
                            .patchValue(
                                data.teamFlatRate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          data.teamFlatRate
                                      )
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('perMileTeam')
                            .patchValue(data.perMileTeam, { emitEvent: false });

                        if (data.defaultTeamDriverCommission) {
                            this.driverForm
                                .get('commissionTeam')
                                .patchValue(data.defaultTeamDriverCommission, {
                                    emitEvent: false,
                                });
                        }
                    }

                    this.payrollCompany = {
                        solo: {
                            emptyMile: data.solo?.emptyMile
                                ? data.solo.emptyMile
                                : null,
                            loadedMile: data.solo?.loadedMile
                                ? data.solo.loadedMile
                                : null,
                            perStop: data.solo?.perStop
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      data.solo.perStop
                                  )
                                : null,
                            perMileSolo: data.perMileSolo,
                            commissionSolo: data.defaultSoloDriverCommission
                                ? data.defaultSoloDriverCommission
                                : this.driverForm.get('commissionSolo').value,
                            soloFlatRate: data.soloFlatRate
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      data.soloFlatRate
                                  )
                                : null,
                        },
                        team: {
                            emptyMile: data.team?.emptyMile
                                ? data.team.emptyMile
                                : null,
                            loadedMile: data.team?.loadedMile
                                ? data.team.loadedMile
                                : null,
                            perStop: data.team?.perStop
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      data.team.perStop
                                  )
                                : null,
                            perMileTeam: data.perMileTeam,
                            commissionTeam: data.defaultTeamDriverCommission
                                ? data.defaultTeamDriverCommission
                                : this.driverForm.get('commissionTeam').value,
                            teamFlatRate: data.teamFlatRate
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      data.teamFlatRate
                                  )
                                : null,
                        },
                        mvrExpiration: data.mvrExpiration
                            ? data.mvrExpiration
                            : 12,
                    };

                    this.handlingPayrollFleetType(this.fleetType, true);

                    if (this.editData) {
                        this.isCardAnimationDisabled = true;
                        this.getDriverById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    public validateMiles(): void {
        if (['Solo', 'Combined'].includes(this.fleetType)) {
            this.driverForm
                .get('soloEmptyMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('soloEmptyMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('soloEmptyMile').setErrors(null);
                    }
                });

            this.driverForm
                .get('soloLoadedMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('soloLoadedMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('soloLoadedMile').setErrors(null);

                        this.driverForm.get('soloEmptyMile').patchValue(value);
                    }
                });
        }

        if (['Team', 'Combined'].includes(this.fleetType)) {
            this.driverForm
                .get('teamEmptyMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('teamEmptyMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('teamEmptyMile').setErrors(null);
                    }
                });

            this.driverForm
                .get('teamLoadedMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('teamLoadedMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('teamLoadedMile').setErrors(null);

                        this.driverForm.get('teamEmptyMile').patchValue(value);
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
                    this.loadingOwnerEin = true;
                    this.driverService
                        .checkOwnerEinNumber(value.toString())
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: CheckOwnerSsnEinResponse) => {
                                this.selectedOwner = res?.name ? res : null;

                                this.loadingOwnerEin = false;

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

    private createAddOrUpdateDriverProperties(
        dateOfBirth: string,
        addressUnit: string,
        isOwner: boolean,
        ownerType: string,
        ein: string,
        bussinesName: string,
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

    private getDriverById(id: number): void {
        this.driverService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.driverForm.patchValue({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        phone: res.phone,
                        email: res.email,
                        address: res.address ? res.address.address : null,
                        addressUnit: res.address
                            ? res.address.addressUnit
                            : null,
                        dateOfBirth:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                res.dateOfBirth
                            ),
                        ssn: res.ssn,
                        mvrExpiration: res.mvrExpiration,
                        bankId: res.bank ? res.bank.name : null,
                        account: res.account,
                        routing: res.routing,
                        payType: res.payType ? res.payType.name : null,
                        soloPerStop: res.solo.perStop
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.solo.perStop
                              )
                            : null,
                        soloDriver: res.soloDriver,
                        teamPerStop: res.team.perStop
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.team.perStop
                              )
                            : null,
                        teamDriver: res.teamDriver,
                        commissionSolo: res.commissionSolo,
                        commissionTeam: res.commissionTeam,
                        ownerId: res.owner ? res.owner.id : null,
                        useCarrieraACH: res.useTruckAssistAch,
                        isOwner: !!res.owner,
                        ownerType: res.owner
                            ? res.owner?.ownerType?.name
                                ? res.owner?.ownerType?.name.includes(
                                      'Proprietor'
                                  )
                                    ? 'Sole'.concat(
                                          ' ',
                                          res.owner?.ownerType?.name
                                      )
                                    : res.owner?.ownerType?.name
                                : null
                            : null,
                        ein: res.owner
                            ? res.owner?.ownerType?.name.includes('Proprietor')
                                ? null
                                : res.owner?.ssnEin
                            : null,
                        bussinesName: res.owner
                            ? res.owner?.ownerType?.name.includes('Proprietor')
                                ? null
                                : res.owner?.name
                            : null,
                        emergencyContactName: res.emergencyContactName,
                        emergencyContactPhone: res.emergencyContactPhone,
                        emergencyContactRelationship:
                            res.emergencyContactRelationship,

                        note: res.note,
                        avatar: res.avatar ? res.avatar : null,

                        twic: res.twic,
                        twicExpDate: res.twicExpDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.twicExpDate
                              )
                            : null,
                        fuelCard: res.fuelCard,

                        mailNotificationGeneral: res.general.mailNotification,
                        pushNotificationGeneral: res.general.pushNotification,
                        smsNotificationGeneral: res.general.smsNotification,

                        mailNotificationPayroll: res.payroll.mailNotification,
                        pushNotificationPayroll: res.payroll.pushNotification,
                        smsNotificationPayroll: res.payroll.smsNotification,
                        files: res.files?.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.driverForm
                        .get('soloLoadedMile')
                        .patchValue(
                            res.solo?.loadedMile ? res.solo.loadedMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('teamLoadedMile')
                        .patchValue(
                            res.team?.loadedMile ? res.team.loadedMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('soloEmptyMile')
                        .patchValue(
                            res.solo?.emptyMile ? res.solo.emptyMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('teamEmptyMile')
                        .patchValue(
                            res.team?.emptyMile ? res.team.emptyMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('soloFlatRate')
                        .patchValue(
                            ['Solo', 'Combined'].includes(res.fleetType.name)
                                ? res.soloFlatRate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          res.soloFlatRate
                                      )
                                    : null
                                : null,
                            { emitEvent: false }
                        );

                    this.driverForm
                        .get('teamFlatRate')
                        .patchValue(
                            ['Team', 'Combined'].includes(res.fleetType.name)
                                ? res.teamFlatRate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          res.teamFlatRate
                                      )
                                    : null
                                : null,
                            { emitEvent: false }
                        );

                    this.driverForm
                        .get('perMileSolo')
                        .patchValue(res.perMileSolo, {
                            emitEvent: false,
                        });

                    this.driverForm
                        .get('perMileTeam')
                        .patchValue(res.perMileSolo, {
                            emitEvent: false,
                        });

                    res.firstName =
                        res.firstName.charAt(0).toUpperCase() +
                        res.firstName.slice(1);

                    res.lastName =
                        res.lastName.charAt(0).toUpperCase() +
                        res.lastName.slice(1);

                    this.driverFullName = res.firstName.concat(
                        ' ',
                        res.lastName
                    );

                    this.selectedBank = res.bank ? res.bank : null;

                    this.isBankSelected = !!this.selectedBank;

                    this.documents = res.files;

                    this.selectedPayType = res.payType
                        ? res.payType.id === 0
                            ? null
                            : res.payType
                        : null;

                    this.onHandleAddress({
                        address: res.address,
                        valid: !!res.address,
                        longLat: {
                            longitude: res.longitude,
                            latitude: res.latitude,
                        },
                    });

                    this.modalService.changeModalStatus({
                        name: 'deactivate',
                        status: res.status !== 1,
                    });

                    this.driverStatus = res.status !== 1;

                    this.fleetType = res.fleetType.name;

                    this.handlingPayrollFleetType(this.fleetType);

                    if (res.owner) {
                        if (
                            this.driverForm.get(DriverModalStringEnum.EIN).value
                        ) {
                            this.einNumberChange();
                        }

                        const activeOwnerTab = this.ownerTabs
                            .map((item) => {
                                return {
                                    ...item,
                                    checked:
                                        res.owner?.ownerType.name === item.name,
                                };
                            })
                            .find((item) => item.checked);

                        if (activeOwnerTab) {
                            this.onOwnerTabChange(activeOwnerTab);
                        }
                    }

                    this.startFormChanges();
                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
                error: () => {},
            });
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

            soloDriver,
            teamDriver,

            ...form
        } = this.driverForm.value;

        console.log('...form', form);

        const {
            convertedDate,
            conditionalOwnerType,
            conditionalOwnerId,
            conditionalEin,
            conditionalBussinesName,
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
            twic,
            twicExpDate
        );

        const newData = {
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
            /* SOLO TEAM */
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

            /*
            solo:
                this.selectedPayType?.name === 'Per Mile'
                    ? {
                          emptyMile: !this.hasMilesSameRate
                              ? ['Solo', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? soloDriver
                                          ? soloEmptyMile
                                              ? parseFloat(soloEmptyMile)
                                              : null
                                          : null
                                      : soloEmptyMile
                                      ? parseFloat(soloEmptyMile)
                                      : null
                                  : null
                              : null,

                          loadedMile: !this.hasMilesSameRate
                              ? ['Solo', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? soloDriver
                                          ? soloLoadedMile
                                              ? parseFloat(soloLoadedMile)
                                              : null
                                          : null
                                      : soloLoadedMile
                                      ? parseFloat(soloLoadedMile)
                                      : null
                                  : null
                              : null,
                          perStop: !this.hasMilesSameRate
                              ? ['Solo', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
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
                              : null,
                      }
                    : null,
            perMileSolo:
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Solo', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
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
            team:
                this.selectedPayType?.name === 'Per Mile'
                    ? {
                          emptyMile: !this.hasMilesSameRate
                              ? ['Team', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? teamDriver
                                          ? teamEmptyMile
                                              ? parseFloat(teamEmptyMile)
                                              : null
                                          : null
                                      : teamEmptyMile
                                      ? parseFloat(teamEmptyMile)
                                      : null
                                  : null
                              : null,
                          loadedMile: !this.hasMilesSameRate
                              ? ['Team', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? teamDriver
                                          ? teamLoadedMile
                                              ? parseFloat(teamLoadedMile)
                                              : null
                                          : null
                                      : teamLoadedMile
                                      ? parseFloat(teamLoadedMile)
                                      : null
                                  : null
                              : null,
                          perStop: !this.hasMilesSameRate
                              ? ['Team', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
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
                              : null,
                      }
                    : null,
            perMileTeam:
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Team', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Commission'
                    ? ['Solo', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Commission'
                    ? ['Team', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Flat Rate'
                    ? soloFlatRate
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              soloFlatRate
                          )
                        : null
                    : null,
            teamFlatRate:
                this.selectedPayType?.name === 'Flat Rate'
                    ? teamFlatRate
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              teamFlatRate
                          )
                        : null
                    : null,
            
           
            fleetType: this.fleetType,
            soloDriver: !this.driverForm.get(DriverModalStringEnum.IS_OWNER).value
                ? this.fleetType === 'Combined'
                    ? soloDriver
                    : false
                : null,
            teamDriver: !this.driverForm.get(DriverModalStringEnum.IS_OWNER).value
                ? this.fleetType === 'Combined'
                    ? teamDriver
                    : false
                : null,
           */
        };

        console.log('newData', newData);

        /*   this.driverService
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
                        this.driverForm.get(DriverModalStringEnum.OWNER_TYPE).patchValue(null);
                        this.driverForm.get('payType').patchValue(null);

                        this.onTabChange({ id: 1 });

                        this.driverForm
                            .get('soloEmptyMile')
                            .patchValue(this.payrollCompany.solo.emptyMile);
                        this.driverForm
                            .get('soloLoadedMile')
                            .patchValue(this.payrollCompany.solo.loadedMile);
                        this.driverForm
                            .get('soloPerStop')
                            .patchValue(this.payrollCompany.solo.perStop);
                        this.driverForm
                            .get('perMileSolo')
                            .patchValue(this.payrollCompany.solo.perMileSolo);
                        this.driverForm
                            .get('commissionSolo')
                            .patchValue(
                                this.payrollCompany.solo.commissionSolo
                            );

                        this.driverForm
                            .get('soloFlatRate')
                            .patchValue(this.payrollCompany.solo.soloFlatRate);

                        this.driverForm
                            .get('teamEmptyMile')
                            .patchValue(this.payrollCompany.team.emptyMile);
                        this.driverForm
                            .get('teamLoadedMile')
                            .patchValue(this.payrollCompany.team.loadedMile);
                        this.driverForm
                            .get('teamPerStop')
                            .patchValue(this.payrollCompany.team.perStop);
                        this.driverForm
                            .get('perMileTeam')
                            .patchValue(this.payrollCompany.team.perMileTeam);
                        this.driverForm
                            .get('commissionTeam')
                            .patchValue(
                                this.payrollCompany.team.commissionTeam
                            );

                        this.driverForm
                            .get('teamFlatRate')
                            .patchValue(this.payrollCompany.team.teamFlatRate);

                        this.driverForm
                            .get('mvrExpiration')
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

                        this.driverForm.get(DriverModalStringEnum.IS_OWNER).patchValue(false);

                        if (this.fleetType === 'Combined') {
                            this.driverForm.get('teamDriver').patchValue(true);
                            this.driverForm.get('soloDriver').patchValue(true);
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
            }); */
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
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Solo', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
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
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Solo', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
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
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Solo', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Solo', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
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
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Team', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
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
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Team', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
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
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Team', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Team', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Commission'
                    ? ['Solo', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Commission'
                    ? ['Team', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
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
                this.selectedPayType?.name === 'Flat Rate'
                    ? soloFlatRate
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              soloFlatRate
                          )
                        : null
                    : null,
            teamFlatRate:
                this.selectedPayType?.name === 'Flat Rate'
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
                ? this.fleetType === 'Combined'
                    ? soloDriver
                    : false
                : null,
            teamDriver: !this.driverForm.get(DriverModalStringEnum.IS_OWNER)
                .value
                ? this.fleetType === 'Combined'
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
