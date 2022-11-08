import { fuelStopValidation } from '../../../shared/ta-input/ta-input.regex-validations';
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
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editFuelStop(this.editData.id);
    }
  }

  private createForm() {
    this.fuelStopForm = this.formBuilder.group({
      name: [null, [Validators.required, ...fuelStopValidation]],
      store: [null, fuelStoreValidation],
      favourite: [null],
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
          if (this.isFormDirty) {
            this.updateFuelStop(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          }
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

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  private updateFuelStop(id: number) {}
  private addFuelStop() {}
  private deleteFuelStopById(id: number) {}
  private editFuelStop(id: number) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
