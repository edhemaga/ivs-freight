import {
  businessNameValidation,
  fuelStopValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  addressValidation,
  phoneFaxRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity, UpdateFuelStopCommand } from 'appcoretruckassist';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { fuelStoreValidation } from '../../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../../services/form/form.service';
import { FuelTService } from '../../../fuel/state/fuel.service';
import { GetFuelStopModalResponse } from '../../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { NotificationService } from '../../../../services/notification/notification.service';
import { FuelStopResponse } from '../../../../../../../appcoretruckassist/model/fuelStopResponse';
import { AddFuelStopCommand } from '../../../../../../../appcoretruckassist/model/addFuelStopCommand';

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

  public fuelStopName: string = null;

  public companyId: number = null;

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
    if (this.editData?.type === 'edit') {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
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

        event
          ? this.fuelStopForm.get('store').setValidators(Validators.required)
          : this.fuelStopForm.get('store').clearValidators();

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
    this.fuelStopForm.get('fuelStopFranchiseId').patchValue(null);
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

  private updateFuelStop(id: number) {
    const { address, addressUnit, businessName, ...form } =
      this.fuelStopForm.value;

    const newData: UpdateFuelStopCommand = {
      id: id,
      ...form,
      address: this.selectedAddress,
      businessName: !this.selectedFuelStop ? businessName : null,
      fuelStopFranchiseId: this.selectedFuelStop
        ? this.selectedFuelStop.id
        : null,
    };

    this.fuelService
      .updateFuelStop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Success',
            'Successfully fuel stop updated.'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: (error: any) => {
          this.notificationService.error('Error', error);
        },
      });
  }

  private addFuelStop() {
    const { address, addressUnit, businessName, ...form } =
      this.fuelStopForm.value;

    const newData: AddFuelStopCommand = {
      ...form,
      address: this.selectedAddress,
      businessName: !this.selectedFuelStop ? businessName : null,
      fuelStopFranchiseId: this.selectedFuelStop
        ? this.selectedFuelStop.id
        : null,
    };

    this.fuelService
      .addFuelStop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Success',
            'Successfully fuel stop added.'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: (error: any) => {
          console.log(error);
          this.notificationService.error('Error', error);
          this.fuelStopForm.get('store').setErrors({ fuelStoreNumber: true });

          this.fuelStopForm
            .get('phone')
            .setErrors({ fuelStoreCommonMessage: true });

          this.fuelStopForm
            .get('address')
            .setErrors({ fuelStoreCommonMessage: true });
        },
      });
  }

  private getFuelStopById(id: number) {
    this.fuelService
      .getFuelStopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: FuelStopResponse) => {
          console.log('get by id: ', res);
          this.fuelStopForm.patchValue({
            businessName: res.businessName,
            fuelStopFranchiseId: res.fuelStopFranchise
              ? res.fuelStopFranchise.businessName
              : null,
            store: res.store,
            favourite: res.fuelStopExtensions[0].favourite,
            phone: res.phone,
            fax: res.fax,
            address: res.address.address,
            note: res.fuelStopExtensions[0].note,
          });

          this.companyId = res.companyId;

          this.selectedFuelStop = res.fuelStopFranchise;
          this.selectedAddress = res.address;

          this.fuelStopName = res.fuelStopFranchise
            ? res.fuelStopFranchise.businessName
            : res.businessName;

          if (!res.fuelStopFranchise) {
            this.fuelStopForm.get('fuelStopFranchiseId').clearValidators();
            this.fuelStopForm
              .get('fuelStopFranchiseId')
              .updateValueAndValidity();
            this.fuelStopForm
              .get('businessName')
              .setValidators(Validators.required);
          }
        },
        error: (error: any) => {
          this.notificationService.error('Error', error);
        },
      });
  }

  public paginationPage(pageIndex: number) {
    this.getModalDropdowns(pageIndex, 25);
  }

  private getModalDropdowns(pageIndex: number = 1, pageSize: number = 25) {
    this.fuelService
      .getFuelStopModalDropdowns(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetFuelStopModalResponse) => {
          this.fuelStops = [
            ...this.fuelStops,
            ...res.pagination.data.map((item) => {
              return {
                id: item.id,
                name: item.businessName,
                count: item.count,
              };
            }),
          ];
          this.fuelStops = this.fuelStops.filter(
            (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
          );
          console.log(this.fuelStops);
        },
        error: (error: any) => {
          this.notificationService.error('Error', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
