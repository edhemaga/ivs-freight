import { HttpResponseBase } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import {
  CreateTrailerCommand,
  GetTrailerModalResponse,
  TrailerResponse,
  UpdateTrailerCommand,
  VinDecodeResponse,
} from 'appcoretruckassist';
import {
  axlesValidation,
  emptyWeightValidation,
  insurancePolicyValidation,
  mileageValidation,
  truckTrailerModelValidation,
  vehicleUnitValidation,
  vinNumberValidation,
  yearValidation,
  yearValidRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerTService } from '../../trailer/state/trailer.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerModalComponent } from '../owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '../repair-modals/repair-order-modal/repair-order-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { VinDecoderService } from '../../../services/VIN-DECODER/vindecoder.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { trailerVolumeValidation } from '../../shared/ta-input/ta-input.regex-validations';
import {
  convertThousanSepInNumber,
  convertNumberInThousandSep,
} from '../../../utils/methods.calculations';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.component.html',
  styleUrls: ['./trailer-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, FormService],
})
export class TrailerModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() editData: any;

  public trailerForm: FormGroup;
  public trailerType: any[] = [];
  public trailerMakeType: any[] = [];
  public colorType: any[] = [];
  public trailerLengthType: any[] = [];
  public ownerType: any[] = [];
  public suspensionType: any[] = [];
  public tireSize: any[] = [];
  public doorType: any[] = [];
  public reeferUnitType: any[] = [];

  public selectedTrailerType: any = null;
  public selectedTrailerMake: any = null;
  public selectedColor: any = null;
  public selectedTrailerLength: any = null;
  public selectedOwner: any = null;
  public selectedSuspension: any = null;
  public selectedTireSize: any = null;
  public selectedDoorType: any = null;
  public selectedReeferType: any = null;

  public selectedTab: number = 1;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
  ];

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public trailerStatus: boolean = true;
  public loadingVinDecoder: boolean = false;
  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private trailerModalService: TrailerTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private ngbActiveModal: NgbActiveModal,
    private formService: FormService,
    private vinDecoderService: VinDecoderService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.getTrailerDropdowns();
    this.vinDecoder();

    if (this.editData?.id) {
      this.editTrailerById(this.editData.id);
    }

    if (this.editData?.storageData) {
      this.populateStorageData(this.editData.storageData);
    }
  }

  private createForm() {
    this.trailerForm = this.formBuilder.group({
      companyOwned: [true],
      trailerNumber: [null, [Validators.required, ...vehicleUnitValidation]],
      trailerTypeId: [null, [Validators.required]],
      vin: [null, [Validators.required, ...vinNumberValidation]],
      trailerMakeId: [null, [Validators.required]],
      model: [null, truckTrailerModelValidation],
      colorId: [null],
      year: [null, [Validators.required, yearValidRegex, ...yearValidation]],
      trailerLengthId: [null, [Validators.required]],
      ownerId: [null],
      note: [null],
      axles: [null, axlesValidation],
      suspension: [null],
      tireSizeId: [null],
      doorType: [null],
      reeferUnit: [null],
      emptyWeight: [null, emptyWeightValidation],
      mileage: [null, mileageValidation],
      volume: [null, trailerVolumeValidation],
      insurancePolicy: [null, insurancePolicyValidation],
    });

    // this.formService.checkFormChange(this.trailerForm);

    // this.formService.formValueChange$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  private isCompanyOwned() {
    this.trailerForm
      .get('companyOwned')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(this.trailerForm.get('ownerId'));
        } else {
          this.inputService.changeValidators(
            this.trailerForm.get('ownerId'),
            false
          );
        }
      });
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    let trailerUnit = this.trailerForm.get('trailerNumber').value;
    if (data.action === 'close') {
      this.trailerForm.reset();
    } else {
      let successMessage = `Trailer "${trailerUnit}" ${
        !this.trailerStatus ? 'Deactivated' : 'Activated'
      } `;
      let errorMessage = `Failed to ${
        !this.trailerStatus ? 'Deactivated' : 'Activated'
      } Trailer "${trailerUnit}" `;

      if (data.action === 'deactivate' && this.editData) {
        this.trailerModalService
          .changeTrailerStatus(this.editData.id, this.editData.tabSelected)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.trailerStatus = !this.trailerStatus;

                this.modalService.changeModalStatus({
                  name: 'deactivate',
                  status: this.trailerStatus,
                });

                this.notificationService.success(successMessage, 'Success');
              }
            },
            error: () => {
              this.notificationService.error(errorMessage, 'Error');
            },
          });
      } else {
        // Save & Update
        if (data.action === 'save') {
          if (this.trailerForm.invalid) {
            this.inputService.markInvalid(this.trailerForm);
            return;
          }
          if (this.editData?.id) {
            this.updateTrailer(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          } else {
            this.addTrailer();
            this.modalService.setModalSpinner({
              action: null,
              status: true,
              clearTimeout: !!this.editData?.canOpenModal,
            });
          }
        }

        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteTrailerById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
      }
    }

    if (this.editData?.canOpenModal) {
      switch (this.editData?.key) {
        case 'repair-modal': {
          this.modalService.setProjectionModal({
            action: 'close',
            payload: { key: this.editData?.key, value: null },
            component: RepairOrderModalComponent,
            size: 'large',
            type: 'Trailer',
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  private getTrailerDropdowns(): void {
    this.trailerModalService
      .getTrailerDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetTrailerModalResponse) => {
          this.trailerType = res.trailerTypes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trailers',
            };
          });

          this.trailerMakeType = res.trailerMakes;

          this.colorType = res.colors.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'colors',
              logoName: 'ic_color.svg',
            };
          });
          this.trailerLengthType = res.trailerLengths;
          this.ownerType = res.owners;
          this.suspensionType = res.suspensions;
          this.tireSize = res.tireSizes;
          this.doorType = res.doorTypes;
          this.reeferUnitType = res.reeferUnits;
        },
        error: () => {
          this.notificationService.error(
            "Cant't get trailer dropdown items.",
            'Error'
          );
        },
      });
  }

  private addTrailer(): void {
    const newData: CreateTrailerCommand = {
      ...this.trailerForm.value,
      trailerTypeId: this.selectedTrailerType.id,
      trailerMakeId: this.selectedTrailerMake.id,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      year: parseInt(this.trailerForm.get('year').value),
      trailerLengthId: this.selectedTrailerLength.id,
      ownerId: this.trailerForm.get('companyOwned').value
        ? null
        : this.selectedOwner
        ? this.selectedOwner.id
        : null,
      axles: this.trailerForm.get('axles').value
        ? parseInt(this.trailerForm.get('axles').value)
        : null,
      suspension: this.selectedSuspension ? this.selectedSuspension.id : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      doorType: this.selectedDoorType ? this.selectedDoorType.id : null,
      reeferUnit: this.selectedReeferType ? this.selectedReeferType.id : null,
      emptyWeight: this.trailerForm.get('emptyWeight').value
        ? convertThousanSepInNumber(this.trailerForm.get('emptyWeight').value)
        : null,
      mileage: this.trailerForm.get('mileage').value
        ? convertThousanSepInNumber(this.trailerForm.get('mileage').value)
        : null,
      volume: this.trailerForm.get('volume').value
        ? convertThousanSepInNumber(this.trailerForm.get('volume').value)
        : null,
    };

    let trailerUnit = this.trailerForm.get('trailerNumber').value;
    this.trailerModalService
      .addTrailer(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Trailer "${trailerUnit} added"`,
            'Success'
          );
        },
        error: () =>
          this.notificationService.error(
            `Failed to add Trailer "${trailerUnit}"`,
            'Error'
          ),
      });
  }

  private deleteTrailerById(id: number): void {
    let trailerUnit = this.trailerForm.get('trailerNumber').value;
    this.trailerModalService
      .deleteTrailerById(id, this.editData.tabSelected)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Trailer "${trailerUnit}" deleted`,
            'Success'
          );
        },
        error: () =>
          this.notificationService.error(
            `Failed to delete Trailer "${trailerUnit}"`,
            'Error'
          ),
      });
  }

  private updateTrailer(id: number): void {
    const newData: UpdateTrailerCommand = {
      id: id,
      ...this.trailerForm.value,
      trailerTypeId: this.selectedTrailerType.id,
      trailerMakeId: this.selectedTrailerMake.id,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      year: parseInt(this.trailerForm.get('year').value),
      trailerLengthId: this.selectedTrailerLength.id,
      ownerId: this.trailerForm.get('companyOwned').value
        ? null
        : this.selectedOwner
        ? this.selectedOwner.id
        : null,
      axles: this.trailerForm.get('axles').value
        ? parseInt(this.trailerForm.get('axles').value)
        : null,
      suspension: this.selectedSuspension
        ? this.selectedSuspension.id != 0
          ? this.selectedSuspension.id
          : null
        : null,
      tireSizeId: this.selectedTireSize
        ? this.selectedTireSize.id != 0
          ? this.selectedTireSize.id
          : null
        : null,
      doorType: this.selectedDoorType
        ? this.selectedDoorType.id != 0
          ? this.selectedDoorType.id
          : null
        : null,
      reeferUnit: this.selectedReeferType
        ? this.selectedReeferType.id != 0
          ? this.selectedReeferType.id
          : null
        : null,
      emptyWeight: this.trailerForm.get('emptyWeight').value
        ? convertThousanSepInNumber(this.trailerForm.get('emptyWeight').value)
        : null,
      mileage: this.trailerForm.get('mileage').value
        ? convertThousanSepInNumber(this.trailerForm.get('mileage').value)
        : null,
      volume: this.trailerForm.get('volume').value
        ? convertThousanSepInNumber(this.trailerForm.get('volume').value)
        : null,
    };

    let trailerUnit = this.trailerForm.get('trailerNumber').value;

    this.trailerModalService
      .updateTrailer(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Changes saved for Trailer "${trailerUnit}"`,
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: true });
        },
        error: () =>
          this.notificationService.error(
            `Failed to save changes for Trailer "${trailerUnit}"`,
            'Error'
          ),
      });
  }

  private populateStorageData(res) {
    const timeout = setTimeout(() => {
      this.trailerForm.patchValue({
        companyOwned: res.companyOwned,
        trailerNumber: res.trailerNumber,
        trailerTypeId: res.trailerTypeId,
        trailerMakeId: ' ',
        model: res.model,
        colorId: res.colorId,
        year: res.year,
        trailerLengthId: res.trailerLengthId,
        ownerId: res.ownerId,
        note: res.note,
        axles: res.axles,
        suspension: res.suspension,
        tireSizeId: res.tireSizeId,
        doorType: res.doorType,
        reeferUnit: res.reeferUnit,
        emptyWeight: res.emptyWeight,
        mileage: res.mileage,
        volume: res.volume,
        insurancePolicy: res.insurancePolicy,
      });

      if (res.id) {
        this.editData = { ...this.editData, id: res.id };
      }

      this.trailerForm.get('vin').patchValue(res.vin, { emitEvent: false });

      this.selectedTrailerType = res.selectedTrailerType;
      this.selectedTrailerMake = res.selectedTrailerMake;
      this.selectedColor = res.selectedColor;
      this.selectedTrailerLength = res.selectedTrailerLength;
      this.selectedOwner = res.selectedOwner;
      this.selectedSuspension = res.selectedSuspension;
      this.selectedTireSize = res.selectedTireSize;
      this.selectedDoorType = res.selectedDoorType;
      this.selectedReeferType = res.selectedReeferType;
      this.trailerStatus = res.trailerStatus;

      this.modalService.changeModalStatus({
        name: 'deactivate',
        status: this.trailerStatus,
      });
      clearTimeout(timeout);
    }, 50);
  }

  private editTrailerById(id: number): void {
    this.trailerModalService
      .getTrailerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TrailerResponse) => {
          this.trailerForm.patchValue({
            companyOwned: res.companyOwned,
            trailerNumber: res.trailerNumber,
            trailerTypeId: res.trailerType ? res.trailerType.name : null,
            trailerMakeId: res.trailerMake ? ' ' : null,
            model: res.model,
            colorId: res.color ? res.color.name : null,
            year: res.year,
            trailerLengthId: res.trailerLength ? res.trailerLength.name : null,
            ownerId: res.companyOwned
              ? null
              : res.owner
              ? res.owner.name
              : null,
            note: res.note,
            axles: res.axles,
            suspension: res.suspension ? res.suspension.name : null,
            tireSizeId: res.tireSize ? res.tireSize.name : null,
            doorType: res.doorType ? res.doorType.name : null,
            reeferUnit: res.reeferUnit ? res.reeferUnit.name : null,
            emptyWeight: res.emptyWeight
              ? convertNumberInThousandSep(res.emptyWeight)
              : null,
            mileage: res.mileage
              ? convertNumberInThousandSep(res.mileage)
              : null,
            volume: res.volume ? convertNumberInThousandSep(res.volume) : null,
            insurancePolicy: res.insurancePolicy,
          });

          this.trailerForm.get('vin').patchValue(res.vin, { emitEvent: false });

          this.selectedTrailerType = res.trailerType ? res.trailerType : null;
          this.selectedTrailerMake = res.trailerMake ? res.trailerMake : null;
          this.selectedColor = res.color ? res.color : null;
          this.selectedTrailerLength = res.trailerLength
            ? res.trailerLength
            : null;
          this.selectedOwner = res.owner ? res.owner : null;
          this.selectedSuspension = res.suspension ? res.suspension.name : null;
          this.selectedTireSize = res.tireSize ? res.tireSize : null;
          this.selectedDoorType = res.doorType ? res.doorType : null;
          this.selectedReeferType = res.reeferUnit ? res.reeferUnit : null;
          this.trailerStatus = res.status !== 1;

          this.modalService.changeModalStatus({
            name: 'deactivate',
            status: this.trailerStatus,
          });
        },
        error: () => {
          this.notificationService.error("Cant't get trailer.", 'Error:');
        },
      });
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'trailer-type': {
        this.selectedTrailerType = event;
        break;
      }
      case 'trailer-make': {
        this.selectedTrailerMake = event;
        break;
      }
      case 'color': {
        this.selectedColor = event;
        break;
      }
      case 'trailer-length': {
        this.selectedTrailerLength = event;
        break;
      }
      case 'owner': {
        if (event?.canOpenModal) {
          this.ngbActiveModal.close();

          this.modalService.setProjectionModal({
            action: 'open',
            payload: {
              key: 'trailer-modal',
              value: {
                ...this.trailerForm.value,
                selectedTrailerType: this.selectedTrailerType,
                selectedTrailerMake: this.selectedTrailerMake,
                selectedColor: this.selectedColor,
                selectedTrailerLength: this.selectedTrailerLength,
                selectedOwner: this.selectedOwner,
                id: this.editData?.id,
                selectedSuspension: this.selectedSuspension,
                selectedTireSize: this.selectedTireSize,
                selectedDoorType: this.selectedDoorType,
                selectedReeferType: this.selectedReeferType,
                trailerStatus: this.trailerStatus,
              },
            },
            component: OwnerModalComponent,
            size: 'small',
          });
        } else {
          this.selectedOwner = event;
        }
        break;
      }
      case 'reefer-unit': {
        this.selectedReeferType = event;
        break;
      }
      case 'suspension': {
        this.selectedSuspension = event;
        break;
      }
      case 'tire-size': {
        this.selectedTireSize = event;
        break;
      }
      case 'door-type': {
        this.selectedDoorType = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private vinDecoder() {
    this.trailerForm
      .get('vin')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value?.length > 13 && value?.length < 17) {
          this.trailerForm.get('vin').setErrors({ invalid: true });
        }
        if (value?.length === 17) {
          this.loadingVinDecoder = true;
          this.vinDecoderService
            .getVINDecoderData(value.toString(), 2)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: VinDecodeResponse) => {
                this.trailerForm.patchValue({
                  model: res?.model ? res.model : null,
                  year: res?.year ? res.year : null,
                  trailerMakeId: res.trailerMake?.name ? ' ' : null,
                });
                this.loadingVinDecoder = false;
                this.selectedTrailerMake = res.trailerMake;
              },
              error: () => {
                this.notificationService.error(
                  `Can't get data for that ${value} VIN.`,
                  'Error:'
                );
              },
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
