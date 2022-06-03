import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';

@Component({
  selector: 'app-fuel-stop-modal',
  templateUrl: './fuel-stop-modal.component.html',
  styleUrls: ['./fuel-stop-modal.component.scss'],
})
export class FuelStopModalComponent implements OnInit {
  @Input() editData: any;

  public fuelStopForm: FormGroup;

  public fuelStops: any[] = [];

  public selectedFuelStop: any = null;
  public selectedAddress: AddressEntity | AddressEntity;

  public isFavouriteFuelStop: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
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
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.fuelStopForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.fuelStopForm.invalid) {
          this.inputService.markInvalid(this.fuelStopForm);
          return;
        }
        if (this.editData) {
          this.updateFuelStop(this.editData.id);
        } else {
          this.addFuelStop();
        }
      }
      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteFuelStopById(this.editData.id);
      }

      this.ngbActiveModal.close();
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
    this.selectedAddress = event.address;
    if (!event.valid) {
      this.fuelStopForm.get('addres').setErrors({ invalid: true });
    }
  }

  private updateFuelStop(id: number) {}
  private addFuelStop() {}
  private deleteFuelStopById(id: number) {}
  private editFuelStop(id: number) {}

  ngOnDestroy(): void {}
}
