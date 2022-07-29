import {
  phoneRegex,
  emailRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { convertThousanSepInNumber } from 'src/app/core/utils/methods.calculations';
import { SettingsStoreService } from '../../../state/settings.service';
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
        if (this.editData) {
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

  public onHandleAddress(event: {
    address: AddressEntity;
    valid: boolean;
  }): void {
    this.selectedAddress = event.address;
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
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
    };

    const commLiablity = {
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
      isPhysicalDamageChecked: physicalDamage,
      policy: physicalPolicy,
      insurerName: physicalInsurerName,
      rating: this.selectedPhysicalDamageRating,
      comprehensiveAndCollision: physicalCollision,
      deductable: physicalDeductable,
    };

    const trailInterchange = {
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

    console.log(newData);
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

  ngOnDestroy(): void {}
}
