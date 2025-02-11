import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';

// components
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaLogoChangeComponent } from '@shared/components/ta-logo-change/ta-logo-change.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';
import { CaUploadFilesComponent, CaInputAddressDropdownComponent } from 'ca-components';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// utils
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// validations
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    customerCreditValidation,
    defaultBaseValidation,
    departmentValidation,
    iftaValidation,
    irpValidation,
    mcFFValidation,
    mileValidation,
    monthsValidRegex,
    nicknameValidation,
    perLoadValidation,
    perStopValidation,
    phoneExtension,
    prefixValidation,
    routingBankValidation,
    scacValidation,
    suffixValidation,
    tollValidation,
    urlValidation,
    usdotValidation,
    einNumberRegex,
    phoneFaxRegex,
    startingValidation,
    cvcValidation,
    bankCardTypeValidation,
    emailValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// constants
import { SettingsModalConstants } from '@pages/settings/pages/settings-company/utils/constants/settings-modal.constants';

//config
import { SettingsBasicModalUploadFileConfig } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-basic-modal/utils/config';

// enums
import { SettingsModalEnum } from '@pages/settings/pages/settings-company/enums/settings-modal.enum';
import { SettingsFormEnum } from '@pages/settings/pages/settings-modals/enums';

// models
import {
    AddressEntity,
    CreateDivisionCompanyCommand,
    CreateResponse,
    UpdateCompanyCommand,
    UpdateDivisionCompanyCommand,
    BankResponse,
    EnumValue,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';
import { EditData } from '@shared/models/edit-data.model';
import { AnimationOptions } from '@shared/models/animation-options.model';

// svg routes
import { SettingsModalSvgRoutes } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-basic-modal/utils/svg-routes';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

@Component({
    selector: 'app-settings-basic-modal',
    templateUrl: './settings-basic-modal.component.html',
    styleUrls: ['./settings-basic-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService, BankVerificationService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
        TaModalComponent,
        TaCheckboxComponent,
        TaTabSwitchComponent,
        TaCheckboxCardComponent,
        TaNgxSliderComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaLogoChangeComponent,
        CaUploadFilesComponent,
    ],
})
export class SettingsBasicModalComponent
    extends AddressMixin(class { addressService!: AddressService; })
    implements OnDestroy, OnInit
{
    @Input() editData: EditData;

    public destroy$ = new Subject<void>();

    public companyForm: UntypedFormGroup;

    public uploadFilesConfig = SettingsBasicModalUploadFileConfig.SETTINGS_BASIC_MODAL_UPLOAD_FILES_CONFIG;

    public isFormDirty: boolean = false;
    public isSetupCompany: boolean = false;

    public isCardAnimationDisabled: boolean = false;
    public svgRoutes = SettingsModalSvgRoutes;

    // tabs
    public selectedTab: number = 1;

    public tabs: Tabs[];
    public tabsDivision: Tabs[];
    public prefferedLoadTabs: Tabs[];
    public fleetTypeTabs: Tabs[];

    // options
    public driverCommissionOptions: Options;
    public ownerCommissionOptions: Options;
    public commonOptions: Options;
    public dispatcherOptions: Options;
    public managerOptions: Options;

    public dropZoneConfig: DropZoneConfig;

    public animationObject: AnimationOptions;

    // basic tab
    public selectedAddress: AddressEntity;
    public selectedTimeZone: any = null;
    public selectedCurrency: any = null;

    // additional tab
    public selectedDepartmentFormArray: any[] = [];

    public selectedBankAccountFormArray: any[] = [];
    public isBankSelectedFormArray: boolean[] = [];
    public bankCardTypes: string[] = [];

    // dropdowns
    public banks: BankResponse[] = [];
    public payPeriods: EnumValue[] = [];
    public endingIns: EnumValue[] = [];
    public timeZones: EnumValue[] = [];
    public currencies: EnumValue[] = [];
    public departments: EnumValue[] = [];
    public companyData: EnumValue[] = [];
    public payTermOptions: EnumValue[] = [];

    public selectedCompanyData: EnumValue = null;
    public selectedDriverPayPeriod: EnumValue = null;
    public selectedDriverEndingIn: EnumValue = null;
    public selectedAccountingPayPeriod: EnumValue = null;
    public selectedAccountingEndingIn: EnumValue = null;
    public selectedCompanyPayPeriod: EnumValue = null;
    public selectedCompanyEndingIn: EnumValue = null;
    public selectedDispatchPayPeriod: EnumValue = null;
    public selectedDispatchEndingIn: EnumValue = null;
    public selectedManagerPayPeriod: EnumValue = null;
    public selectedManagerEndingIn: EnumValue = null;
    public selectedRecPayPeriod: EnumValue = null;
    public selectedRecEndingIn: EnumValue = null;
    public selectedRepairPayPeriod: EnumValue = null;
    public selectedRepairEndingIn: EnumValue = null;
    public selectedSafetyPayPeriod: EnumValue = null;
    public selectedSafetyEndingIn: EnumValue = null;
    public selectedOtherPayPeriod: EnumValue = null;
    public selectedOtherEndingIn: EnumValue = null;
    public selectedFleetType: string = null;
    public selectedPayTerm: EnumValue = null;

    // logo actions
    public displayDeleteAction: boolean = false;
    public displayUploadZone: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsCompanyService: SettingsCompanyService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        public addressService: AddressService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();

        this.getModalDropdowns();

        this.getConstantData();

        this.checkForCompany();

        this.validateCreditCards();

        this.uploadFilesConfig = {
            ...SettingsBasicModalUploadFileConfig.SETTINGS_BASIC_MODAL_UPLOAD_FILES_CONFIG,
            files: [{ url: this.editData?.company?.logoFile?.url }]
        }
    }

    private getConstantData(): void {
        // tabs
        this.tabs = JSON.parse(JSON.stringify(SettingsModalConstants.TABS));
        this.tabsDivision = JSON.parse(
            JSON.stringify(SettingsModalConstants.TABS_DIVISION)
        );
        this.prefferedLoadTabs = JSON.parse(
            JSON.stringify(SettingsModalConstants.PREFERED_LOAD_BTNS)
        );
        this.fleetTypeTabs = JSON.parse(
            JSON.stringify(SettingsModalConstants.FLEET_TYPE_BTNS)
        );

        // options
        this.driverCommissionOptions =
            SettingsModalConstants.DRIVER_COMMISSION_OPTIONS;
        this.ownerCommissionOptions =
            SettingsModalConstants.OWNER_COMMISSION_OPTIONS;
        this.commonOptions = SettingsModalConstants.COMMON_OPTIONS;
        this.dispatcherOptions = SettingsModalConstants.DISPATCHER_OPTIONS;
        this.managerOptions = SettingsModalConstants.MANAGER_OPTIONS;

        this.animationObject = SettingsModalConstants.ANIMATION_OPTIONS;

        this.dropZoneConfig = SettingsModalConstants.DROPZONE_CONFIG;
    }

    private checkForCompany(): void {
        setTimeout(() => {
            switch (this.editData.type) {
                case SettingsModalEnum.NEW_DIVISION:
                case SettingsModalEnum.EDIT_DIVISION:
                    this.createDivisionForm();

                    const handleCompanyPreselectedValues = () => {
                        const {
                            company: {
                                additionalInfo: {
                                    payTerm,
                                    customerCredit,
                                    mvrMonths,
                                    truckInspectionMonths,
                                    trailerInspectionMonths,
                                },
                            },
                        } = this.editData;

                        this.selectedPayTerm = this.payTermOptions?.find(
                            (payTermOption) => payTermOption?.id === payTerm
                        );

                        this.companyForm.patchValue({
                            starting: SettingsFormEnum.STARTING_NO,
                            payTerm: this.selectedPayTerm?.name ?? null,
                            customerCredit,
                            mvrMonths,
                            truckInspectionMonths,
                            trailerInspectionMonths,
                        });
                    };

                    this.editData.type === SettingsModalEnum.NEW_DIVISION
                        ? handleCompanyPreselectedValues()
                        : this.editCompanyDivision();

                    break;
                case SettingsModalEnum.EDIT_COMPANY:
                case SettingsModalEnum.PAYROLL_TAB:
                    this.editCompany(this.editData.company);

                    if (this.editData.type === SettingsModalEnum.PAYROLL_TAB)
                        this.tabChange({ id: 3 });

                    break;
                case SettingsModalEnum.EDIT_COMPANY_FIRST_LOGIN:
                    this.isSetupCompany = true;

                    this.settingsCompanyService
                        .getCompany()
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((data) => {
                            this.editCompany(data);

                            this.editData.data = data;
                        });

                    break;
                default:
                    break;
            }

            if (!this.editData.type.includes(SettingsFormEnum.DIVISION)) {
                this.validateMiles();
                this.onSamePerMileCheck();
            }

            this.isCardAnimationDisabled = true;

            this.formService.checkFormChange(this.companyForm);

            this.formService.formValueChange$
                .pipe(takeUntil(this.destroy$))
                .subscribe((isFormChange: boolean) => {
                    this.isFormDirty = isFormChange;
                });
        }, 500);
    }

    private createDivisionForm(): void {
        this.inputService.changeValidators(
            this.companyForm.get(SettingsModalEnum.STARTING),
            false
        );

        this.inputService.changeValidators(
            this.companyForm.get(SettingsModalEnum.MVR_MONTHS),
            false
        );

        this.inputService.changeValidators(
            this.companyForm.get(SettingsModalEnum.TRUCK_INSPECTION_MONTHS),
            false
        );

        this.inputService.changeValidators(
            this.companyForm.get(SettingsModalEnum.TRAILER_INSPECTION_MONTHS),
            false
        );
    }

    private createForm(): void {
        this.companyForm = this.formBuilder.group({
            // basic tab
            name: [null, Validators.required],
            usDot: [null, [Validators.required, ...usdotValidation]],
            ein: [null, einNumberRegex],
            mc: [null, [...mcFFValidation]],
            phone: [null, phoneFaxRegex],
            email: [null],
            fax: [null, phoneFaxRegex],
            webUrl: [null, urlValidation],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            irp: [null, irpValidation],
            ifta: [null, iftaValidation],
            toll: [null, tollValidation],
            scac: [null, scacValidation],
            timeZone: [null, Validators.required],
            currency: [null, Validators.required],
            companyType: [null],
            dateOfIncorporation: [null],
            logo: [null],
            // additional tab
            departmentContacts: this.formBuilder.array([]),
            bankAccounts: this.formBuilder.array([]),
            bankCards: this.formBuilder.array([]),
            prefix: [null, prefixValidation],
            starting: [null, [Validators.required, ...startingValidation]],
            suffix: [null, suffixValidation],
            factorByDefault: [false],
            autoInvoicing: [false],
            preferredLoadType: [SettingsModalEnum.FTL],
            fleetType: [SettingsModalEnum.SOLO],
            hazMat: [false],
            payTerm: [null],
            customerCredit: [null, customerCreditValidation],
            mvrMonths: [12, [Validators.required, monthsValidRegex]],
            truckInspectionMonths: [
                12,
                [Validators.required, monthsValidRegex],
            ],
            trailerInspectionMonths: [
                12,
                [Validators.required, monthsValidRegex],
            ],
            driverMiles: [
                !this.editData.type.includes(SettingsFormEnum.DIVISION),
            ],
            driverComission: [
                !this.editData.type.includes(SettingsFormEnum.DIVISION),
            ],
            driverFlatRate: [
                !this.editData.type.includes(SettingsFormEnum.DIVISION),
            ],
            // payroll tab
            useACHPayout: [true],
            // driver & owner
            driveOwnerPayPeriod: [
                SettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            driverOwnerEndingIn: [
                SettingsModalEnum.MONDAY,
                Validators.required,
            ],

            soloEmptyMile: [null, mileValidation],
            soloLoadedMile: [null, mileValidation],
            soloPerStop: [null, perStopValidation],
            soloPerLoad: [null, perLoadValidation],
            perMileSolo: [null, mileValidation],

            teamEmptyMile: [null, mileValidation],
            teamLoadedMile: [null, mileValidation],
            teamPerStop: [null, perStopValidation],
            teamPerLoad: [null, perLoadValidation],
            perMileTeam: [null, mileValidation],

            loadedAndEmptySameRate: [false],
            driverSoloDefaultCommission: [25],
            driverTeamDefaultCommission: [25],
            ownerDefaultCommission: [15],
            // accounting
            accountingPayPeriod: [
                SettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            accountingEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            accountingDefaultBase: [null, defaultBaseValidation],
            // company owner
            companyOwnerPayPeriod: [
                SettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            companyOwnerEndingIn: [
                SettingsModalEnum.MONDAY,
                Validators.required,
            ],
            companyOwnerDefaultBase: [null, defaultBaseValidation],
            // dispatch
            dispatchPayPeriod: [SettingsModalEnum.WEEKLY, Validators.required],
            dispatchEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            dispatchDefaultBase: [null, defaultBaseValidation],
            dispatchDefaultCommission: [5],
            // manager
            managerPayPeriod: [SettingsModalEnum.WEEKLY, Validators.required],
            managerEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            managerDefaultBase: [null, defaultBaseValidation],
            managerDefaultCommission: [2.5],
            // recruiting
            recruitingPayPeriod: [
                SettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            recruitingEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            recruitingDefaultBase: [null, defaultBaseValidation],
            // repair
            repairPayPeriod: [SettingsModalEnum.WEEKLY, Validators.required],
            repairEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            repairDefaultBase: [null, defaultBaseValidation],
            // safety
            safetyPayPeriod: [SettingsModalEnum.WEEKLY, Validators.required],
            safetyEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            safetyDefaultBase: [null, defaultBaseValidation],
            // other
            otherPayPeriod: [SettingsModalEnum.WEEKLY, Validators.required],
            otherEndingIn: [SettingsModalEnum.MONDAY, Validators.required],
            otherDefaultBase: [null, defaultBaseValidation],
        });

        this.inputService.customInputValidator(
            this.companyForm.get(SettingsModalEnum.EMAIL),
            SettingsModalEnum.EMAIL,
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.companyForm.get(SettingsModalEnum.WEB_URL),
            SettingsModalEnum.URL,
            this.destroy$
        );

        if (
            [
                SettingsModalEnum.NEW_DIVISION as string,
                SettingsModalEnum.EDIT_DIVISION,
            ].includes(this.editData.type)
        )
            this.companyForm
                .get(SettingsModalEnum.EMAIL)
                .setValidators(Validators.required);
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case SettingsModalEnum.CLOSE:
                break;
            case SettingsModalEnum.SAVE:
            case SettingsModalEnum.STEPPER_SAVE:
                if (this.companyForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.companyForm);

                    return;
                }

                if (
                    this.editData.type.includes(
                        SettingsModalEnum.EDIT_COMPANY
                    ) ||
                    this.editData.type.includes(SettingsModalEnum.PAYROLL_TAB)
                ) {
                    this.updateCompany();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    if (this.editData.type === SettingsModalEnum.NEW_DIVISION) {
                        this.addCompanyDivision();

                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: false,
                        });
                    } else {
                        this.updateCompanyDivision(this.editData.company.id);

                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: false,
                        });
                    }
                }

                break;
            case 'delete':
                if (!this.editData.company?.divisions.length) {
                    this.deleteCompanyDivisionById(this.editData.company.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: false,
                    });
                }
                break;

            case 'stepper-next':
                this.selectedTab++;

                break;
            case 'stepper-back':
                this.selectedTab--;

                break;
            default:
                break;
        }
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-three-tabs');

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };

        this.tabs = this.tabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });
    }

    public get departmentContacts(): UntypedFormArray {
        return this.companyForm.get('departmentContacts') as UntypedFormArray;
    }

    private createDepartmentContacts(data?: {
        id: any;
        departmentId: any;
        phone: any;
        extensionPhone: any;
        email: any;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            departmentId: [
                data?.departmentId ? data?.departmentId : null,
                [Validators.required, ...departmentValidation],
            ],
            phone: [
                data?.phone ? data?.phone : null,
                [Validators.required, phoneFaxRegex],
            ],
            extensionPhone: [
                data?.extensionPhone ? data?.extensionPhone : null,
                [...phoneExtension],
            ],
            email: [
                data?.email ? data?.email : null,
                [Validators.required, emailValidation],
            ],
        });
    }

    public addDepartmentContacts(event: { check: boolean; action: string }) {
        if (event.check && this.departmentContacts.valid) {
            const form = this.createDepartmentContacts();
            this.departmentContacts.push(form);

            this.inputService.customInputValidator(
                form.get(SettingsModalEnum.EMAIL),
                SettingsModalEnum.EMAIL,
                this.destroy$
            );
        }
    }

    public removeDepartmentContacts(id: number) {
        this.departmentContacts.removeAt(id);
        this.selectedDepartmentFormArray.splice(id, 1);
    }

    public onSelectFakeTableData(event: any, index: number, action: string) {
        switch (action) {
            case 'department': {
                this.selectedDepartmentFormArray[index] = event;
                break;
            }
            case 'bankAccounts': {
                this.selectedBankAccountFormArray[index] = event;
                this.isBankSelectedFormArray[index] = true;
                this.onBankSelected(index);
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSaveNewBank(bank: { data: any; action: string }, index: number) {
        this.selectedBankAccountFormArray[index] = event;
        this.isBankSelectedFormArray[index] = true;
        this.onBankSelected(index);

        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBankAccountFormArray[index] = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.banks = [
                        ...this.banks,
                        this.selectedBankAccountFormArray[index],
                    ];
                },
                error: () => {},
            });
    }

    public get bankAccounts(): UntypedFormArray {
        return this.companyForm.get('bankAccounts') as UntypedFormArray;
    }

    private createBankAccount(data?: {
        id: any;
        bankId: any;
        routing: any;
        account: any;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            bankId: [
                data?.bankId ? data.bankId : null,
                [Validators.required, ...bankValidation],
            ],
            routing: [
                data?.routing ? data.routing : null,
                [Validators.required, ...routingBankValidation],
            ],
            account: [
                data?.account ? data.account : null,
                [Validators.required, ...accountBankValidation],
            ],
        });
    }

    public addBankAccount(event: { check: boolean; action: string }) {
        if (event.check && this.bankAccounts.valid)
            this.bankAccounts.push(this.createBankAccount());
    }

    public removeBankAccount(id: number) {
        this.bankAccounts.removeAt(id);
        this.selectedBankAccountFormArray.splice(id, 1);
        this.isBankSelectedFormArray.splice(id, 1);
    }

    private onBankSelected(index: number): void {
        this.bankAccounts
            .at(index)
            .valueChanges.pipe(
                debounceTime(150),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(async (value) => {
                this.isBankSelectedFormArray[index] =
                    await this.bankVerificationService.onSelectBank(
                        value,
                        this.bankAccounts.at(index).get('routing'),
                        this.bankAccounts.at(index).get('account')
                    );
            });
    }

    public get bankCards(): UntypedFormArray {
        return this.companyForm.get('bankCards') as UntypedFormArray;
    }

    private createBankCard(data?: {
        id: any;
        nickname: any;
        card: any;
        cvc: any;
        expireDate: any;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            nickname: [
                data?.nickname ? data.nickname : null,
                [Validators.required, ...nicknameValidation],
            ],
            card: [
                data?.card ? data.card : null,
                [
                    Validators.minLength(15),
                    Validators.maxLength(16),
                    Validators.required,
                ],
            ],
            cvc: [
                data?.cvc ? data.cvc : null,
                [Validators.required, ...cvcValidation],
            ],
            expireDate: [
                data?.expireDate ? data.expireDate : null,
                [Validators.required],
            ],
        });
    }

    public addBankCard(event: { check: boolean; action: string }) {
        if (event.check && this.bankCards.valid) {
            this.bankCards.push(this.createBankCard());
        }
    }

    public removeBankCard(id: number) {
        this.bankCards.removeAt(id);
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }) {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectDropdown(event: any, action: string): void {
        switch (action) {
            case 'timezone':
                this.selectedTimeZone = event;

                break;
            case SettingsModalEnum.CURRENCY:
                this.selectedCurrency = event;

                break;
            case 'driver-pay-period':
                this.selectedDriverPayPeriod = event;

                this.selectedDriverEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'driver-ending-in':
                this.selectedDriverEndingIn = event;

                break;
            case 'accounting-pay-period':
                this.selectedAccountingPayPeriod = event;

                this.selectedAccountingEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'accounting-ending-in':
                this.selectedAccountingEndingIn = event;

                break;
            case 'companyOwner-pay-period':
                this.selectedCompanyPayPeriod = event;

                this.selectedCompanyEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'companyOwner-ending-in':
                this.selectedCompanyEndingIn = event;

                break;
            case 'dispatch-pay-period':
                this.selectedDispatchPayPeriod = event;

                this.selectedDispatchEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'dispatch-ending-in':
                this.selectedDispatchEndingIn = event;

                break;
            case 'manager-pay-period':
                this.selectedManagerPayPeriod = event;

                this.selectedManagerEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'manager-ending-in':
                this.selectedManagerEndingIn = event;

                break;
            case 'recruiting-pay-period':
                this.selectedRecPayPeriod = event;

                this.selectedRecEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'recruiting-ending-in':
                this.selectedRecEndingIn = event;

                break;
            case 'repair-pay-period':
                this.selectedRepairPayPeriod = event;

                this.selectedRepairEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'repair-ending-in':
                this.selectedRepairEndingIn = event;

                break;
            case 'safety-pay-period':
                this.selectedSafetyPayPeriod = event;

                this.selectedSafetyEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'safety-ending-in':
                this.selectedSafetyEndingIn = event;

                break;
            case 'other-pay-period':
                this.selectedOtherPayPeriod = event;

                this.selectedOtherEndingIn = this.setEndingInInputOptions(
                    event.name
                );

                break;
            case 'other-ending-in':
                this.selectedOtherEndingIn = event;

                break;
            case 'company-data':
                this.selectedCompanyData = event;

                break;
            case SettingsModalEnum.PAY_TERM:
                this.selectedPayTerm = event;

                break;

            default:
                break;
        }
    }

    private setEndingInInputOptions(payPeriod: string): EnumValue {
        let selectedEndingIn: EnumValue;

        if (payPeriod === 'Semi Monthly' || payPeriod === 'Monthly') {
            if (payPeriod === 'Semi Monthly') {
                selectedEndingIn = {
                    id: 7,
                    name: '15th / Last day',
                };
            } else {
                selectedEndingIn = {
                    id: 8,
                    name: 'Last Day',
                };
            }
        } else {
            selectedEndingIn = this.endingIns[0];
        }

        return selectedEndingIn;
    }

    private validateMiles(): void {
        this.companyForm
            .get('soloEmptyMile')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get('soloEmptyMile')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('soloEmptyMile').setErrors(null);
                }
            });

        this.companyForm
            .get('soloLoadedMile')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get('soloLoadedMile')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('soloLoadedMile').setErrors(null);
                    if (!this.companyForm.get('soloEmptyMile').value) {
                        this.companyForm.get('soloEmptyMile').patchValue(value);
                    }
                }
            });

        this.companyForm
            .get('perMileSolo')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get('perMileSolo')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('perMileSolo').setErrors(null);
                }
            });

        this.companyForm
            .get('teamEmptyMile')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get('teamEmptyMile')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('teamEmptyMile').setErrors(null);
                }
            });

        this.companyForm
            .get('teamLoadedMile')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get('teamLoadedMile')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('teamLoadedMile').setErrors(null);
                    if (this.companyForm.get('teamEmptyMile').value) {
                        this.companyForm.get('teamEmptyMile').patchValue(value);
                    }
                }
            });

        this.companyForm
            .get('perMileTeam')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get('perMileTeam')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('perMileTeam').setErrors(null);
                }
            });
    }

    private validateCreditCards(): void {
        this.companyForm
            .get('bankCards')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((bankCards) => {
                const hasDuplicates =
                    bankCards.map((bankCard) => bankCard.card).length >
                    new Set(bankCards.map((bankCard) => bankCard.card)).size
                        ? true
                        : false;

                if (hasDuplicates) {
                    this.companyForm
                        .get('bankCards')
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm.get('bankCards').setErrors(null);
                }

                let cardTypes: string[] = [];
                bankCards.map((card) => {
                    const cardType = bankCardTypeValidation(card.card);
                    cardTypes.push(cardType);
                });
                this.bankCardTypes = cardTypes;
            });
    }

    public onUploadImage(event: any) {
        const base64Data = MethodsGlobalHelper.getBase64DataFromEvent(event);
        this.companyForm.get('logo').patchValue(base64Data);
        this.companyForm.get('logo').setErrors(null);
    }

    public onImageValidation(event: boolean): void {
        if (!event) {
            this.companyForm.get('logo').setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.companyForm.get('logo'),
                false
            );
        }
    }

    public onSaveLogoAction(event: any): void {
        if (event) {
            this.displayDeleteAction = true;
        }
    }

    public onPrefferedLoadCheck(event: Tabs): void {
        this.prefferedLoadTabs = this.prefferedLoadTabs.map((item) => {
            if (item.name === event.name)
                this.companyForm
                    .get(SettingsFormEnum.PREFERRED_LOAD_TYPE)
                    .patchValue(item.name);

            return {
                ...item,
                checked: item.id === event.id,
            };
        });
    }

    public onFleetTypeCheck(event: Tabs): void {
        this.fleetTypeTabs = this.fleetTypeTabs.map((item) => {
            if (item.id === event.id) {
                this.companyForm
                    .get(SettingsFormEnum.FLEET_TYPE)
                    .patchValue(item.name);

                this.selectedFleetType = item.name;
            }

            return {
                ...item,
                checked: item.id === event.id,
            };
        });
    }

    private onSamePerMileCheck(): void {
        this.companyForm
            .get('loadedAndEmptySameRate')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((val) => {
                if (val) {
                    if (
                        [SettingsModalEnum.SOLO, 'Combined'].includes(
                            this.selectedFleetType
                        )
                    ) {
                        if (this.companyForm.get('soloLoadedMile').value) {
                            this.companyForm
                                .get('perMileSolo')
                                .patchValue(
                                    this.companyForm.get('soloLoadedMile').value
                                );
                        }
                    }

                    if (['Team', 'Combined'].includes(this.selectedFleetType)) {
                        if (this.companyForm.get('teamLoadedMile').value) {
                            this.companyForm
                                .get('perMileTeam')
                                .patchValue(
                                    this.companyForm.get('teamLoadedMile').value
                                );
                        }
                    }
                } else {
                    if (
                        [SettingsModalEnum.SOLO, 'Combined'].includes(
                            this.selectedFleetType
                        )
                    ) {
                        if (this.companyForm.get('perMileSolo').value) {
                            this.companyForm
                                .get('soloLoadedMile')
                                .patchValue(
                                    this.companyForm.get('perMileSolo').value
                                );
                        }
                    }
                    if (['Team', 'Combined'].includes(this.selectedFleetType)) {
                        if (this.companyForm.get('perMileTeam').value) {
                            this.companyForm
                                .get('teamLoadedMile')
                                .patchValue(
                                    this.companyForm.get('perMileTeam').value
                                );
                        }
                    }
                }
            });
    }

    private getModalDropdowns() {
        this.settingsCompanyService
            .getCompanyModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const {
                        banks,
                        payPeriods,
                        endingIns,
                        timeZones,
                        currencies,
                        departments,
                        companyTypes,
                        payTerms,
                    } = res;

                    this.banks = banks;
                    this.payPeriods = payPeriods;
                    this.endingIns = endingIns;
                    this.timeZones = timeZones;
                    this.currencies = currencies;
                    this.departments = departments;
                    this.companyData = companyTypes;
                    this.payTermOptions = payTerms;

                    if (
                        this.editData.type ===
                        SettingsModalEnum.EDIT_COMPANY_FIRST_LOGIN
                    ) {
                        this.selectedDriverPayPeriod = payPeriods[0];
                        this.selectedDriverEndingIn = endingIns[0];
                        this.selectedAccountingPayPeriod = payPeriods[0];
                        this.selectedAccountingEndingIn = endingIns[0];
                        this.selectedCompanyPayPeriod = payPeriods[0];
                        this.selectedCompanyEndingIn = endingIns[0];
                        this.selectedDispatchPayPeriod = payPeriods[0];
                        this.selectedDispatchEndingIn = endingIns[0];
                        this.selectedManagerPayPeriod = payPeriods[0];
                        this.selectedManagerEndingIn = endingIns[0];
                        this.selectedRecPayPeriod = payPeriods[0];
                        this.selectedRecEndingIn = endingIns[0];
                        this.selectedRepairPayPeriod = payPeriods[0];
                        this.selectedRepairEndingIn = endingIns[0];
                        this.selectedSafetyPayPeriod = payPeriods[0];
                        this.selectedSafetyEndingIn = endingIns[0];
                        this.selectedOtherPayPeriod = payPeriods[0];
                        this.selectedOtherEndingIn = endingIns[0];
                    }
                },
            });
    }

    public addCompanyDivision(): void {
        const {
            addressUnit,
            departmentContacts,
            bankAccounts,
            bankCards,
            prefix,
            starting,
            suffix,
            factorByDefault,
            autoInvoicing,
            preferredLoadType,
            fleetType,
            customerCredit,
            mvrMonths,
            truckInspectionMonths,
            trailerInspectionMonths,
            ...form
        } = this.companyForm.value;

        const newData: CreateDivisionCompanyCommand = {
            ...form,
            additionalInfo: {
                prefix,
                starting,
                sufix: suffix,
                factorByDefault,
                autoInvoicing,
                preferredLoadType,
                fleetType,
                payTerm: this.selectedPayTerm?.id ?? null,
                customerCredit,
                mvrMonths,
                truckInspectionMonths,
                trailerInspectionMonths,
            },
            departmentContacts,
            bankAccounts,
            bankCards,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
            currency: this.selectedCurrency ? this.selectedCurrency.id : null,
        };

        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

        for (let index = 0; index < bankAccounts.length; index++) {
            bankAccounts[index].bankId =
                this.selectedBankAccountFormArray[index].id;
        }

        for (let index = 0; index < bankCards.length; index++) {
            bankCards[index].expireDate =
                MethodsCalculationsHelper.convertDateToBackend(
                    bankCards[index].expireDate
                );
        }

        this.settingsCompanyService
            .addCompanyDivision({ ...newData })
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

    private editCompanyDivision() {
        const { additionalInfo, ...company } = this.editData?.company;

        this.companyForm.patchValue({
            // -------------------- Basic Tab
            name: company.name,
            usDot: company.usDot,
            ein: company.ein,
            mc: company.mc,
            phone: company.phone,
            email: company.email,
            fax: company.fax,
            webUrl: company.webUrl,
            address: company.address?.address,
            addressUnit: company.address?.addressUnit,
            irp: company.irp,
            ifta: company.ifta,
            toll: company.toll,
            scac: company.scac,
            timeZone:
                company.timeZone?.id !== 0 ? company.timeZone?.name : null,
            currency:
                company.currency?.id !== 0 ? company.currency?.name : null,
            logo: /* this.editData.company.logo
                ? this.editData.company.logo
                : */ null,
            // Additional Info Tab
            prefix: additionalInfo?.prefix,
            starting: additionalInfo?.starting,
            suffix: additionalInfo?.sufix,
            autoInvoicing: additionalInfo?.autoInvoicing,
            factorByDefault: additionalInfo?.factorByDefault,
            preferredLoadType: additionalInfo?.preferredLoadType,
            fleetType: additionalInfo?.fleetType,
            payTerm: additionalInfo?.payTerm
                ? this.payTermOptions?.find(
                      (payTerm) => payTerm.id === additionalInfo?.payTerm
                  )?.name
                : null,
            customerCredit: additionalInfo?.customerCredit,
            mvrMonths: additionalInfo?.mvrMonths,
            truckInspectionMonths: additionalInfo?.truckInspectionMonths,
            trailerInspectionMonths: additionalInfo?.trailerInspectionMonths,
        });

        this.selectedAddress = this.editData.company.address;

        this.selectedTimeZone =
            this.editData.company.timeZone.id !== 0
                ? this.editData.company.timeZone
                : null;

        this.selectedCurrency =
            this.editData.company.currency.id !== 0
                ? this.editData.company.currency
                : null;

        this.selectedPayTerm = this.payTermOptions?.find(
            (payTerm) => payTerm.id === additionalInfo?.payTerm
        );

        if (this.editData.company.departmentContacts.length) {
            for (const department of this.editData.company.departmentContacts) {
                this.departmentContacts.push(
                    this.createDepartmentContacts({
                        id: department.id,
                        departmentId: department.department.name,
                        phone: department.phone,
                        extensionPhone: department.extensionPhone,
                        email: department.email,
                    })
                );
                this.selectedDepartmentFormArray.push(department.department);
            }
        }

        if (this.editData.company.bankAccounts.length) {
            for (
                let index = 0;
                index < this.editData.company.bankAccounts.length;
                index++
            ) {
                this.bankAccounts.push(
                    this.createBankAccount({
                        id: this.editData.company.bankAccounts[index].id,
                        bankId: this.editData.company.bankAccounts[index].bank
                            .name,
                        routing:
                            this.editData.company.bankAccounts[index].routing,
                        account:
                            this.editData.company.bankAccounts[index].account,
                    })
                );

                this.selectedBankAccountFormArray.push(
                    this.editData.company.bankAccounts[index].bank
                );

                this.isBankSelectedFormArray.push(
                    this.editData.company.bankAccounts[index].id ? true : false
                );

                this.onBankSelected(index);
            }
        }

        if (this.editData.company.bankCards.length) {
            for (const card of this.editData.company.bankCards) {
                this.bankCards.push(
                    this.createBankCard({
                        id: card.id,
                        nickname: card.nickname,
                        card: card.card,
                        cvc: card.cvc,
                        expireDate: card.expireDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  card.expireDate
                              )
                            : null,
                    })
                );
            }
        }

        // tabs
        const selectedPrefferedLoadTypeTab = this.prefferedLoadTabs.find(
            (tab) => tab.name === additionalInfo?.preferredLoadType
        );
        const selectedFleetTypeTab = this.fleetTypeTabs.find(
            (tab) => tab.name === additionalInfo?.fleetType
        );

        this.onPrefferedLoadCheck(selectedPrefferedLoadTypeTab);
        this.onFleetTypeCheck(selectedFleetTypeTab);

        setTimeout(() => {
            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    public updateCompanyDivision(id: number) {
        const {
            addressUnit,
            departmentContacts,
            bankAccounts,
            bankCards,
            prefix,
            starting,
            suffix,
            factorByDefault,
            autoInvoicing,
            preferredLoadType,
            fleetType,
            customerCredit,
            mvrMonths,
            truckInspectionMonths,
            trailerInspectionMonths,
            ...form
        } = this.companyForm.value;

        const newData: UpdateDivisionCompanyCommand = {
            id,
            ...form,
            additionalInfo: {
                prefix,
                starting,
                sufix: suffix,
                factorByDefault,
                autoInvoicing,
                preferredLoadType,
                fleetType,
                payTerm: this.selectedPayTerm?.id ?? null,
                customerCredit,
                mvrMonths,
                truckInspectionMonths,
                trailerInspectionMonths,
            },
            departmentContacts,
            bankAccounts,
            bankCards,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
            currency: this.selectedCurrency ? this.selectedCurrency.id : null,
        };

        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

        for (let index = 0; index < bankAccounts.length; index++) {
            bankAccounts[index].bankId =
                this.selectedBankAccountFormArray[index].id;
        }

        for (let index = 0; index < bankCards.length; index++) {
            bankCards[index].expireDate =
                MethodsCalculationsHelper.convertDateToBackend(
                    bankCards[index].expireDate
                );
        }

        this.settingsCompanyService
            .updateCompanyDivision({ ...newData })
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

    public deleteCompanyDivisionById(id: number) {
        this.settingsCompanyService
            .deleteCompanyDivisionById(id)
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

    public updateCompany(): void {
        const {
            addressUnit,
            dateOfIncorporation,
            departmentContacts,
            bankAccounts,
            bankCards,
            soloEmptyMile,
            soloLoadedMile,
            soloPerStop,
            perMileSolo,
            soloPerLoad,
            teamEmptyMile,
            teamLoadedMile,
            teamPerStop,
            perMileTeam,
            teamPerLoad,
            loadedAndEmptySameRate,
            driverSoloDefaultCommission,
            driverTeamDefaultCommission,
            ownerDefaultCommission,
            suffix,
            // Accounting
            accountingDefaultBase,
            // Company Owner
            companyOwnerDefaultBase,
            // Dispatch
            dispatchDefaultBase,
            dispatchDefaultCommission,
            // Manager
            managerDefaultBase,
            managerDefaultCommission,
            // Recruiting
            recruitingDefaultBase,
            // Repair
            repairDefaultBase,
            // Safety
            safetyDefaultBase,
            // Other
            otherDefaultBase,
            ...form
        } = this.companyForm.value;

        let newData: UpdateCompanyCommand = {
            ...form,
            sufix: suffix,
            payTerm: this.selectedPayTerm?.id ?? null,
            timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
            currency: this.selectedCurrency ? this.selectedCurrency.id : null,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            companyType: this.selectedCompanyData
                ? this.selectedCompanyData.id
                : null,
            dateOfIncorporation: dateOfIncorporation
                ? MethodsCalculationsHelper.convertDateToBackend(
                      dateOfIncorporation
                  )
                : null,
            preferredLoadType:
                this.companyForm.get(SettingsFormEnum.PREFERRED_LOAD_TYPE)
                    .value === SettingsModalEnum.FTL
                    ? 1
                    : 2,
        };

        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

        for (let index = 0; index < bankAccounts.length; index++) {
            bankAccounts[index].bankId =
                this.selectedBankAccountFormArray[index].id;
        }

        for (let index = 0; index < bankCards.length; index++) {
            bankCards[index].expireDate =
                MethodsCalculationsHelper.convertDateToBackend(
                    bankCards[index].expireDate
                );
        }

        const accountingPayroll = {
            departmentId: 1,
            payPeriod: this.selectedAccountingPayPeriod?.id,
            endingIn: this.selectedAccountingEndingIn?.id,
            defaultBase: accountingDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      accountingDefaultBase
                  )
                : null,
        };

        const dispatchPayroll = {
            departmentId: 2,
            payPeriod: this.selectedDispatchPayPeriod?.id,
            endingIn: this.selectedDispatchEndingIn?.id,
            defaultBase: dispatchDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      dispatchDefaultBase
                  )
                : null,
            defaultCommission: dispatchDefaultCommission,
        };

        const recruitingPayroll = {
            departmentId: 3,
            payPeriod: this.selectedRecPayPeriod?.id,
            endingIn: this.selectedRecEndingIn?.id,
            defaultBase: recruitingDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      recruitingDefaultBase
                  )
                : null,
        };

        const repairPayroll = {
            departmentId: 4,
            payPeriod: this.selectedRepairPayPeriod?.id,
            endingIn: this.selectedRepairEndingIn?.id,
            defaultBase: repairDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      repairDefaultBase
                  )
                : null,
        };

        const safetyPayroll = {
            departmentId: 5,
            payPeriod: this.selectedSafetyPayPeriod?.id,
            endingIn: this.selectedSafetyEndingIn?.id,
            defaultBase: safetyDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      safetyDefaultBase
                  )
                : null,
        };

        const managerPayroll = {
            departmentId: 7,
            payPeriod: this.selectedManagerPayPeriod?.id,
            endingIn: this.selectedManagerEndingIn?.id,
            defaultBase: managerDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      managerDefaultBase
                  )
                : null,
            defaultCommission: managerDefaultCommission,
        };

        const companyOwnerPayroll = {
            // Company Owner
            departmentId: 8,
            payPeriod: this.selectedCompanyPayPeriod?.id,
            endingIn: this.selectedCompanyEndingIn?.id,
            defaultBase: companyOwnerDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      companyOwnerDefaultBase
                  )
                : null,
        };

        const otherPayroll = {
            departmentId: 9,
            payPeriod: this.selectedOtherPayPeriod?.id,
            endingIn: this.selectedOtherEndingIn?.id,
            defaultBase: otherDefaultBase
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      otherDefaultBase
                  )
                : null,
        };

        const driverOwnerPayroll = {
            departmentId: 10,
            payPeriod: this.selectedDriverPayPeriod?.id,
            endingIn: this.selectedDriverEndingIn?.id,
            solo: {
                emptyMile: !loadedAndEmptySameRate
                    ? [SettingsModalEnum.SOLO, 'Combined'].includes(
                          this.selectedFleetType
                      )
                        ? parseFloat(soloEmptyMile)
                        : null
                    : null,
                loadedMile: !loadedAndEmptySameRate
                    ? [SettingsModalEnum.SOLO, 'Combined'].includes(
                          this.selectedFleetType
                      )
                        ? parseFloat(soloLoadedMile)
                        : null
                    : null,
                perStop: [SettingsModalEnum.SOLO, 'Combined'].includes(
                    this.selectedFleetType
                )
                    ? soloPerStop
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              soloPerStop
                          )
                        : null
                    : null,
            },
            team: {
                emptyMile: !loadedAndEmptySameRate
                    ? ['Team', 'Combined'].includes(this.selectedFleetType)
                        ? parseFloat(teamEmptyMile)
                        : null
                    : null,
                loadedMile: !loadedAndEmptySameRate
                    ? ['Team', 'Combined'].includes(this.selectedFleetType)
                        ? parseFloat(teamLoadedMile)
                        : null
                    : null,
                perStop: ['Team', 'Combined'].includes(this.selectedFleetType)
                    ? teamPerStop
                        ? MethodsCalculationsHelper.convertThousanSepInNumber(
                              teamPerStop
                          )
                        : null
                    : null,
            },
            perMileSolo: [SettingsModalEnum.SOLO, 'Combined'].includes(
                this.selectedFleetType
            )
                ? loadedAndEmptySameRate
                    ? perMileSolo
                        ? parseFloat(perMileSolo)
                        : null
                    : null
                : null,
            perMileTeam: ['Team', 'Combined'].includes(this.selectedFleetType)
                ? loadedAndEmptySameRate
                    ? perMileTeam
                        ? parseFloat(perMileTeam)
                        : null
                    : null
                : null,
            soloPerLoad: soloPerLoad
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      soloPerLoad
                  )
                : null,
            teamPerLoad: teamPerLoad
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      teamPerLoad
                  )
                : null,
            defaultSoloDriverCommission: [
                SettingsModalEnum.SOLO,
                'Combined',
            ].includes(this.selectedFleetType)
                ? driverSoloDefaultCommission
                : null,
            defaultTeamDriverCommission: ['Team', 'Combined'].includes(
                this.selectedFleetType
            )
                ? driverTeamDefaultCommission
                : null,
            defaultOwnerCommission: ownerDefaultCommission,
            loadedAndEmptySameRate: loadedAndEmptySameRate,
        };

        const payrolls: any = [
            accountingPayroll,
            dispatchPayroll,
            recruitingPayroll,
            repairPayroll,
            safetyPayroll,
            managerPayroll,
            companyOwnerPayroll,
            otherPayroll,
            driverOwnerPayroll,
        ];

        newData = {
            ...newData,
            bankAccounts,
            departmentContacts,
            bankCards,
            payrolls,
        };

        this.settingsCompanyService
            .updateCompany(newData)
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

    private editCompany(data: any): void {
        this.companyForm.patchValue({
            // -------------------- Basic Tab
            name: data.name,
            usDot: data.usDot,
            ein: data.ein,
            mc: data.mc,
            phone: data.phone,
            email: data.email,
            fax: data.fax,
            webUrl: data.webUrl,
            address: data.address.address,
            addressUnit: data.address.addressUnit,
            irp: data.irp,
            ifta: data.ifta,
            toll: data.toll,
            scac: data.scac,
            timeZone: data.timeZone?.id !== 0 ? data.timeZone.name : null,
            currency: data.currency?.id !== 0 ? data.currency.name : null,
            companyType:
                data.companyType?.id !== 0 ? data.companyType.name : null,
            dateOfIncorporation: data.dateOfIncorporation
                ? MethodsCalculationsHelper.convertDateFromBackend(
                      data.dateOfIncorporation
                  )
                : null,
            logo: data.logo ?? null,
            //-------------------- Additional Tab
            departmentContacts: [],
            bankAccounts: [],
            bankCards: [],
            prefix: data.additionalInfo.prefix,
            starting: data.additionalInfo.starting,
            suffix: data.additionalInfo.sufix,
            autoInvoicing: data.additionalInfo.autoInvoicing,
            preferredLoadType: data.additionalInfo.preferredLoadType,
            factorByDefault: data.additionalInfo.factorByDefault,
            hazMat: data.hazMat,
            driverMiles: data.driverMiles,
            driverComission: data.driverComission,
            driverFlatRate: data.driverFlatRate,
            payTerm: data.additionalInfo?.payTerm
                ? this.payTermOptions?.find(
                      (payTerm) => payTerm.id === data.additionalInfo?.payTerm
                  )?.name
                : null,
            customerCredit: data.additionalInfo.customerCredit,
            mvrMonths: data.additionalInfo.mvrMonths,
            truckInspectionMonths: data.additionalInfo.truckInspectionMonths,
            trailerInspectionMonths:
                data.additionalInfo.trailerInspectionMonths,
            //-------------------- Payroll Tab
            useACHPayout: data.useACHPayout ? true : false,
        });

        this.selectedAddress = data.address;

        this.selectedTimeZone = data.timeZone.id !== 0 ? data.timeZone : null;

        this.selectedCompanyData =
            data.companyType.id !== 0 ? data.companyType : null;

        this.selectedCurrency = data.currency.id !== 0 ? data.currency : null;

        this.onPrefferedLoadCheck({
            id:
                data.additionalInfo.preferredLoadType === SettingsModalEnum.FTL
                    ? 1
                    : 2,
            name: data.additionalInfo.preferredLoadType,
        });

        this.selectedFleetType = data.additionalInfo.fleetType;

        this.onFleetTypeCheck(
            this.fleetTypeTabs.find(
                (item) => item.name === this.selectedFleetType
            )
        );

        this.selectedPayTerm = this.payTermOptions?.find(
            (payTerm) => payTerm.id === data.additionalInfo?.payTerm
        );

        if (data.departmentContacts.length) {
            for (const department of data.departmentContacts) {
                this.departmentContacts.push(
                    this.createDepartmentContacts({
                        id: department.id,
                        departmentId: department.department.name,
                        phone: department.phone,
                        extensionPhone: department.extensionPhone,
                        email: department.email,
                    })
                );

                this.selectedDepartmentFormArray.push(department.department);
            }
        }

        if (data.bankAccounts.length) {
            for (let index = 0; index < data.bankAccounts.length; index++) {
                this.bankAccounts.push(
                    this.createBankAccount({
                        id: data.bankAccounts[index].id,
                        bankId: data.bankAccounts[index].bank.name,
                        routing: data.bankAccounts[index].routing,
                        account: data.bankAccounts[index].account,
                    })
                );
                this.selectedBankAccountFormArray.push(
                    data.bankAccounts[index].bank
                );
                this.isBankSelectedFormArray.push(
                    data.bankAccounts[index].id ? true : false
                );
                this.onBankSelected(index);
            }
        }

        if (data.bankCards.length) {
            for (const card of data.bankCards) {
                this.bankCards.push(
                    this.createBankCard({
                        id: card.id,
                        nickname: card.nickname,
                        card: card.card,
                        cvc: card.cvc,
                        expireDate: card.expireDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  card.expireDate
                              )
                            : null,
                    })
                );
            }
        }

        if (data.companyPayrolls.length) {
            for (const payroll of data.companyPayrolls) {
                switch (payroll.department.id) {
                    case 1: {
                        // Accounting
                        this.companyForm
                            .get('accountingPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('accountingEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('accountingDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );

                        this.selectedAccountingPayPeriod = payroll.payPeriod;
                        this.selectedAccountingEndingIn = payroll.endingIn;

                        break;
                    }
                    case 2: {
                        // Dispatcher
                        this.companyForm
                            .get('dispatchPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('dispatchEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('dispatchDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );
                        this.companyForm
                            .get('dispatchDefaultCommission')
                            .patchValue(payroll.defaultCommission);

                        this.selectedDispatchPayPeriod = payroll.payPeriod;
                        this.selectedDispatchEndingIn = payroll.endingIn;
                        break;
                    }
                    case 3: {
                        // Recruiting
                        this.companyForm
                            .get('recruitingPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('recruitingEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('recruitingDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );

                        this.selectedRecPayPeriod = payroll.payPeriod;
                        this.selectedRecEndingIn = payroll.endingIn;
                        break;
                    }
                    case 4: {
                        // Repair
                        this.companyForm
                            .get('repairPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('repairEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('repairDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );

                        this.selectedRepairPayPeriod = payroll.payPeriod;
                        this.selectedRepairEndingIn = payroll.endingIn;
                        break;
                    }
                    case 5: {
                        // Safety
                        this.companyForm
                            .get('safetyPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('safetyEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('safetyDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );

                        this.selectedSafetyPayPeriod = payroll.payPeriod;
                        this.selectedSafetyEndingIn = payroll.endingIn;
                        break;
                    }
                    case 7: {
                        // Manager
                        this.companyForm
                            .get('managerPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('managerEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('managerDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );
                        this.companyForm
                            .get('managerDefaultCommission')
                            .patchValue(payroll.defaultCommission);

                        this.selectedManagerPayPeriod = payroll.payPeriod;
                        this.selectedManagerEndingIn = payroll.endingIn;
                        break;
                    }
                    case 8: {
                        // Company Owner
                        this.companyForm
                            .get('companyOwnerPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('companyOwnerEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('companyOwnerDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );

                        this.selectedCompanyPayPeriod = payroll.payPeriod;
                        this.selectedCompanyEndingIn = payroll.endingIn;
                        break;
                    }
                    case 9: {
                        // Other
                        this.companyForm
                            .get('otherPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('otherEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('otherDefaultBase')
                            .patchValue(
                                payroll.defaultBase
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.defaultBase
                                      )
                                    : null
                            );

                        this.selectedOtherPayPeriod = payroll.payPeriod;
                        this.selectedOtherEndingIn = payroll.endingIn;
                        break;
                    }
                    case 10: {
                        this.companyForm
                            .get('driveOwnerPayPeriod')
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get('driverOwnerEndingIn')
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get('soloEmptyMile')
                            .patchValue(payroll.solo.emptyMile);

                        this.companyForm
                            .get('soloLoadedMile')
                            .patchValue(payroll.solo.loadedMile);

                        this.companyForm
                            .get('soloPerStop')
                            .patchValue(
                                payroll.solo.perStop
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.solo.perStop
                                      )
                                    : null
                            );
                        this.companyForm
                            .get('perMileSolo')
                            .patchValue(payroll.perMileSolo);

                        this.companyForm
                            .get('soloPerLoad')
                            .patchValue(
                                payroll.soloPerLoad
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.soloPerLoad
                                      )
                                    : null
                            );

                        this.companyForm
                            .get('teamEmptyMile')
                            .patchValue(payroll.team.emptyMile);

                        this.companyForm
                            .get('teamLoadedMile')
                            .patchValue(payroll.team.loadedMile, {
                                emitEvent: false,
                            });

                        this.companyForm
                            .get('teamPerStop')
                            .patchValue(
                                payroll.team.perStop
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.team.perStop
                                      )
                                    : null
                            );

                        this.companyForm
                            .get('perMileTeam')
                            .patchValue(payroll.perMileTeam);

                        this.companyForm
                            .get('teamPerLoad')
                            .patchValue(
                                payroll.teamPerLoad
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.teamPerLoad
                                      )
                                    : null
                            );

                        this.companyForm
                            .get('loadedAndEmptySameRate')
                            .patchValue(payroll.loadedAndEmptySameRate);

                        this.companyForm
                            .get('driverSoloDefaultCommission')
                            .patchValue(payroll.defaultSoloDriverCommission);

                        this.companyForm
                            .get('driverTeamDefaultCommission')
                            .patchValue(payroll.defaultTeamDriverCommission);

                        this.companyForm
                            .get('ownerDefaultCommission')
                            .patchValue(payroll.defaultOwnerCommission);

                        this.selectedDriverPayPeriod = payroll.payPeriod;
                        this.selectedDriverEndingIn = payroll.endingIn;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }

        if (this.companyForm.get('logo').value) {
            this.displayDeleteAction = true;
        }

        setTimeout(() => {
            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    public handleDeleteClick(event: any) {
        if (event.action === 'delete') {
            this.displayUploadZone = true;

            this.companyForm.get('logo').patchValue(null);
            this.companyForm.get('logo').setErrors(null);

            this.displayDeleteAction = false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
