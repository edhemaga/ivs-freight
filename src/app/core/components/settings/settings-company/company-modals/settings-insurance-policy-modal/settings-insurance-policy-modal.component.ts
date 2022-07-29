import {
  phoneRegex,
  emailRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  AddressEntity,
  CreateInsurancePolicyCommand,
  InsurancePolicyModalResponse,
  UpdateInsurancePolicyCommand,
} from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import {
  convertDateToBackend,
  convertThousanSepInNumber,
} from 'src/app/core/utils/methods.calculations';
import { SettingsStoreService } from '../../../state/settings.service';
import { distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-settings-insurance-policy-modal',
  templateUrl: './settings-insurance-policy-modal.component.html',
  styleUrls: ['./settings-insurance-policy-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class SettingsInsurancePolicyModalComponent
  implements OnInit, OnDestroy
{
  @Input() editData: any;

  public insurancePolicyForm: FormGroup;

  public selectedAddress: AddressEntity;

  public selectedCommericalRating: any = null;
  public selectedAutomobileRating: any = null;
  public selectedMotorRating: any = null;
  public selectedPhysicalDamageRating: any = null;
  public selectedTrailerRating: any = null;

  public documents: any[] = [];
  public ratings: any[] = [];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService,
    private settingsService: SettingsStoreService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getInsurancePolicyDropdowns();
    this.trackCheckboxValues();

    if (this.editData) {
      this.editInsurancePolicyById(this.editData.id);
    }
  }

  private createForm() {
    this.insurancePolicyForm = this.formBuilder.group({
      producerName: [null, Validators.required],
      issued: [null, Validators.required],
      expires: [null, Validators.required],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
      address: [null],
      addressUnit: [null, Validators.maxLength(6)],
      // Commerical General Liability
      commericalGeneralLiability: [false],
      commericalPolicy: [null],
      commericalInsurerName: [null],
      commericalRating: [null],
      commericalOccurrence: [null],
      commericalDamage: [null],
      commericalInj: [null],
      commericalMedical: [null],
      commericalGeneralAggregate: [null],
      commericalProducts: [null],
      // Automobile Liability
      automobileLiability: [false],
      automobilePolicy: [null],
      automobileInsurerName: [null],
      automobileRating: [null],
      automobileAccident: [null],
      automobileInjuryPerson: [null],
      automobileLimit: [null],
      automobileDamage: [null],
      // Moto Truck & Reefer Breakdown
      motorTruckCargo: [false],
      reeferBreakdown: [false],
      motorPolicy: [null],
      motorInsurerName: [null],
      motorRating: [null],
      motorConveyance: [null],
      motorDeductable: [null],
      // Physical Damage
      physicalDamage: [false],
      physicalPolicy: [null],
      physicalInsurerName: [null],
      physicalRating: [null],
      physicalCollision: [null],
      physicalDeductable: [null],
      // Trailer Interchange
      trailerInterchange: [false],
      trailerPolicy: [null],
      trailerInsurerName: [null],
      trailerRating: [null],
      trailerValue: [null],
      note: [null],
    });

    // this.formService.checkFormChange(this.insurancePolicyForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.insurancePolicyForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.insurancePolicyForm.invalid) {
          this.inputService.markInvalid(this.insurancePolicyForm);
          return;
        }
        if (this.editData.type === 'edit') {
          this.updateInsurancePolicy(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addInsurancePolicy(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteInsurancePolicyById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });

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
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(control_1);
          this.inputService.changeValidators(control_2);
        } else {
          this.inputService.changeValidators(control_1, false);
          this.inputService.changeValidators(control_2, false);
          if (control_3) this.inputService.changeValidators(control_3, false);
          if (control_4) this.inputService.changeValidators(control_4, false);
          if (control_5) this.inputService.changeValidators(control_5, false);
          if (control_6) this.inputService.changeValidators(control_6, false);
          if (control_7) this.inputService.changeValidators(control_7, false);
          if (control_8) this.inputService.changeValidators(control_8, false);
          if (control_9) this.inputService.changeValidators(control_9, false);

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
      }
      case 'trailer interchange': {
        this.selectedTrailerRating = event;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event) {
    this.documents = event.files;
  }

  private getInsurancePolicyDropdowns() {
    this.settingsService
      .getInsurancePolicyModal()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: InsurancePolicyModalResponse) => {
          this.ratings = res.ratings;
        },
        error: () => {
          this.notificationService.error(
            "Can't load Insurance Policy dropdowns",
            'Error'
          );
        },
      });
  }

  private addInsurancePolicy(id: number) {
    const {
      address,
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

    let newData: CreateInsurancePolicyCommand = {
      companyId: id,
      ...form,
      issued: convertDateToBackend(issued),
      expires: convertDateToBackend(expires),
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
    };

    const commLiablity = {
      isCommercialGeneralLiabillityChecked: commericalGeneralLiability,
      policy: commericalPolicy,
      insurerName: commericalInsurerName,
      rating: this.selectedCommericalRating
        ? this.selectedCommericalRating.id
        : null,
      eachOccurrence: commericalOccurrence
        ? convertThousanSepInNumber(commericalOccurrence)
        : null,
      damageToRentedPremises: commericalDamage
        ? convertThousanSepInNumber(commericalDamage)
        : null,
      personalAndAdvertisingInjury: commericalInj
        ? convertThousanSepInNumber(commericalInj)
        : null,
      medicalExpanses: commericalMedical
        ? convertThousanSepInNumber(commericalMedical)
        : null,
      generalAggregate: commericalGeneralAggregate
        ? convertThousanSepInNumber(commericalGeneralAggregate)
        : null,
      productsCompOperAggregate: commericalProducts
        ? convertThousanSepInNumber(commericalProducts)
        : null,
    };

    const autoLiability = {
      isAutomobileLiabillityChecked: automobileLiability,
      policy: automobilePolicy,
      insurerName: automobileInsurerName,
      rating: this.selectedAutomobileRating
        ? this.selectedAutomobileRating.id
        : null,
      bodilyInjuryAccident: automobileAccident,
      bodilyInjuryPerson: automobileInjuryPerson,
      combinedSingleLimit: automobileLimit,
      propertyDamage: automobileDamage,
    };

    const motTruckCargo = {
      isMotorTruckChecked: motorTruckCargo,
      isMotorTruckReeferChecked: motorTruckCargo,
      policy: motorPolicy,
      insurerName: motorInsurerName,
      rating: this.selectedMotorRating ? this.selectedMotorRating.id : null,
      singleConveyance: motorConveyance
        ? convertThousanSepInNumber(motorConveyance)
        : null,
      deductable: motorDeductable
        ? convertThousanSepInNumber(motorDeductable)
        : null,
    };

    const physDamage = {
      isPhysicalDamageChecked: physicalDamage,
      policy: physicalPolicy,
      insurerName: physicalInsurerName,
      rating: this.selectedPhysicalDamageRating
        ? this.selectedPhysicalDamageRating.id
        : null,
      comprehensiveAndCollision: physicalCollision,
      deductable: physicalDeductable,
    };

    const trailInterchange = {
      isTrailerInterchangeChecked: trailerInterchange,
      policy: trailerPolicy,
      insurerName: trailerInsurerName,
      rating: this.selectedTrailerRating ? this.selectedTrailerRating.id : null,
      value: trailerValue,
    };

    newData = {
      ...newData,
      insurancePolicyAddons: [
        commLiablity,
        autoLiability,
        motTruckCargo,
        physDamage,
        trailInterchange,
      ],
    };
    console.log('ADDING');
    console.log(newData);
    this.settingsService
      .addInsurancePolicy(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully added insurance policy',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error("Can't add insurance policy", 'Error');
        },
      });
  }

  private updateInsurancePolicy(id: number) {
    const {
      address,
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

    let newData: UpdateInsurancePolicyCommand = {
      id: id,
      ...form,
      issued: convertDateToBackend(issued),
      expires: convertDateToBackend(expires),
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
    };

    const commLiablity = {
      id: 0,
      isCommercialGeneralLiabillityChecked: commericalGeneralLiability,
      policy: commericalPolicy,
      insurerName: commericalInsurerName,
      rating: this.selectedCommericalRating,
      eachOccurrence: commericalOccurrence
        ? convertThousanSepInNumber(commericalOccurrence)
        : null,
      damageToRentedPremises: commericalDamage
        ? convertThousanSepInNumber(commericalDamage)
        : null,
      personalAndAdvertisingInjury: commericalInj
        ? convertThousanSepInNumber(commericalInj)
        : null,
      medicalExpanses: commericalMedical
        ? convertThousanSepInNumber(commericalMedical)
        : null,
      generalAggregate: commericalGeneralAggregate
        ? convertThousanSepInNumber(commericalGeneralAggregate)
        : null,
      productsCompOperAggregate: commericalProducts
        ? convertThousanSepInNumber(commericalProducts)
        : null,
    };

    const autoLiability = {
      id: 0,
      isAutomobileLiabillityChecked: automobileLiability,
      policy: automobilePolicy,
      insurerName: automobileInsurerName,
      rating: this.selectedAutomobileRating,
      bodilyInjuryAccident: automobileAccident,
      bodilyInjuryPerson: automobileInjuryPerson,
      combinedSingleLimit: automobileLimit,
      propertyDamage: automobileDamage,
    };

    const motTruckCargo = {
      id: 0,
      isMotorTruckChecked: motorTruckCargo,
      isMotorTruckReeferChecked: motorTruckCargo,
      policy: motorPolicy,
      insurerName: motorInsurerName,
      rating: this.selectedMotorRating,
      singleConveyance: motorConveyance
        ? convertThousanSepInNumber(motorConveyance)
        : null,
      deductable: motorDeductable
        ? convertThousanSepInNumber(motorDeductable)
        : null,
    };

    const physDamage = {
      id: 0,
      isPhysicalDamageChecked: physicalDamage,
      policy: physicalPolicy,
      insurerName: physicalInsurerName,
      rating: this.selectedPhysicalDamageRating,
      comprehensiveAndCollision: physicalCollision,
      deductable: physicalDeductable,
    };

    const trailInterchange = {
      id: 0,
      isTrailerInterchangeChecked: trailerInterchange,
      policy: trailerPolicy,
      insurerName: trailerInsurerName,
      rating: this.selectedTrailerRating,
      value: trailerValue,
    };

    newData = {
      ...newData,
      insurancePolicyAddons: [
        commLiablity,
        autoLiability,
        motTruckCargo,
        physDamage,
        trailInterchange,
      ],
    };

    this.settingsService
      .updateInsurancePolicy(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully updated insurance policy',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't update insurance policy",
            'Error'
          );
        },
      });
  }

  private deleteInsurancePolicyById(id: number) {
    this.settingsService
      .deleteInsurancePolicyById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully deleted insurance policy',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't delete insurance policy",
            'Error'
          );
        },
      });
  }

  private editInsurancePolicyById(id: number) {
    this.settingsService
      .getInsurancePolicyById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: Object) => {
          console.log(res);
        },
        error: () => {
          this.notificationService;
        },
      });
  }

  ngOnDestroy(): void {}
}
