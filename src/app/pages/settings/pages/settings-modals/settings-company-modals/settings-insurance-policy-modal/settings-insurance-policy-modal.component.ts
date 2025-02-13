import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

// models
import {
    AddressEntity,
    InsurancePolicyModalResponse,
} from 'appcoretruckassist';

// moment
import moment from 'moment';

// services
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';

// validations
import {
    phoneFaxRegex,
    addressValidation,
    addressUnitValidation,
    producerNameValidation,
    insurerNameValidation,
    eachOccurrenceValidation,
    damageValidation,
    personalAvertInjValidation,
    bodilyInjuryValidation,
    medicalExpensesValidation,
    generalAggregateValidation,
    productsCompOpAggValidation,
    combinedSingleLimitValidation,
    singleConveyanceValidation,
    deductableValidation,
    comprehenCollisionValidation,
    trailerValueInsurancePolicyValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import {
    CaInputAddressDropdownComponent,
    CaInputDatetimePickerComponent,
} from 'ca-components';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

// Enums
import { EFileFormControls, EGeneralActions } from '@shared/enums';
import { ESettingsFormEnum } from '@pages/settings/pages/settings-modals/enums';

@Component({
    selector: 'app-settings-insurance-policy-modal',
    templateUrl: './settings-insurance-policy-modal.component.html',
    styleUrls: ['./settings-insurance-policy-modal.component.scss'],
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
        TaCheckboxCardComponent,
        TaCheckboxComponent,
        TaModalComponent,
        TaInputNoteComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        CaInputDatetimePickerComponent,
    ],
})
export class SettingsInsurancePolicyModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    public destroy$ = new Subject<void>();
    @Input() editData: any;

    public insurancePolicyForm: UntypedFormGroup;

    public selectedAddress: AddressEntity;

    public selectedCommericalRating: any = null;
    public selectedAutomobileRating: any = null;
    public selectedMotorRating: any = null;
    public selectedPhysicalDamageRating: any = null;
    public selectedTrailerRating: any = null;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];
    public ratings: any[] = [];

    public idCommercial = null;
    public idAutomobile = null;
    public idMotor = null;
    public idPhysicalDamage = null;
    public idTrailerInterchange = null;

    public isFormDirty: boolean;

    public isCardAnimationDisabled: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsCompanyService: SettingsCompanyService,
        private formService: FormService,
        public addressService: AddressService
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
        this.getInsurancePolicyDropdowns();
        this.trackCheckboxValues();
    }

    private createForm() {
        this.insurancePolicyForm = this.formBuilder.group({
            producerName: [
                null,
                [Validators.required, ...producerNameValidation],
            ],
            issued: [null, Validators.required],
            expires: [null, Validators.required],
            phone: [null, phoneFaxRegex],
            email: [null],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            // Commerical General Liability
            commericalGeneralLiability: [false],
            commericalPolicy: [null],
            commericalInsurerName: [null, insurerNameValidation],
            commericalRating: [null],
            commericalOccurrence: [null, eachOccurrenceValidation],
            commericalDamage: [null, damageValidation],
            commericalInj: [null, personalAvertInjValidation],
            commericalMedical: [null, medicalExpensesValidation],
            commericalGeneralAggregate: [null, generalAggregateValidation],
            commericalProducts: [null, productsCompOpAggValidation],
            // Automobile Liability
            automobileLiability: [false],
            automobilePolicy: [null],
            automobileInsurerName: [null, insurerNameValidation],
            automobileRating: [null],
            automobileAccident: [null, bodilyInjuryValidation],
            automobileInjuryPerson: [null, bodilyInjuryValidation],
            automobileLimit: [null, combinedSingleLimitValidation],
            automobileDamage: [null, damageValidation],
            // Moto Truck & Reefer Breakdown
            motorTruckCargo: [false],
            reeferBreakdown: [false],
            motorPolicy: [null],
            motorInsurerName: [null, insurerNameValidation],
            motorRating: [null],
            motorConveyance: [null, singleConveyanceValidation],
            motorDeductable: [null, deductableValidation],
            // Physical Damage
            physicalDamage: [false],
            physicalPolicy: [null],
            physicalInsurerName: [null, insurerNameValidation],
            physicalRating: [null],
            physicalCollision: [null, comprehenCollisionValidation],
            physicalDeductable: [null, deductableValidation],
            // Trailer Interchange
            trailerInterchange: [false],
            trailerPolicy: [null],
            trailerInsurerName: [null, insurerNameValidation],
            trailerRating: [null],
            trailerValue: [null, trailerValueInsurancePolicyValidation],
            note: [null],
            files: [null],
        });

        this.inputService.customInputValidator(
            this.insurancePolicyForm.get(ESettingsFormEnum.EMAIL),
            ESettingsFormEnum.EMAIL,
            this.destroy$
        );
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case EGeneralActions.SAVE:
                // If Form not valid
                if (this.insurancePolicyForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.insurancePolicyForm);
                    return;
                }
                if (this.editData.type === EGeneralActions.EDIT) {
                    this.updateInsurancePolicy(this.editData.company.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addInsurancePolicy(this.editData.company);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            case EGeneralActions.DELETE:
                this.deleteInsurancePolicyById(this.editData.company.id);
                this.modalService.setModalSpinner({
                    action: EGeneralActions.DELETE,
                    status: true,
                    close: false,
                });

                break;
            default:
                break;
        }
    }

    private trackCheckboxValues(): void {
        this.followChangesForChekbox(
            ESettingsFormEnum.COMMERCIAL,
            this.insurancePolicyForm.get(
                ESettingsFormEnum.COMMERCIAL_GENERAL_LIABILITY
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.COMMERCIAL_POLICY),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.COMMERCIAL_INSURER_NAME
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.COMMERCIAL_RATING),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.COMMERCIAL_OCCURRENCE
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.COMMERCIAL_DAMAGE),
            this.insurancePolicyForm.get(ESettingsFormEnum.COMMERCIAL_INJURY),
            this.insurancePolicyForm.get(ESettingsFormEnum.COMMERCIAL_MEDICAL),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.COMMERCIAL_GENERAL_AGGREGATE
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.COMMERCIAL_PRODUCTS)
        );

        this.followChangesForChekbox(
            ESettingsFormEnum.AUTOMOBILE,
            this.insurancePolicyForm.get(
                ESettingsFormEnum.AUTOMOBILE_LIABILITY
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.AUTOMOBILE_POLICY),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.AUTOMOBILE_INSURER_NAME
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.AUTOMOBILE_RATING),
            this.insurancePolicyForm.get(ESettingsFormEnum.AUTOMOBILE_ACCIDENT),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.AUTOMOBILE_INJURY_PERSON
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.AUTOMOBILE_LIMIT),
            this.insurancePolicyForm.get(ESettingsFormEnum.AUTOMOBILE_DAMAGE)
        );

        this.followChangesForChekbox(
            ESettingsFormEnum.MOTOR,
            this.insurancePolicyForm.get(ESettingsFormEnum.MOTOR_TRUCK_CARGO),
            this.insurancePolicyForm.get(ESettingsFormEnum.MOTOR_POLICY),
            this.insurancePolicyForm.get(ESettingsFormEnum.MOTOR_INSURER_NAME),
            this.insurancePolicyForm.get(ESettingsFormEnum.MOTOR_RATING),
            this.insurancePolicyForm.get(ESettingsFormEnum.MOTOR_CONVEYANCE),
            this.insurancePolicyForm.get(ESettingsFormEnum.MOTOR_DEDUCTIBLE)
        );

        this.followChangesForChekbox(
            ESettingsFormEnum.PHYSICAL,
            this.insurancePolicyForm.get(ESettingsFormEnum.PHYSICAL_DAMAGE),
            this.insurancePolicyForm.get(ESettingsFormEnum.PHYSICAL_POLICY),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.PHYSICAL_INSURER_NAME
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.PHYSICAL_COLLISION),
            this.insurancePolicyForm.get(ESettingsFormEnum.PHYSICAL_DEDUCTIBLE)
        );

        this.followChangesForChekbox(
            ESettingsFormEnum.TRAILER,
            this.insurancePolicyForm.get(ESettingsFormEnum.TRAILER_INTERCHANGE),
            this.insurancePolicyForm.get(ESettingsFormEnum.TRAILER_POLICY),
            this.insurancePolicyForm.get(
                ESettingsFormEnum.TRAILER_INSURER_NAME
            ),
            this.insurancePolicyForm.get(ESettingsFormEnum.TRAILER_RATING),
            this.insurancePolicyForm.get(ESettingsFormEnum.TRAILER_VALUE)
        );
    }

    private followChangesForChekbox(
        action: string,
        checkboxControl: AbstractControl,
        control_1: AbstractControl,
        control_2: AbstractControl,
        control_3?: AbstractControl,
        control_4?: AbstractControl,
        control_5?: AbstractControl,
        control_6?: AbstractControl,
        control_7?: AbstractControl,
        control_8?: AbstractControl,
        control_9?: AbstractControl
    ) {
        checkboxControl.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(control_1);
                    this.inputService.changeValidators(control_2);
                } else {
                    this.inputService.changeValidators(control_1, false);
                    this.inputService.changeValidators(control_2, false);
                    if (control_3)
                        this.inputService.changeValidators(control_3, false);
                    if (control_4)
                        this.inputService.changeValidators(control_4, false);
                    if (control_5)
                        this.inputService.changeValidators(control_5, false);
                    if (control_6)
                        this.inputService.changeValidators(control_6, false);
                    if (control_7)
                        this.inputService.changeValidators(control_7, false);
                    if (control_8)
                        this.inputService.changeValidators(control_8, false);
                    if (control_9)
                        this.inputService.changeValidators(control_9, false);

                    switch (action) {
                        case 'commercial':
                            this.selectedCommericalRating = null;
                            break;
                        case 'automobile':
                            this.selectedAutomobileRating = null;
                            break;
                        case 'motor':
                            this.selectedMotorRating = null;
                            break;
                        case 'physical':
                            this.selectedPhysicalDamageRating = null;
                            break;
                        case 'trailer':
                            this.selectedTrailerRating = null;
                            break;
                        default:
                            break;
                    }
                }
            });
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectDropdown(event: any, action: string): void {
        switch (action) {
            case 'commercial':
                this.selectedCommericalRating = event;
                break;
            case 'automobile':
                this.selectedAutomobileRating = event;
                break;
            case 'motor':
                this.selectedMotorRating = event;
                break;
            case 'physical damage':
                this.selectedPhysicalDamageRating = event;
                break;
            case 'trailer interchange':
                this.selectedTrailerRating = event;
                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files?.length ? event.files : [];
        switch (event.action) {
            case EGeneralActions.ADD:
                this.insurancePolicyForm
                    .get(EFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            case EGeneralActions.DELETE:
                this.insurancePolicyForm
                    .get(EFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) this.filesForDelete.push(event.deleteId);
                this.fileModified = true;
                break;
            default:
                break;
        }
    }

    private getInsurancePolicyDropdowns(): void {
        this.settingsCompanyService
            .getInsurancePolicyModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: InsurancePolicyModalResponse) => {
                    this.ratings = res.ratings;

                    if (this.editData.type === EGeneralActions.EDIT) {
                        this.isCardAnimationDisabled = true;
                        this.editInsurancePolicyById(this.editData.company);
                    } else this.startFormChanges();
                },
            });
    }

    private addInsurancePolicy(company: any) {
        let {
            addressUnit,
            issued,
            expires,
            // Commerical General Liability
            commericalGeneralLiability,
            commericalPolicy,
            commericalInsurerName,
            commericalRating,
            commericalOccurrence,
            commericalDamage,
            commericalInj,
            commericalMedical,
            commericalGeneralAggregate,
            commericalProducts,
            // Automobile Liability
            automobileLiability,
            automobilePolicy,
            automobileInsurerName,
            automobileRating,
            automobileAccident,
            automobileInjuryPerson,
            automobileLimit,
            automobileDamage,
            // Moto Truck & Reefer Breakdown
            motorTruckCargo,
            reeferBreakdown,
            motorPolicy,
            motorInsurerName,
            motorRating,
            motorConveyance,
            motorDeductable,
            // Physical Damage
            physicalDamage,
            physicalPolicy,
            physicalInsurerName,
            physicalRating,
            physicalCollision,
            physicalDeductable,
            // Trailer Interchange
            trailerInterchange,
            trailerPolicy,
            trailerInsurerName,
            trailerRating,
            trailerValue,
            ...form
        } = this.insurancePolicyForm.value;

        if (this.selectedAddress) {
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };
        }

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let newData: any = {
            companyId: company.divisions.length ? null : company.id,
            ...form,
            issued: MethodsCalculationsHelper.convertDateToBackend(issued),
            expires: MethodsCalculationsHelper.convertDateToBackend(expires),
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            files: documents ? documents : this.insurancePolicyForm.value.files,
        };

        const commLiablity = commericalGeneralLiability
            ? {
                  isCommercialGeneralLiabillityChecked:
                      commericalGeneralLiability,
                  policy: commericalPolicy,
                  insurerName: commericalInsurerName,
                  rating: this.selectedCommericalRating?.id ?? null,
                  eachOccurrence: commericalOccurrence
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalOccurrence
                        )
                      : null,
                  damageToRentedPremises: commericalDamage
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalDamage
                        )
                      : null,
                  personalAndAdvertisingInjury: commericalInj
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalInj
                        )
                      : null,
                  medicalExpanses: commericalMedical
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalMedical
                        )
                      : null,
                  generalAggregate: commericalGeneralAggregate
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalGeneralAggregate
                        )
                      : null,
                  productsCompOperAggregate: commericalProducts
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalProducts
                        )
                      : null,
              }
            : null;

        const autoLiability = automobileLiability
            ? {
                  isAutomobileLiabillityChecked: automobileLiability,
                  policy: automobilePolicy,
                  insurerName: automobileInsurerName,
                  rating: this.selectedAutomobileRating?.id ?? null,
                  bodilyInjuryAccident: automobileAccident
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileAccident
                        )
                      : null,
                  bodilyInjuryPerson: automobileInjuryPerson
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileInjuryPerson
                        )
                      : null,
                  combinedSingleLimit: automobileLimit
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileLimit
                        )
                      : null,
                  propertyDamage: automobileDamage
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileDamage
                        )
                      : null,
              }
            : null;

        const motTruckCargo = motorTruckCargo
            ? {
                  isMotorTruckChecked: motorTruckCargo,
                  isMotorTruckReeferChecked: motorTruckCargo,
                  policy: motorPolicy,
                  insurerName: motorInsurerName,
                  rating: this.selectedMotorRating
                      ? this.selectedMotorRating.id
                      : null,
                  singleConveyance: motorConveyance
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            motorConveyance
                        )
                      : null,
                  deductable: motorDeductable
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            motorDeductable
                        )
                      : null,
              }
            : null;

        const physDamage = physicalDamage
            ? {
                  isPhysicalDamageChecked: physicalDamage,
                  policy: physicalPolicy,
                  insurerName: physicalInsurerName,
                  rating: this.selectedPhysicalDamageRating?.id ?? null,
                  comprehensiveAndCollision: physicalCollision
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            physicalCollision
                        )
                      : null,
                  deductable: physicalDeductable
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            physicalDeductable
                        )
                      : null,
              }
            : null;

        const trailInterchange = trailerInterchange
            ? {
                  isTrailerInterchangeChecked: trailerInterchange,
                  policy: trailerPolicy,
                  insurerName: trailerInsurerName,
                  rating: this.selectedTrailerRating?.id ?? null,
                  value: trailerValue
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            trailerValue
                        )
                      : null,
              }
            : null;

        let insurancePolicyAddons = [];

        if (commLiablity) insurancePolicyAddons.push(commLiablity);

        if (autoLiability) insurancePolicyAddons.push(autoLiability);

        if (motTruckCargo) insurancePolicyAddons.push(motTruckCargo);

        if (physDamage) insurancePolicyAddons.push(physDamage);

        if (trailInterchange) insurancePolicyAddons.push(trailInterchange);

        newData = {
            ...newData,
            insurancePolicyAddons,
            isDivision: !company.divisions.length,
        };

        this.settingsCompanyService
            .addInsurancePolicy(newData)
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

    private updateInsurancePolicy(id: number) {
        let {
            addressUnit,
            issued,
            expires,
            // Commerical General Liability
            commericalGeneralLiability,
            commericalPolicy,
            commericalInsurerName,
            commericalRating,
            commericalOccurrence,
            commericalDamage,
            commericalInj,
            commericalMedical,
            commericalGeneralAggregate,
            commericalProducts,
            // Automobile Liability
            automobileLiability,
            automobilePolicy,
            automobileInsurerName,
            automobileRating,
            automobileAccident,
            automobileInjuryPerson,
            automobileLimit,
            automobileDamage,
            // Moto Truck & Reefer Breakdown
            motorTruckCargo,
            reeferBreakdown,
            motorPolicy,
            motorInsurerName,
            motorRating,
            motorConveyance,
            motorDeductable,
            // Physical Damage
            physicalDamage,
            physicalPolicy,
            physicalInsurerName,
            physicalRating,
            physicalCollision,
            physicalDeductable,
            // Trailer Interchange
            trailerInterchange,
            trailerPolicy,
            trailerInsurerName,
            trailerRating,
            trailerValue,
            ...form
        } = this.insurancePolicyForm.value;

        if (this.selectedAddress)
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };

        const documents =
            this.documents
                .filter((item) => item.realFile)
                .map((item) => {
                    return item.realFile;
                }) ?? [];

        let newData: any = {
            id,
            ...form,
            issued: MethodsCalculationsHelper.convertDateToBackend(issued),
            expires: MethodsCalculationsHelper.convertDateToBackend(expires),
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            files: documents ?? this.insurancePolicyForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        const commLiablity = commericalGeneralLiability
            ? {
                  id: this.idCommercial,
                  isCommercialGeneralLiabillityChecked:
                      commericalGeneralLiability,
                  policy: commericalPolicy,
                  insurerName: commericalInsurerName,
                  rating: this.selectedCommericalRating?.id ?? null,
                  eachOccurrence: commericalOccurrence
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalOccurrence
                        )
                      : null,
                  damageToRentedPremises: commericalDamage
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalDamage
                        )
                      : null,
                  personalAndAdvertisingInjury: commericalInj
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalInj
                        )
                      : null,
                  medicalExpanses: commericalMedical
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalMedical
                        )
                      : null,
                  generalAggregate: commericalGeneralAggregate
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalGeneralAggregate
                        )
                      : null,
                  productsCompOperAggregate: commericalProducts
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            commericalProducts
                        )
                      : null,
              }
            : null;

        const autoLiability = automobileLiability
            ? {
                  id: this.idAutomobile,
                  isAutomobileLiabillityChecked: automobileLiability,
                  policy: automobilePolicy,
                  insurerName: automobileInsurerName,
                  rating: this.selectedAutomobileRating?.id ?? null,
                  bodilyInjuryAccident: automobileAccident
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileAccident
                        )
                      : null,
                  bodilyInjuryPerson: automobileInjuryPerson
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileInjuryPerson
                        )
                      : null,
                  combinedSingleLimit: automobileLimit
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileLimit
                        )
                      : null,
                  propertyDamage: automobileDamage
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            automobileDamage
                        )
                      : null,
              }
            : null;

        const motTruckCargo = motorTruckCargo
            ? {
                  id: this.idMotor,
                  isMotorTruckChecked: motorTruckCargo,
                  isMotorTruckReeferChecked: motorTruckCargo,
                  policy: motorPolicy,
                  insurerName: motorInsurerName,
                  rating: this.selectedMotorRating?.id ?? null,
                  singleConveyance: motorConveyance
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            motorConveyance
                        )
                      : null,
                  deductable: motorDeductable
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            motorDeductable
                        )
                      : null,
              }
            : null;

        const physDamage = physicalDamage
            ? {
                  id: this.idPhysicalDamage,
                  isPhysicalDamageChecked: physicalDamage,
                  policy: physicalPolicy,
                  insurerName: physicalInsurerName,
                  rating: this.selectedPhysicalDamageRating?.id ?? null,
                  comprehensiveAndCollision: physicalCollision
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            physicalCollision
                        )
                      : null,
                  deductable: physicalDeductable
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            physicalDeductable
                        )
                      : null,
              }
            : null;

        const trailInterchange = trailerInterchange
            ? {
                  id: this.idTrailerInterchange,
                  isTrailerInterchangeChecked: trailerInterchange,
                  policy: trailerPolicy,
                  insurerName: trailerInsurerName,
                  rating: this.selectedTrailerRating?.id ?? null,
                  value: trailerValue
                      ? MethodsCalculationsHelper.convertThousandSepInNumber(
                            trailerValue
                        )
                      : null,
              }
            : null;

        let insurancePolicyAddons = [];

        if (commLiablity)
            insurancePolicyAddons = [...insurancePolicyAddons, commLiablity];

        if (autoLiability)
            insurancePolicyAddons = [...insurancePolicyAddons, autoLiability];

        if (motTruckCargo)
            insurancePolicyAddons = [...insurancePolicyAddons, motTruckCargo];

        if (physDamage)
            insurancePolicyAddons = [...insurancePolicyAddons, physDamage];

        if (trailInterchange)
            insurancePolicyAddons = [
                ...insurancePolicyAddons,
                trailInterchange,
            ];

        newData = {
            ...newData,
            insurancePolicyAddons,
        };

        this.settingsCompanyService
            .updateInsurancePolicy(newData)
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

    private deleteInsurancePolicyById(id: number) {
        this.settingsCompanyService
            .deleteInsurancePolicyById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: EGeneralActions.DELETE,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: EGeneralActions.DELETE,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private editInsurancePolicyById(insurance: any) {
        this.insurancePolicyForm.patchValue({
            ...insurance,
            issued: MethodsCalculationsHelper.convertDateFromBackend(
                insurance.issued
            ),
            expires: MethodsCalculationsHelper.convertDateFromBackend(
                insurance.expires
            ),
            address: insurance.address.address,
            addressUnit: insurance.address.addressUnit,
        });

        this.onHandleAddress({
            address: insurance.address,
            valid: insurance.address.address ? true : false,
        });

        this.documents = insurance.files?.length ? insurance.files : [];

        if (insurance.insurancePolicyAddons.length) {
            for (const insur of insurance.insurancePolicyAddons) {
                switch (insur.insurancePolicyAddonType?.name) {
                    case ESettingsFormEnum.COMMERCIAL_GENERAL_LIABILITY:
                        this.idCommercial = insur.id;
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_GENERAL_LIABILITY)
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_POLICY)
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_INSURER_NAME)
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_RATING)
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_OCCURRENCE)
                            .patchValue(
                                insur.eachOccurrence
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.eachOccurrence
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_DAMAGE)
                            .patchValue(
                                insur.damageToRentedPremises
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.damageToRentedPremises
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_INJ)
                            .patchValue(
                                insur.personalAndAdvertisingInjury
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.personalAndAdvertisingInjury
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_MEDICAL)
                            .patchValue(
                                insur.medicalExpanses
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.medicalExpanses
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_GENERAL_AGGREGATE)
                            .patchValue(
                                insur.generalAggregate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.generalAggregate
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.COMMERCIAL_PRODUCTS)
                            .patchValue(
                                insur.productsCompOperAggregate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.productsCompOperAggregate
                                      )
                                    : null
                            );

                        this.selectedCommericalRating = insur.rating;
                        break;

                    case ESettingsFormEnum.AUTOMOBILE_LIABILITY:
                        this.idAutomobile = insur.id;
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_LIABILITY)
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_POLICY)
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_INSURER_NAME)
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_RATING)
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_ACCIDENT)
                            .patchValue(
                                insur.bodilyInjuryAccident
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.bodilyInjuryAccident
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_INJURY_PERSON)
                            .patchValue(
                                insur.bodilyInjuryPerson
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.bodilyInjuryPerson
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_LIMIT)
                            .patchValue(
                                insur.combinedSingleLimit
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.combinedSingleLimit
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.AUTOMOBILE_DAMAGE)
                            .patchValue(
                                insur.propertyDamage
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.propertyDamage
                                      )
                                    : null
                            );

                        this.selectedAutomobileRating = insur.rating;
                        break;

                    case ESettingsFormEnum.MOTOR_TRUCK_CARGO_BREAKDOWN:
                        this.idMotor = insur.id;
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.MOTOR_TRUCK_CARGO)
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.REEFER_BREAKDOWN)
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.MOTOR_POLICY)
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.MOTOR_INSURER_NAME)
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.MOTOR_RATING)
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.MOTOR_CONVEYANCE)
                            .patchValue(
                                insur.singleConveyance
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.singleConveyance
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.MOTOR_DEDUCTIBLE)
                            .patchValue(
                                insur.deductable
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.deductable
                                      )
                                    : null
                            );
                        this.selectedMotorRating = insur.rating;
                        break;
                    case ESettingsFormEnum.PHYSICAL_DAMAGE_WITH_WHITESPACE:
                        this.idTrailerInterchange = insur.id;
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.PHYSICAL_DAMAGE)
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.PHYSICAL_POLICY)
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.PHYSICAL_INSURER_NAME)
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.PHYSICAL_RATING)
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.PHYSICAL_COLLISION)
                            .patchValue(
                                insur.comprehensiveAndCollision
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.comprehensiveAndCollision
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.PHYSICAL_DEDUCTIBLE)
                            .patchValue(
                                insur.deductable
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.deductable
                                      )
                                    : null
                            );

                        this.selectedPhysicalDamageRating = insur.rating;
                        break;

                    case ESettingsFormEnum.TRUCK_INTERCHANGE:
                        this.idPhysicalDamage = insur.id;
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.TRAILER_INTERCHANGE)
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.TRAILER_POLICY)
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.TRAILER_INSURER_NAME)
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.TRAILER_RATING)
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get(ESettingsFormEnum.TRAILER_VALUE)
                            .patchValue(
                                insur.value
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.value
                                      )
                                    : null
                            );

                        this.selectedTrailerRating = insur.rating;
                        break;

                    default:
                        break;
                }
            }
        }
        setTimeout(() => {
            this.startFormChanges();
            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.insurancePolicyForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });

        this.issueExpireDateChanges();
    }

    private issueExpireDateChanges(): void {
        this.insurancePolicyForm
            .get(ESettingsFormEnum.ISSUED)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    moment(
                        this.insurancePolicyForm.get(ESettingsFormEnum.EXPIRES)
                            .value
                    ).isBefore(moment(value)) ||
                    moment(
                        this.insurancePolicyForm.get(ESettingsFormEnum.EXPIRES)
                            .value
                    ).isSame(moment(value))
                )
                    this.insurancePolicyForm
                        .get(ESettingsFormEnum.EXPIRES)
                        .setErrors({ invalid: true });
                else
                    this.insurancePolicyForm
                        .get(ESettingsFormEnum.EXPIRES)
                        .setErrors(null);
            });

        this.insurancePolicyForm
            .get(ESettingsFormEnum.EXPIRES)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    moment(value).isBefore(
                        moment(
                            this.insurancePolicyForm.get(
                                ESettingsFormEnum.ISSUED
                            ).value
                        )
                    ) ||
                    moment(value).isSame(
                        moment(
                            this.insurancePolicyForm.get(
                                ESettingsFormEnum.ISSUED
                            ).value
                        )
                    )
                ) {
                    this.insurancePolicyForm
                        .get(ESettingsFormEnum.EXPIRES)
                        .setErrors({ invalid: true });
                } else {
                    this.insurancePolicyForm
                        .get(ESettingsFormEnum.EXPIRES)
                        .setErrors(null);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
