import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  addressUnitValidation,
  addressValidation,
  phoneRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-fuel-stop-modal',
  templateUrl: './fuel-stop-modal.component.html',
  styleUrls: ['./fuel-stop-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class FuelStopModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public fuelStopForm: FormGroup;

  public fuelStops: any[] = [];

  public selectedFuelStop: any = null;
  public selectedAddress: AddressEntity | AddressEntity;

  public isFavouriteFuelStop: boolean = false;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
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
      name: [null, Validators.required],
      store: [null],
      favourite: [null],
      phone: [null, [Validators.required, phoneRegex]],
      fax: [null],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      note: [null],
    });

    // this.formService.checkFormChange(this.fuelStopForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.fuelStopForm.reset();
        break;
      }
      case 'save': {
        if (this.fuelStopForm.invalid) {
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

  ngOnDestroy(): void {}
}
