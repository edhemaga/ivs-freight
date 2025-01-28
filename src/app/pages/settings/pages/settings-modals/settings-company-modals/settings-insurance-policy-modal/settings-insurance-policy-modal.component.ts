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
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

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
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
    ],
})
export class SettingsInsurancePolicyModalComponent
    implements OnInit, OnDestroy
{
    private destroy$ = new Subject<void>();
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
        private formService: FormService
    ) {}

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
            this.insurancePolicyForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                // If Form not valid
                if (this.insurancePolicyForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.insurancePolicyForm);
                    return;
                }
                if (this.editData.type === 'edit') {
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
            }
            case 'delete': {
                this.deleteInsurancePolicyById(this.editData.company.id);
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

    private trackCheckboxValues() {
        this.followChangesForChekbox(
            'commercial',
            this.insurancePolicyForm.get('commericalGeneralLiability'),
            this.insurancePolicyForm.get('commericalPolicy'),
            this.insurancePolicyForm.get('commericalInsurerName'),
            this.insurancePolicyForm.get('commericalRating'),
            this.insurancePolicyForm.get('commericalOccurrence'),
            this.insurancePolicyForm.get('commericalDamage'),
            this.insurancePolicyForm.get('commericalInj'),
            this.insurancePolicyForm.get('commericalMedical'),
            this.insurancePolicyForm.get('commericalGeneralAggregate'),
            this.insurancePolicyForm.get('commericalProducts')
        );

        this.followChangesForChekbox(
            'automobile',
            this.insurancePolicyForm.get('automobileLiability'),
            this.insurancePolicyForm.get('automobilePolicy'),
            this.insurancePolicyForm.get('automobileInsurerName'),
            this.insurancePolicyForm.get('automobileRating'),
            this.insurancePolicyForm.get('automobileAccident'),
            this.insurancePolicyForm.get('automobileInjuryPerson'),
            this.insurancePolicyForm.get('automobileLimit'),
            this.insurancePolicyForm.get('automobileDamage')
        );

        this.followChangesForChekbox(
            'motor',
            this.insurancePolicyForm.get('motorTruckCargo'),
            this.insurancePolicyForm.get('motorPolicy'),
            this.insurancePolicyForm.get('motorInsurerName'),
            this.insurancePolicyForm.get('motorRating'),
            this.insurancePolicyForm.get('motorConveyance'),
            this.insurancePolicyForm.get('motorDeductable')
        );

        this.followChangesForChekbox(
            'physical',
            this.insurancePolicyForm.get('physicalDamage'),
            this.insurancePolicyForm.get('physicalPolicy'),
            this.insurancePolicyForm.get('physicalInsurerName'),
            this.insurancePolicyForm.get('physicalCollision'),
            this.insurancePolicyForm.get('physicalDeductable')
        );

        this.followChangesForChekbox(
            'trailer',
            this.insurancePolicyForm.get('trailerInterchange'),
            this.insurancePolicyForm.get('trailerPolicy'),
            this.insurancePolicyForm.get('trailerInsurerName'),
            this.insurancePolicyForm.get('trailerRating'),
            this.insurancePolicyForm.get('trailerValue')
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
                        case 'commercial': {
                            this.selectedCommericalRating = null;
                            break;
                        }
                        case 'automobile': {
                            this.selectedAutomobileRating = null;
                            break;
                        }
                        case 'motor': {
                            this.selectedMotorRating = null;
                            break;
                        }
                        case 'physical': {
                            this.selectedPhysicalDamageRating = null;
                            break;
                        }
                        case 'trailer': {
                            this.selectedTrailerRating = null;
                            break;
                        }
                        default: {
                            break;
                        }
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

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'commercial': {
                this.selectedCommericalRating = event;
                break;
            }
            case 'automobile': {
                this.selectedAutomobileRating = event;
                break;
            }
            case 'motor': {
                this.selectedMotorRating = event;
                break;
            }
            case 'physical damage': {
                this.selectedPhysicalDamageRating = event;
                break;
            }
            case 'trailer interchange': {
                this.selectedTrailerRating = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onFilesEvent(event: any) {
        this.documents = event.files?.length ? event.files : [];
        switch (event.action) {
            case 'add': {
                this.insurancePolicyForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.insurancePolicyForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    private getInsurancePolicyDropdowns() {
        this.settingsCompanyService
            .getInsurancePolicyModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: InsurancePolicyModalResponse) => {
                    this.ratings = res.ratings;

                    if (this.editData.type === 'edit') {
                        this.isCardAnimationDisabled = true;
                        this.editInsurancePolicyById(this.editData.company);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
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
                  rating: this.selectedCommericalRating
                      ? this.selectedCommericalRating.id
                      : null,
                  eachOccurrence: commericalOccurrence
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalOccurrence
                        )
                      : null,
                  damageToRentedPremises: commericalDamage
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalDamage
                        )
                      : null,
                  personalAndAdvertisingInjury: commericalInj
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalInj
                        )
                      : null,
                  medicalExpanses: commericalMedical
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalMedical
                        )
                      : null,
                  generalAggregate: commericalGeneralAggregate
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalGeneralAggregate
                        )
                      : null,
                  productsCompOperAggregate: commericalProducts
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
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
                  rating: this.selectedAutomobileRating
                      ? this.selectedAutomobileRating.id
                      : null,
                  bodilyInjuryAccident: automobileAccident
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileAccident
                        )
                      : null,
                  bodilyInjuryPerson: automobileInjuryPerson
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileInjuryPerson
                        )
                      : null,
                  combinedSingleLimit: automobileLimit
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileLimit
                        )
                      : null,
                  propertyDamage: automobileDamage
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
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
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            motorConveyance
                        )
                      : null,
                  deductable: motorDeductable
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
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
                  rating: this.selectedPhysicalDamageRating
                      ? this.selectedPhysicalDamageRating.id
                      : null,
                  comprehensiveAndCollision: physicalCollision
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            physicalCollision
                        )
                      : null,
                  deductable: physicalDeductable
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
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
                  rating: this.selectedTrailerRating
                      ? this.selectedTrailerRating.id
                      : null,
                  value: trailerValue
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            trailerValue
                        )
                      : null,
              }
            : null;

        let insurancePolicyAddons = [];

        if (commLiablity) {
            insurancePolicyAddons.push(commLiablity);
        }

        if (autoLiability) {
            insurancePolicyAddons.push(autoLiability);
        }

        if (motTruckCargo) {
            insurancePolicyAddons.push(motTruckCargo);
        }

        if (physDamage) {
            insurancePolicyAddons.push(physDamage);
        }

        if (trailInterchange) {
            insurancePolicyAddons.push(trailInterchange);
        }

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
            id: id,
            ...form,
            issued: MethodsCalculationsHelper.convertDateToBackend(issued),
            expires: MethodsCalculationsHelper.convertDateToBackend(expires),
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            files: documents ? documents : this.insurancePolicyForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        const commLiablity = commericalGeneralLiability
            ? {
                  id: this.idCommercial ? this.idCommercial : 0,
                  isCommercialGeneralLiabillityChecked:
                      commericalGeneralLiability,
                  policy: commericalPolicy,
                  insurerName: commericalInsurerName,
                  rating: this.selectedCommericalRating
                      ? this.selectedCommericalRating.id
                      : null,
                  eachOccurrence: commericalOccurrence
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalOccurrence
                        )
                      : null,
                  damageToRentedPremises: commericalDamage
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalDamage
                        )
                      : null,
                  personalAndAdvertisingInjury: commericalInj
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalInj
                        )
                      : null,
                  medicalExpanses: commericalMedical
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalMedical
                        )
                      : null,
                  generalAggregate: commericalGeneralAggregate
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalGeneralAggregate
                        )
                      : null,
                  productsCompOperAggregate: commericalProducts
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            commericalProducts
                        )
                      : null,
              }
            : null;

        const autoLiability = automobileLiability
            ? {
                  id: this.idAutomobile ? this.idAutomobile : 0,
                  isAutomobileLiabillityChecked: automobileLiability,
                  policy: automobilePolicy,
                  insurerName: automobileInsurerName,
                  rating: this.selectedAutomobileRating
                      ? this.selectedAutomobileRating.id
                      : null,
                  bodilyInjuryAccident: automobileAccident
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileAccident
                        )
                      : null,
                  bodilyInjuryPerson: automobileInjuryPerson
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileInjuryPerson
                        )
                      : null,
                  combinedSingleLimit: automobileLimit
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileLimit
                        )
                      : null,
                  propertyDamage: automobileDamage
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            automobileDamage
                        )
                      : null,
              }
            : null;

        const motTruckCargo = motorTruckCargo
            ? {
                  id: this.idMotor ? this.idMotor : 0,
                  isMotorTruckChecked: motorTruckCargo,
                  isMotorTruckReeferChecked: motorTruckCargo,
                  policy: motorPolicy,
                  insurerName: motorInsurerName,
                  rating: this.selectedMotorRating
                      ? this.selectedMotorRating.id
                      : null,
                  singleConveyance: motorConveyance
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            motorConveyance
                        )
                      : null,
                  deductable: motorDeductable
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            motorDeductable
                        )
                      : null,
              }
            : null;

        const physDamage = physicalDamage
            ? {
                  id: this.idPhysicalDamage ? this.idPhysicalDamage : 0,
                  isPhysicalDamageChecked: physicalDamage,
                  policy: physicalPolicy,
                  insurerName: physicalInsurerName,
                  rating: this.selectedPhysicalDamageRating
                      ? this.selectedPhysicalDamageRating.id
                      : null,
                  comprehensiveAndCollision: physicalCollision
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            physicalCollision
                        )
                      : null,
                  deductable: physicalDeductable
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            physicalDeductable
                        )
                      : null,
              }
            : null;

        const trailInterchange = trailerInterchange
            ? {
                  id: this.idTrailerInterchange ? this.idTrailerInterchange : 0,
                  isTrailerInterchangeChecked: trailerInterchange,
                  policy: trailerPolicy,
                  insurerName: trailerInsurerName,
                  rating: this.selectedTrailerRating
                      ? this.selectedTrailerRating.id
                      : null,
                  value: trailerValue
                      ? MethodsCalculationsHelper.convertThousanSepInNumber(
                            trailerValue
                        )
                      : null,
              }
            : null;

        let insurancePolicyAddons = [];

        if (commLiablity) {
            insurancePolicyAddons.push(commLiablity);
        }

        if (autoLiability) {
            insurancePolicyAddons.push(autoLiability);
        }

        if (motTruckCargo) {
            insurancePolicyAddons.push(motTruckCargo);
        }

        if (physDamage) {
            insurancePolicyAddons.push(physDamage);
        }

        if (trailInterchange) {
            insurancePolicyAddons.push(trailInterchange);
        }

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

    private editInsurancePolicyById(insurance: any) {
        this.insurancePolicyForm.patchValue({
            producerName: insurance.producerName,
            issued: MethodsCalculationsHelper.convertDateFromBackend(
                insurance.issued
            ),
            expires: MethodsCalculationsHelper.convertDateFromBackend(
                insurance.expires
            ),
            phone: insurance.phone,
            email: insurance.email,
            address: insurance.address.address,
            addressUnit: insurance.address.addressUnit,
            note: insurance.note,
            files: insurance.files,
        });

        this.onHandleAddress({
            address: insurance.address,
            valid: insurance.address.address ? true : false,
        });

        this.documents = insurance.files?.length ? insurance.files : [];

        if (insurance.insurancePolicyAddons.length) {
            for (const insur of insurance.insurancePolicyAddons) {
                switch (insur.insurancePolicyAddonType?.name) {
                    case 'Commercial General Liabillity': {
                        this.idCommercial = insur.id;
                        this.insurancePolicyForm
                            .get('commericalGeneralLiability')
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get('commericalPolicy')
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get('commericalInsurerName')
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get('commericalRating')
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get('commericalOccurrence')
                            .patchValue(
                                insur.eachOccurrence
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.eachOccurrence
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('commericalDamage')
                            .patchValue(
                                insur.damageToRentedPremises
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.damageToRentedPremises
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('commericalInj')
                            .patchValue(
                                insur.personalAndAdvertisingInjury
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.personalAndAdvertisingInjury
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('commericalMedical')
                            .patchValue(
                                insur.medicalExpanses
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.medicalExpanses
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('commericalGeneralAggregate')
                            .patchValue(
                                insur.generalAggregate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.generalAggregate
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('commericalProducts')
                            .patchValue(
                                insur.productsCompOperAggregate
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.productsCompOperAggregate
                                      )
                                    : null
                            );

                        this.selectedCommericalRating = insur.rating;
                        break;
                    }
                    case 'Autmobile Liabillity': {
                        this.idAutomobile = insur.id;
                        this.insurancePolicyForm
                            .get('automobileLiability')
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get('automobilePolicy')
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get('automobileInsurerName')
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get('automobileRating')
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get('automobileAccident')
                            .patchValue(
                                insur.bodilyInjuryAccident
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.bodilyInjuryAccident
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('automobileInjuryPerson')
                            .patchValue(
                                insur.bodilyInjuryPerson
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.bodilyInjuryPerson
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('automobileLimit')
                            .patchValue(
                                insur.combinedSingleLimit
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.combinedSingleLimit
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('automobileDamage')
                            .patchValue(
                                insur.propertyDamage
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.propertyDamage
                                      )
                                    : null
                            );

                        this.selectedAutomobileRating = insur.rating;

                        break;
                    }
                    case 'Motor Truck Cargo Breakdown': {
                        this.idMotor = insur.id;
                        this.insurancePolicyForm
                            .get('motorTruckCargo')
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get('reeferBreakdown')
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get('motorPolicy')
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get('motorInsurerName')
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get('motorRating')
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get('motorConveyance')
                            .patchValue(
                                insur.singleConveyance
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.singleConveyance
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('motorDeductable')
                            .patchValue(
                                insur.deductable
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.deductable
                                      )
                                    : null
                            );

                        this.selectedMotorRating = insur.rating;
                        break;
                    }
                    case 'Physical Damage': {
                        this.idTrailerInterchange = insur.id;
                        this.insurancePolicyForm
                            .get('physicalDamage')
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get('physicalPolicy')
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get('physicalInsurerName')
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get('physicalRating')
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get('physicalCollision')
                            .patchValue(
                                insur.comprehensiveAndCollision
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.comprehensiveAndCollision
                                      )
                                    : null
                            );
                        this.insurancePolicyForm
                            .get('physicalDeductable')
                            .patchValue(
                                insur.deductable
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.deductable
                                      )
                                    : null
                            );

                        this.selectedPhysicalDamageRating = insur.rating;
                        break;
                    }
                    case 'Trailer Interchange': {
                        this.idPhysicalDamage = insur.id;
                        this.insurancePolicyForm
                            .get('trailerInterchange')
                            .patchValue(true);
                        this.insurancePolicyForm
                            .get('trailerPolicy')
                            .patchValue(insur.policy);
                        this.insurancePolicyForm
                            .get('trailerInsurerName')
                            .patchValue(insur.insurerName);
                        this.insurancePolicyForm
                            .get('trailerRating')
                            .patchValue(
                                insur.rating ? insur.rating.name : null
                            );
                        this.insurancePolicyForm
                            .get('trailerValue')
                            .patchValue(
                                insur.value
                                    ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                          insur.value
                                      )
                                    : null
                            );

                        this.selectedTrailerRating = insur.rating;
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        }
        setTimeout(() => {
            this.startFormChanges();
            this.isCardAnimationDisabled = false;
        }, 1000);
    }

    private startFormChanges() {
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
            .get('issued')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    moment(
                        this.insurancePolicyForm.get('expires').value
                    ).isBefore(moment(value)) ||
                    moment(
                        this.insurancePolicyForm.get('expires').value
                    ).isSame(moment(value))
                ) {
                    this.insurancePolicyForm
                        .get('expires')
                        .setErrors({ invalid: true });
                } else {
                    this.insurancePolicyForm.get('expires').setErrors(null);
                }
            });

        this.insurancePolicyForm
            .get('expires')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    moment(value).isBefore(
                        moment(this.insurancePolicyForm.get('issued').value)
                    ) ||
                    moment(value).isSame(
                        moment(this.insurancePolicyForm.get('issued').value)
                    )
                ) {
                    this.insurancePolicyForm
                        .get('expires')
                        .setErrors({ invalid: true });
                } else {
                    this.insurancePolicyForm.get('expires').setErrors(null);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
