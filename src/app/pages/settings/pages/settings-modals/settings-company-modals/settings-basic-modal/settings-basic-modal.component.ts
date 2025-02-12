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

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Services
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';
import { PlaidService } from '@shared/services';

// Components
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
import {
    CaUploadFilesComponent,
    CaInputAddressDropdownComponent,
} from 'ca-components';

// Animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Utils
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Validations
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

// Constants
import { SettingsModalConstants } from '@pages/settings/pages/settings-company/utils/constants/settings-modal.constants';

// Enums
import { ESettingsModalEnum } from '@pages/settings/pages/settings-company/enums/settings-modal.enum';
import { SettingsFormEnum } from '@pages/settings/pages/settings-modals/enums';
import {
    EBankAccountStatus,
    ESettingsFormControls,
} from '@pages/settings/enums';

// Models
import {
    AddressEntity,
    CreateDivisionCompanyCommand,
    CreateResponse,
    UpdateCompanyCommand,
    UpdateDivisionCompanyCommand,
    BankResponse,
    EnumValue,
    AccessTokenResponse,
    AccountDetailsResponse,
    AchDetail,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';
import { EditData } from '@shared/models/edit-data.model';
import { AnimationOptions } from '@shared/models/animation-options.model';
import { IBankAccount } from '@pages/settings/models';

// SVG routes
import { SettingsModalSvgRoutes } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-basic-modal/utils/svg-routes';

// Mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

// Pipes
import { SettingsBankAccountStatusPipe } from '@pages/settings/pages/settings-company/pipes';

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

        // Pipes
        SettingsBankAccountStatusPipe,
    ],
})
export class SettingsBasicModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnDestroy, OnInit
{
    @Input() editData: EditData;

    public destroy$ = new Subject<void>();

    public companyForm: UntypedFormGroup;
    public uploadOptionsConstants = SettingsModalConstants.UPLOAD_OPTIONS;

    public isFormDirty: boolean = false;
    public isSetupCompany: boolean = false;

    public isCardAnimationDisabled: boolean = false;
    public svgRoutes = SettingsModalSvgRoutes;

    // Tabs
    public selectedTab: number = 1;

    public tabs: Tabs[];
    public tabsDivision: Tabs[];
    public prefferedLoadTabs: Tabs[];
    public fleetTypeTabs: Tabs[];

    // Options
    public driverCommissionOptions: Options;
    public ownerCommissionOptions: Options;
    public commonOptions: Options;
    public dispatcherOptions: Options;
    public managerOptions: Options;

    public dropZoneConfig: DropZoneConfig;

    public animationObject: AnimationOptions;

    // Basic tab
    public selectedAddress: AddressEntity;
    public selectedTimeZone: any = null;
    public selectedCurrency: any = null;

    // additional tab
    public selectedDepartmentFormArray: any[] = [];

    public selectedBankAccountFormArray: any[] = [];
    public isBankSelectedFormArray: boolean[] = [];
    public bankCardTypes: string[] = [];

    // Dropdowns
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

    // Plaid bank verification
    public isPlaidAvailable: boolean = true;

    // Logo actions
    public hasDisplayDeleteAction: boolean = false;
    public hasDisplayUploadZone: boolean = false;

    // Enums
    public EBankAccountStatus = EBankAccountStatus;

    // Bank account actions
    public focusedBankAccount!: number | null;
    public isInitialLoading: boolean = true;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsCompanyService: SettingsCompanyService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        public addressService: AddressService,
        private plaidService: PlaidService
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();

        this.getModalDropdowns();

        this.getConstantData();

        this.checkForCompany();

        this.validateCreditCards();
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
                case ESettingsModalEnum.NEW_DIVISION:
                case ESettingsModalEnum.EDIT_DIVISION:
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

                    this.editData.type === ESettingsModalEnum.NEW_DIVISION
                        ? handleCompanyPreselectedValues()
                        : this.editCompanyDivision();

                    break;
                case ESettingsModalEnum.EDIT_COMPANY:
                case ESettingsModalEnum.PAYROLL_TAB:
                    this.editCompany(this.editData.company);

                    if (this.editData.type === ESettingsModalEnum.PAYROLL_TAB)
                        this.tabChange({ id: 3 });

