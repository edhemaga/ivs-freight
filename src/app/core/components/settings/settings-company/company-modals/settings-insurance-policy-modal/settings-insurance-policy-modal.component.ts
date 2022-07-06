import {
  phoneRegex,
  emailRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { AddressEntity } from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
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

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService
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

    this.formService.checkFormChange(this.insurancePolicyForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
      });
  }

  public onModalAction(event: any) {}

  public onHandleAddress(event: {
    address: AddressEntity;
    valid: boolean;
  }): void {
    this.selectedAddress = event.address;
  }

  public openCloseCheckboxCard(event: any, action) {
    switch (action) {
      case 'commericalGeneralLiability': {
        if (this.insurancePolicyForm.get('commericalGeneralLiability').value) {
          event.preventDefault();
          event.stopPropagation();
          this.insurancePolicyForm
            .get('commericalGeneralLiability')
            .setValue(false);
        }
        this.isChecked(
          'commericalGeneralLiability',
          'commericalPolicy',
          'commericalInsurerName'
        );
        break;
      }
      case 'automobileLiability': {
        if (this.insurancePolicyForm.get('automobileLiability').value) {
          event.preventDefault();
          event.stopPropagation();
          this.insurancePolicyForm.get('automobileLiability').setValue(false);
        }
        this.isChecked(
          'automobileLiability',
          'automobilePolicy',
          'automobileInsurerName'
        );
        break;
      }
      case 'motorTruckCargo': {
        if (this.insurancePolicyForm.get('motorTruckCargo').value) {
          event.preventDefault();
          event.stopPropagation();
          this.insurancePolicyForm.get('motorTruckCargo').setValue(false);
        }
        this.isChecked('motorTruckCargo', 'motorPolicy', 'motorInsurerName');
        break;
      }
      case 'physicalDamage': {
        if (this.insurancePolicyForm.get('physicalDamage').value) {
          event.preventDefault();
          event.stopPropagation();
          this.insurancePolicyForm.get('physicalDamage').setValue(false);
        }
        this.isChecked(
          'physicalDamage',
          'physicalPolicy',
          'physicalInsurerName'
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  private isChecked(
    formControlName: string,
    validation_first: string,
    validation_second: string
  ) {
    this.insurancePolicyForm
      .get(formControlName)
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.insurancePolicyForm.get(validation_first)
          );
          this.inputService.changeValidators(
            this.insurancePolicyForm.get(validation_second)
          );
        } else {
          this.inputService.changeValidators(
            this.insurancePolicyForm.get(validation_first),
            false
          );
          this.inputService.changeValidators(
            this.insurancePolicyForm.get(validation_second),
            false
          );
        }
      });
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

  ngOnDestroy(): void {}
}
