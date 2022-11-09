import {
  businessNameValidation,
  fuelStopValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  addressUnitValidation,
  addressValidation,
  phoneFaxRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { fuelStoreValidation } from '../../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../../services/form/form.service';
import { FuelTService } from '../../../fuel/state/fuel.service';
import { GetFuelStopModalResponse } from '../../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-fuel-stop-modal',
  templateUrl: './fuel-stop-modal.component.html',
  styleUrls: ['./fuel-stop-modal.component.scss'],
  providers: [ModalService],
})
export class FuelStopModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public fuelStopForm: FormGroup;

  public fuelStops: any[] = [];

  public selectedFuelStop: any = null;
  public selectedAddress: AddressEntity;

  public isFavouriteFuelStop: boolean = false;

  public isFormDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService,
    private fuelService: FuelTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getModalDropdowns();
    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.getFuelStopById(this.editData.id);
    }
  }

  private createForm() {
    this.fuelStopForm = this.formBuilder.group({
      businessName: [null, [...businessNameValidation]],
      fuelStopFranchiseId: [null, [Validators.required, ...fuelStopValidation]],
      store: [null, fuelStoreValidation],
      favourite: [false],
      phone: [null, [Validators.required, phoneFaxRegex]],
      fax: [null, phoneFaxRegex],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      note: [null],
    });

    this.formService.checkFormChange(this.fuelStopForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        if (this.fuelStopForm.invalid || !this.isFormDirty) {
          this.inputService.markInvalid(this.fuelStopForm);
          return;
        }
        if (this.editData) {
          this.updateFuelStop(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addFuelStop();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteFuelStopById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public favouriteFuelStop() {
    this.isFavouriteFuelStop = !this.isFavouriteFuelStop;
    this.fuelStopForm.get('favourite').patchValue(this.isFavouriteFuelStop);
  }

  public onSelectDropdown(event: any, action) {
    switch (action) {
      case 'fuel-stop': {
        this.selectedFuelStop = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSaveNewFuelStop(event: any) {
    this.fuelStopForm.get('businessName').patchValue(event.data.name);
    this.fuelStopForm.get('fuelStopFranchiseId').clearValidators();
    this.selectedFuelStop = null;
    this.fuelStopForm
      .get('businessName')
      .setValidators([Validators.required, ...businessNameValidation]);
  }

  public clearNewFuelStop() {
    this.fuelStopForm.get('businessName').patchValue(null);
    this.fuelStopForm.get('businessName').clearValidators();
    this.fuelStopForm.get('fuelStopFranchiseId').patchValue(null);
    this.selectedFuelStop = null;
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  private updateFuelStop(id: number) {}

  private addFuelStop() {
    const { address, addressUnit, businessName, ...form } =
      this.fuelStopForm.value;
    const newData: any = {
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
      businessName: !this.selectedFuelStop ? businessName : null,
      fuelStopFranchiseId: this.selectedFuelStop
        ? this.selectedFuelStop.id
        : null,
    };
    console.log(newData);
    this.fuelService
      .addFuelStop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Success',
            'Successfully fuel stop added.'
          );
        },
        error: (err: any) => {
          console.log('error... ', err);
        },
      });
  }

  private deleteFuelStopById(id: number) {}

  private getFuelStopById(id: number) {}

  private getModalDropdowns() {
    this.fuelService
      .getFuelStopModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetFuelStopModalResponse) => {
          this.fuelStops = res.fuelStopFranchise.map((item) => {
            return {
              id: item.id,
              name: item.businessName,
            };
          });
        },
        error: () => {},
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