                    break;
                case ESettingsModalEnum.EDIT_COMPANY_FIRST_LOGIN:
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
            this.companyForm.get(ESettingsModalEnum.STARTING),
            false
        );

        this.inputService.changeValidators(
            this.companyForm.get(ESettingsModalEnum.MVR_MONTHS),
            false
        );

        this.inputService.changeValidators(
            this.companyForm.get(ESettingsModalEnum.TRUCK_INSPECTION_MONTHS),
            false
        );

        this.inputService.changeValidators(
            this.companyForm.get(ESettingsModalEnum.TRAILER_INSPECTION_MONTHS),
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
            preferredLoadType: [ESettingsModalEnum.FTL],
            fleetType: [ESettingsModalEnum.SOLO],
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
                ESettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            driverOwnerEndingIn: [
                ESettingsModalEnum.MONDAY,
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
                ESettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            accountingEndingIn: [
                ESettingsModalEnum.MONDAY,
                Validators.required,
            ],
            accountingDefaultBase: [null, defaultBaseValidation],
            // company owner
            companyOwnerPayPeriod: [
                ESettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            companyOwnerEndingIn: [
                ESettingsModalEnum.MONDAY,
                Validators.required,
            ],
            companyOwnerDefaultBase: [null, defaultBaseValidation],
            // dispatch
            dispatchPayPeriod: [ESettingsModalEnum.WEEKLY, Validators.required],
            dispatchEndingIn: [ESettingsModalEnum.MONDAY, Validators.required],
            dispatchDefaultBase: [null, defaultBaseValidation],
            dispatchDefaultCommission: [5],
            // manager
            managerPayPeriod: [ESettingsModalEnum.WEEKLY, Validators.required],
            managerEndingIn: [ESettingsModalEnum.MONDAY, Validators.required],
            managerDefaultBase: [null, defaultBaseValidation],
            managerDefaultCommission: [2.5],
            // recruiting
            recruitingPayPeriod: [
                ESettingsModalEnum.WEEKLY,
                Validators.required,
            ],
            recruitingEndingIn: [
                ESettingsModalEnum.MONDAY,
                Validators.required,
            ],
            recruitingDefaultBase: [null, defaultBaseValidation],
            // repair
            repairPayPeriod: [ESettingsModalEnum.WEEKLY, Validators.required],
            repairEndingIn: [ESettingsModalEnum.MONDAY, Validators.required],
            repairDefaultBase: [null, defaultBaseValidation],
            // safety
            safetyPayPeriod: [ESettingsModalEnum.WEEKLY, Validators.required],
            safetyEndingIn: [ESettingsModalEnum.MONDAY, Validators.required],
            safetyDefaultBase: [null, defaultBaseValidation],
            // other
            otherPayPeriod: [ESettingsModalEnum.WEEKLY, Validators.required],
            otherEndingIn: [ESettingsModalEnum.MONDAY, Validators.required],
            otherDefaultBase: [null, defaultBaseValidation],
        });

        this.inputService.customInputValidator(
            this.companyForm.get(ESettingsModalEnum.EMAIL),
            ESettingsModalEnum.EMAIL,
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.companyForm.get(ESettingsModalEnum.WEB_URL),
            ESettingsModalEnum.URL,
            this.destroy$
        );

        if (
            [
                ESettingsModalEnum.NEW_DIVISION as string,
                ESettingsModalEnum.EDIT_DIVISION,
            ].includes(this.editData.type)
        )
            this.companyForm
                .get(ESettingsModalEnum.EMAIL)
                .setValidators(Validators.required);
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case ESettingsModalEnum.CLOSE:
                break;
            case ESettingsModalEnum.SAVE:
            case ESettingsModalEnum.STEPPER_SAVE:
                if (this.companyForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.companyForm);

                    return;
                }

                if (
                    this.editData.type.includes(
                        ESettingsModalEnum.EDIT_COMPANY
                    ) ||
                    this.editData.type.includes(ESettingsModalEnum.PAYROLL_TAB)
                ) {
                    this.updateCompany();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    if (
                        this.editData.type === ESettingsModalEnum.NEW_DIVISION
                    ) {
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

    public tabChange(event: { id: number }): void {
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

        this.isPlaidAvailable = this.selectedTab === 2;
    }

    public get departmentContacts(): UntypedFormArray {
        return this.companyForm.get(
            ESettingsFormControls.DEPARTMENT_CONTACTS
        ) as UntypedFormArray;
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

    public addDepartmentContacts(event: {
        check: boolean;
        action: string;
    }): void {
        if (event.check && this.departmentContacts.valid) {
            const form = this.createDepartmentContacts();
            this.departmentContacts.push(form);

            this.inputService.customInputValidator(
                form.get(ESettingsModalEnum.EMAIL),
                ESettingsModalEnum.EMAIL,
                this.destroy$
            );
        }
    }

    public removeDepartmentContacts(id: number) {
        this.departmentContacts.removeAt(id);
        this.selectedDepartmentFormArray.splice(id, 1);
    }

    public onSelectFakeTableData(
        event: any,
        index: number,
        action: string
    ): void {
        switch (action) {
            case 'department': {
                this.selectedDepartmentFormArray[index] = event;
                break;
            }
            case ESettingsFormControls.BANK_ACCOUNTS: {
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
            });
    }

    public get bankAccounts(): UntypedFormArray {
        return this.companyForm.get(
            ESettingsFormControls.BANK_ACCOUNTS
        ) as UntypedFormArray;
    }

    private createBankAccount(data?: IBankAccount): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ?? 0],
            bankId: [
                data?.bankId ?? null,
                [Validators.required, ...bankValidation],
            ],
            routing: [
                data?.routing ?? null,
                [Validators.required, ...routingBankValidation],
            ],
            account: [
                data?.account ? data.account : null,
                [Validators.required, ...accountBankValidation],
            ],
            status: [data?.status ?? null],
        });
    }

    public verifyBankAccount(index: number): void {
        if (this.bankAccounts?.at(index).valid && this.isPlaidAvailable) {
            const value: IBankAccount = this.bankAccounts.value[index];
            this.checkBankAccountValidity(value);
        }
    }

    public focusBankAccount(index: number | null): void {
        this.focusedBankAccount = index;
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
        const bankAccount = this.bankAccounts.at(index);

        bankAccount.valueChanges
            .pipe(
                debounceTime(350),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe((value) => {
                if (
                    value.status === EBankAccountStatus.VERIFIED &&
                    !bankAccount.pristine
                )
                    bankAccount.patchValue({
                        ...this.bankAccounts.at(index),
                        status: EBankAccountStatus.UNVERIFIED,
                    });
            });
    }

    public get bankCards(): UntypedFormArray {
        return this.companyForm.get(
            ESettingsFormControls.BANK_CARDS
        ) as UntypedFormArray;
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
            case ESettingsModalEnum.CURRENCY:
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
            case ESettingsModalEnum.PAY_TERM:
                this.selectedPayTerm = event;
                break;
            default:
                break;
        }
    }

    private setEndingInInputOptions(payPeriod: string): EnumValue {
        let selectedEndingIn: EnumValue;

        if (payPeriod === 'Semi Monthly' || payPeriod === 'Monthly') {
            if (payPeriod === 'Semi Monthly')
                selectedEndingIn = {
                    id: 7,
                    name: '15th / Last day',
                };
            else
                selectedEndingIn = {
                    id: 8,
                    name: 'Last Day',
                };
        } else selectedEndingIn = this.endingIns[0];

        return selectedEndingIn;
    }

    private validateMiles(): void {
        this.companyForm
            .get(ESettingsFormControls.SOLO_EMPTY_MILE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10)
                    this.companyForm
                        .get(ESettingsFormControls.SOLO_EMPTY_MILE)
                        .setErrors({ invalid: true });
                else
                    this.companyForm
                        .get(ESettingsFormControls.SOLO_EMPTY_MILE)
                        .setErrors(null);
            });

        this.companyForm
            .get(ESettingsFormControls.SOLO_LOADED_MILE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get(ESettingsFormControls.SOLO_LOADED_MILE)
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm
                        .get(ESettingsFormControls.SOLO_LOADED_MILE)
                        ?.setErrors(null);
                    if (
                        !this.companyForm.get(
                            ESettingsFormControls.SOLO_EMPTY_MILE
                        ).value
                    )
                        this.companyForm
                            .get(ESettingsFormControls.SOLO_EMPTY_MILE)
                            ?.patchValue(value);
                }
            });

        this.companyForm
            .get(ESettingsFormControls.PER_MILE_SOLO)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value: number) => {
                if (value > 10)
                    this.companyForm
                        .get(ESettingsFormControls.PER_MILE_SOLO)
                        .setErrors({ invalid: true });
                else
                    this.companyForm
                        .get(ESettingsFormControls.PER_MILE_SOLO)
                        .setErrors(null);
            });

        this.companyForm
            .get(ESettingsFormControls.TEAM_EMPTY_MILE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value > 10) {
                    this.companyForm
                        .get(ESettingsFormControls.TEAM_EMPTY_MILE)
                        .setErrors({ invalid: true });
                } else {
                    this.companyForm
                        .get(ESettingsFormControls.TEAM_EMPTY_MILE)
                        .setErrors(null);
                }
            });

        this.companyForm
            .get(ESettingsFormControls.TEAM_LOADED_MILE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value: number) => {
                if (value > 10)
                    this.companyForm
                        .get(ESettingsFormControls.TEAM_LOADED_MILE)
                        .setErrors({ invalid: true });
                else {
                    this.companyForm
                        .get(ESettingsFormControls.TEAM_LOADED_MILE)
                        .setErrors(null);
                    if (
                        this.companyForm.get(
                            ESettingsFormControls.TEAM_EMPTY_MILE
                        ).value
                    ) {
                        this.companyForm
                            .get(ESettingsFormControls.TEAM_EMPTY_MILE)
                            .patchValue(value);
                    }
                }
            });

        this.companyForm
            .get(ESettingsFormControls.PER_MILE_TEAM)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value: number) => {
                if (value > 10)
                    this.companyForm
                        .get(ESettingsFormControls.PER_MILE_TEAM)
                        .setErrors({ invalid: true });
                else
                    this.companyForm
                        .get(ESettingsFormControls.PER_MILE_TEAM)
                        .setErrors(null);
            });
    }

    private validateCreditCards(): void {
        this.companyForm
            .get(ESettingsFormControls.BANK_CARDS)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((bankCards) => {
                const hasDuplicates =
                    bankCards.map((bankCard) => bankCard.card).length >
                    new Set(bankCards.map((bankCard) => bankCard.card)).size
                        ? true
                        : false;

                if (hasDuplicates)
                    this.companyForm
                        .get(ESettingsFormControls.BANK_CARDS)
                        .setErrors({ invalid: true });
                else
                    this.companyForm
                        .get(ESettingsFormControls.BANK_CARDS)
                        .setErrors(null);

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
        this.companyForm.get(ESettingsFormControls.LOGO).patchValue(base64Data);
        this.companyForm.get(ESettingsFormControls.LOGO).setErrors(null);
    }

    public onImageValidation(event: boolean): void {
        if (!event) {
            this.companyForm
                .get(ESettingsFormControls.LOGO)
                .setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.companyForm.get(ESettingsFormControls.LOGO),
                false
            );
        }
    }

    public onSaveLogoAction(event: any): void {
        if (event) this.hasDisplayDeleteAction = true;
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
            if (item.id === event.id)
                this.companyForm
                    .get(SettingsFormEnum.FLEET_TYPE)
                    .patchValue(item.name);

            this.selectedFleetType = item.name;

            return {
                ...item,
                checked: item.id === event.id,
            };
        });
    }

    private onSamePerMileCheck(): void {
        this.companyForm
            .get(ESettingsFormControls.LOADED_AND_EMPTY_SAME_RATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((val) => {
                if (val) {
                    if (
                        [
                            ESettingsModalEnum.SOLO,
                            ESettingsModalEnum.COMBINED as string,
                        ].includes(this.selectedFleetType)
                    )
                        if (
                            this.companyForm.get(
                                ESettingsFormControls.SOLO_LOADED_MILE
                            ).value
                        )
                            this.companyForm
                                .get(ESettingsFormControls.PER_MILE_SOLO)
                                .patchValue(
                                    this.companyForm.get(
                                        ESettingsFormControls.SOLO_LOADED_MILE
                                    ).value
                                );

                    if (
                        ['Team', ESettingsModalEnum.COMBINED].includes(
                            this.selectedFleetType
                        )
                    )
                        if (
                            this.companyForm.get(
                                ESettingsFormControls.TEAM_LOADED_MILE
                            ).value
                        )
                            this.companyForm
                                .get(ESettingsFormControls.PER_MILE_TEAM)
                                .patchValue(
                                    this.companyForm.get(
                                        ESettingsFormControls.TEAM_LOADED_MILE
                                    ).value
                                );
                } else {
                    if (
                        [
                            ESettingsModalEnum.SOLO,
                            ESettingsModalEnum.COMBINED as string,
                        ].includes(this.selectedFleetType)
                    )
                        if (
                            this.companyForm.get(
                                ESettingsFormControls.PER_MILE_SOLO
                            ).value
                        )
                            this.companyForm
                                .get(ESettingsFormControls.SOLO_LOADED_MILE)
                                .patchValue(
                                    this.companyForm.get(
                                        ESettingsFormControls.PER_MILE_SOLO
                                    ).value
                                );

                    if (
                        ['Team', ESettingsModalEnum.COMBINED].includes(
                            this.selectedFleetType
                        )
                    ) {
                        if (
                            this.companyForm.get(
                                ESettingsFormControls.PER_MILE_TEAM
                            ).value
                        )
                            this.companyForm
                                .get(ESettingsFormControls.TEAM_LOADED_MILE)
                                .patchValue(
                                    this.companyForm.get(
                                        ESettingsFormControls.PER_MILE_TEAM
                                    ).value
                                );
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
                        ESettingsModalEnum.EDIT_COMPANY_FIRST_LOGIN
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

        departmentContacts.forEach((departmentContact, index: number) => {
            departmentContact.departmentId =
                this.selectedDepartmentFormArray[index].id;
        });

        bankAccounts.forEach((bankAccount, index: number) => {
            bankAccount.bankId = this.selectedBankAccountFormArray[index].id;
        });

        bankCards.forEach((bankCard, index: number) => {
            bankCard.expireDate =
                MethodsCalculationsHelper.convertDateToBackend(
                    bankCards[index].expireDate
                );
        });

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

    private editCompanyDivision(): void {
        const { additionalInfo, ...company } = this.editData?.company;

        this.companyForm.patchValue({
            // Basic Tab
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
                this.selectedDepartmentFormArray.push({
                    ...department.department,
                });
            }
        }

        if (this.editData.company.bankAccounts?.length) {
            this.editData.company.bankAccounts.forEach(
                (bankAccountItem, index: number) => {
                    const { id, routing, account, status } = bankAccountItem;

                    const bankAccount: IBankAccount = {
                        id,
                        routing,
                        account,
                        bankId: this.editData.company.bankAccounts[index].bank
                            .name,
                        status: status
                            ? EBankAccountStatus.VERIFIED
                            : EBankAccountStatus.UNVERIFIED,
                    };

                    this.bankAccounts.push(this.createBankAccount(bankAccount));

                    this.selectedBankAccountFormArray.push({
                        ...this.editData.company.bankAccounts[index].bank,
                    });

                    this.isBankSelectedFormArray.push(
                        this.editData.company.bankAccounts[index].id
                            ? true
                            : false
                    );

                    this.onBankSelected(index);
                }
            );

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

            // Tabs
            const selectedPrefferedLoadTypeTab = this.prefferedLoadTabs.find(
                (tab: Tabs) => tab.name === additionalInfo?.preferredLoadType
            );
            const selectedFleetTypeTab = this.fleetTypeTabs.find(
                (tab: Tabs) => tab.name === additionalInfo?.fleetType
            );

            this.onPrefferedLoadCheck(selectedPrefferedLoadTypeTab);
            this.onFleetTypeCheck(selectedFleetTypeTab);

            setTimeout(() => {
                this.isCardAnimationDisabled = false;
            }, 1000);
        }
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

        departmentContacts.forEach((departmentContact, index: number) => {
            departmentContact.departmentId =
                this.selectedDepartmentFormArray[index].id;
        });

        bankAccounts.forEach((bankAccount, index: number) => {
            bankAccount.bankId = this.selectedBankAccountFormArray[index].id;
        });

        bankCards.forEach((bankCard, index: number) => {
            bankCard.expireDate =
                MethodsCalculationsHelper.convertDateToBackend(
                    bankCards[index].expireDate
                );
        });

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
                    .value === ESettingsModalEnum.FTL
                    ? 1
                    : 2,
        };

        departmentContacts.forEach((departmentContact, index: number) => {
            departmentContact.departmentId =
                this.selectedDepartmentFormArray[index].id;
        });

        bankAccounts.forEach((bankAccount, index: number) => {
            bankAccount.bankId = this.selectedBankAccountFormArray[index].id;
        });

        bankCards.forEach((bankCard, index: number) => {
            bankCard.expireDate =
                MethodsCalculationsHelper.convertDateToBackend(
                    bankCards[index].expireDate
                );
        });

        const accountingPayroll = {
            departmentId: 1,
            payPeriod: this.selectedAccountingPayPeriod?.id,
            endingIn: this.selectedAccountingEndingIn?.id,
            defaultBase: accountingDefaultBase
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      accountingDefaultBase
                  )
                : null,
        };

        const dispatchPayroll = {
            departmentId: 2,
            payPeriod: this.selectedDispatchPayPeriod?.id,
            endingIn: this.selectedDispatchEndingIn?.id,
            defaultBase: dispatchDefaultBase
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
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
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      recruitingDefaultBase
                  )
                : null,
        };

        const repairPayroll = {
            departmentId: 4,
            payPeriod: this.selectedRepairPayPeriod?.id,
            endingIn: this.selectedRepairEndingIn?.id,
            defaultBase: repairDefaultBase
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      repairDefaultBase
                  )
                : null,
        };

        const safetyPayroll = {
            departmentId: 5,
            payPeriod: this.selectedSafetyPayPeriod?.id,
            endingIn: this.selectedSafetyEndingIn?.id,
            defaultBase: safetyDefaultBase
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      safetyDefaultBase
                  )
                : null,
        };

        const managerPayroll = {
            departmentId: 7,
            payPeriod: this.selectedManagerPayPeriod?.id,
            endingIn: this.selectedManagerEndingIn?.id,
            defaultBase: managerDefaultBase
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
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
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      companyOwnerDefaultBase
                  )
                : null,
        };

        const otherPayroll = {
            departmentId: 9,
            payPeriod: this.selectedOtherPayPeriod?.id,
            endingIn: this.selectedOtherEndingIn?.id,
            defaultBase: otherDefaultBase
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
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
                    ? [
                          ESettingsModalEnum.SOLO,
                          ESettingsModalEnum.COMBINED as string,
                      ].includes(this.selectedFleetType)
                        ? parseFloat(soloEmptyMile)
                        : null
                    : null,
                loadedMile: !loadedAndEmptySameRate
                    ? [
                          ESettingsModalEnum.SOLO,
                          ESettingsModalEnum.COMBINED as string,
                      ].includes(this.selectedFleetType)
                        ? parseFloat(soloLoadedMile)
                        : null
                    : null,
                perStop: [
                    ESettingsModalEnum.SOLO,
                    ESettingsModalEnum.COMBINED as string,
                ].includes(this.selectedFleetType)
                    ? soloPerStop
                        ? MethodsCalculationsHelper.convertThousandSepInNumber(
                              soloPerStop
                          )
                        : null
                    : null,
            },
            team: {
                emptyMile: !loadedAndEmptySameRate
                    ? ['Team', ESettingsModalEnum.COMBINED].includes(
                          this.selectedFleetType
                      )
                        ? parseFloat(teamEmptyMile)
                        : null
                    : null,
                loadedMile: !loadedAndEmptySameRate
                    ? ['Team', ESettingsModalEnum.COMBINED].includes(
                          this.selectedFleetType
                      )
                        ? parseFloat(teamLoadedMile)
                        : null
                    : null,
                perStop: ['Team', ESettingsModalEnum.COMBINED].includes(
                    this.selectedFleetType
                )
                    ? teamPerStop
                        ? MethodsCalculationsHelper.convertThousandSepInNumber(
                              teamPerStop
                          )
                        : null
                    : null,
            },
            perMileSolo: [
                ESettingsModalEnum.SOLO,
                ESettingsModalEnum.COMBINED as string,
            ].includes(this.selectedFleetType)
                ? loadedAndEmptySameRate
                    ? perMileSolo
                        ? parseFloat(perMileSolo)
                        : null
                    : null
                : null,
            perMileTeam: ['Team', ESettingsModalEnum.COMBINED].includes(
                this.selectedFleetType
            )
                ? loadedAndEmptySameRate
                    ? perMileTeam
                        ? parseFloat(perMileTeam)
                        : null
                    : null
                : null,
            soloPerLoad: soloPerLoad
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      soloPerLoad
                  )
                : null,
            teamPerLoad: teamPerLoad
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      teamPerLoad
                  )
                : null,
            defaultSoloDriverCommission: [
                ESettingsModalEnum.SOLO,
                ESettingsModalEnum.COMBINED as string,
            ].includes(this.selectedFleetType)
                ? driverSoloDefaultCommission
                : null,
            defaultTeamDriverCommission: [
                'Team',
                ESettingsModalEnum.COMBINED,
            ].includes(this.selectedFleetType)
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
                data.additionalInfo.preferredLoadType === ESettingsModalEnum.FTL
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

        if (data.departmentContacts.length)
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

                this.selectedDepartmentFormArray.push({
                    ...department.department,
                });
            }

        if (data.bankAccounts?.length)
            data.bankAccounts?.forEach((bankAccountItem, index: number) => {
                const { id, account, routing, status, bank } = bankAccountItem;
                const bankAccount: IBankAccount = {
                    id,
                    bankId: bank?.name,
                    account,
                    routing,
                    status: status
                        ? EBankAccountStatus.VERIFIED
                        : EBankAccountStatus.UNVERIFIED,
                };

                this.bankAccounts.push(this.createBankAccount(bankAccount));
                this.selectedBankAccountFormArray.push(bank);
                this.isBankSelectedFormArray.push(id ? true : false);
                this.onBankSelected(index);
            });

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
                            .get(ESettingsFormControls.SAFETY_PAY_PERIOD)
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
                            .get(ESettingsFormControls.DRIVER_OWNER_PAY_PERIOD)
                            .patchValue(payroll.payPeriod.name);

                        this.companyForm
                            .get(ESettingsFormControls.DRIVER_OWNER_ENDING_IN)
                            .patchValue(payroll.endingIn.name);

                        this.companyForm
                            .get(ESettingsFormControls.SOLO_EMPTY_MILE)
                            .patchValue(payroll.solo.emptyMile);

                        this.companyForm
                            .get(ESettingsFormControls.SOLO_LOADED_MILE)
                            .patchValue(payroll.solo.loadedMile);

                        this.companyForm
                            .get(ESettingsFormControls.SOLO_PER_STOP)
                            .patchValue(
                                payroll.solo.perStop
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.solo.perStop
                                      )
                                    : null
                            );
                        this.companyForm
                            .get(ESettingsFormControls.PER_MILE_SOLO)
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
                            .get(ESettingsFormControls.TEAM_EMPTY_MILE)
                            .patchValue(payroll.team.emptyMile);

                        this.companyForm
                            .get(ESettingsFormControls.TEAM_LOADED_MILE)
                            .patchValue(payroll.team.loadedMile, {
                                emitEvent: false,
                            });

                        this.companyForm
                            .get(ESettingsFormControls.TEAM_PER_STOP)
                            .patchValue(
                                payroll.team.perStop
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          payroll.team.perStop
                                      )
                                    : null
                            );

                        this.companyForm
                            .get(ESettingsFormControls.PER_MILE_TEAM)
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
                            .get(
                                ESettingsFormControls.LOADED_AND_EMPTY_SAME_RATE
                            )
                            .patchValue(payroll.loadedAndEmptySameRate);

                        this.companyForm
                            .get(
                                ESettingsFormControls.DRIVER_SOLO_DEFAULT_COMMISSION
                            )
                            .patchValue(payroll.defaultSoloDriverCommission);

                        this.companyForm
                            .get(
                                ESettingsFormControls.DRIVER_TEAM_DEFAULT_COMMISSION
                            )
                            .patchValue(payroll.defaultTeamDriverCommission);

                        this.companyForm
                            .get(ESettingsFormControls.OWNER_DEFAULT_COMMISSION)
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

        if (this.companyForm.get(ESettingsFormControls.LOGO).value)
            this.hasDisplayDeleteAction = true;

        setTimeout(() => {
            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    public handleDeleteClick(event: any): void {
        if (event.action === 'delete') {
            this.hasDisplayUploadZone = true;

            this.companyForm.get(ESettingsFormControls.LOGO).patchValue(null);
            this.companyForm.get(ESettingsFormControls.LOGO).setErrors(null);

            this.hasDisplayDeleteAction = false;
        }
    }

    private checkBankAccountValidity(addedAccount: IBankAccount): void {
        this.isPlaidAvailable = false;

        this.plaidService
            .getPlaidVerification()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                ([accessToken, details]: [
                    AccessTokenResponse,
                    AccountDetailsResponse,
                ]) => {
                    this.plaidService.compareVerificationResults(
                        details,
                        addedAccount
                    );
                    this.isPlaidAvailable = true;
                },
                () => {
                    this.plaidService.compareVerificationResults(
                        {},
                        addedAccount
                    );
                    this.isPlaidAvailable = true;
                }
            )
            .add(() => {
                this.isPlaidAvailable = true;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
