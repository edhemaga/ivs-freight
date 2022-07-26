import { HttpResponseBase } from '@angular/common/http';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
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
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  CreateTrailerCommand,
  GetTrailerModalResponse,
  TrailerResponse,
  UpdateTrailerCommand,
  VinDecodeResponse,
} from 'appcoretruckassist';
import {
  insurancePolicyRegex,
  yearValidRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerTService } from '../../trailer/state/trailer.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { VinDecoderService } from 'src/app/core/services/VIN-DECODER/vindecoder.service';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.component.html',
  styleUrls: ['./trailer-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, FormService],
})
export class TrailerModalComponent implements OnInit, OnDestroy {
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

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private trailerModalService: TrailerTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private formService: FormService,
    private vinDecoderService: VinDecoderService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.getTrailerDropdowns();
    this.vinDecoder();

    if (this.editData) {
      this.editTrailerById(this.editData.id);
    }
  }

  private createForm() {
    this.trailerForm = this.formBuilder.group({
      companyOwned: [false],
      trailerNumber: [null, [Validators.required, Validators.maxLength(8)]],
      trailerTypeId: [null, [Validators.required]],
      vin: [
        null,
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
        ],
      ],
      trailerMakeId: [null, [Validators.required]],
      model: [null],
      colorId: [null],
      year: [null, [Validators.required, yearValidRegex]],
      trailerLengthId: [null, [Validators.required]],
      ownerId: [null, Validators.required],
      note: [null],
      axles: [null],
      suspension: [null],
      tireSizeId: [null],
      doorType: [null],
      reeferUnit: [null],
      emptyWeight: [null],
      mileage: [null],
      volume: [null],
      insurancePolicy: [null, insurancePolicyRegex],
    });

    this.formService.checkFormChange(this.trailerForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
      });
  }

  private isCompanyOwned() {
    this.trailerForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
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
    if (data.action === 'close') {
      this.trailerForm.reset();
    } else {
      if (data.action === 'deactivate' && this.editData) {
        this.trailerModalService
          .changeTrailerStatus(this.editData.id, this.editData.tabSelected)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.trailerStatus = !this.trailerStatus;

                this.modalService.changeModalStatus({
                  name: 'deactivate',
                  status: this.trailerStatus,
                });

                this.notificationService.success(
                  `Trailer status changed to ${
                    this.trailerStatus ? 'deactivate' : 'activate'
                  }.`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Truck status can't be changed.",
                'Error:'
              );
            },
          });
      } else {
        // Save & Update
        if (data.action === 'save') {
          if (this.trailerForm.invalid) {
            this.inputService.markInvalid(this.trailerForm);
            return;
          }
          if (this.editData) {
            this.updateTrailer(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          } else {
            this.addTrailer();
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        }

        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteTrailerById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
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

  public openCloseCheckboxCard(event: any) {
    if (this.trailerForm.get('companyOwned').value) {
      event.preventDefault();
      event.stopPropagation();
      this.trailerForm.get('companyOwned').setValue(false);
    }
  }

  private getTrailerDropdowns(): void {
    this.trailerModalService
      .getTrailerDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetTrailerModalResponse) => {
          this.trailerType = res.trailerTypes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trailers',
            };
          });
          this.trailerMakeType = res.trailerMakes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trailermake',
            };
          });

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
            'Error:'
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
        : this.selectedOwner.id,
      axles: this.trailerForm.get('axles').value
        ? parseInt(this.trailerForm.get('axles').value)
        : null,
      suspension: this.selectedSuspension
        ? this.selectedSuspension.value
        : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      doorType: this.selectedDoorType ? this.selectedDoorType.value : null,
      reeferUnit: this.selectedReeferType
        ? this.selectedReeferType.value
        : null,
      emptyWeight: this.trailerForm.get('emptyWeight').value
        ? parseFloat(
            this.trailerForm
              .get('emptyWeight')
              .value.toString()
              .replace(/,/g, '')
          )
        : null,
      mileage: this.trailerForm.get('mileage').value
        ? parseFloat(
            this.trailerForm.get('mileage').value.toString().replace(/,/g, '')
          )
        : null,
      volume: this.trailerForm.get('volume').value
        ? parseFloat(
            this.trailerForm.get('volume').value.toString().replace(/,/g, '')
          )
        : null,
    };

    this.trailerModalService
      .addTrailer(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Trailer successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () =>
          this.notificationService.error("Trailer can't be added.", 'Error:'),
      });
  }

  private deleteTrailerById(id: number): void {
    this.trailerModalService
      .deleteTrailerById(id, this.editData.tabSelected)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Trailer successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () =>
          this.notificationService.error("Trailer can't be deleted.", 'Error:'),
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
        : this.selectedOwner.id,
      axles: this.trailerForm.get('axles').value
        ? parseInt(this.trailerForm.get('axles').value)
        : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      suspension: this.selectedSuspension
        ? this.selectedSuspension.value
        : null,
      doorType: this.selectedDoorType ? this.selectedDoorType.value : null,
      reeferUnit: this.selectedReeferType
        ? this.selectedReeferType.value
        : null,
      emptyWeight: this.trailerForm.get('emptyWeight').value
        ? parseFloat(
            this.trailerForm
              .get('emptyWeight')
              .value.toString()
              .replace(/,/g, '')
          )
        : null,
      mileage: this.trailerForm.get('mileage').value
        ? parseFloat(
            this.trailerForm.get('mileage').value.toString().replace(/,/g, '')
          )
        : null,
      volume: this.trailerForm.get('volume').value
        ? parseFloat(
            this.trailerForm.get('volume').value.toString().replace(/,/g, '')
          )
        : null,
    };

    this.trailerModalService
      .updateTrailer(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Trailer successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () =>
          this.notificationService.error("Trailer can't be updated.", 'Error:'),
      });
  }

  private editTrailerById(id: number): void {
    this.trailerModalService
      .getTrailerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TrailerResponse) => {
          this.trailerForm.patchValue({
            companyOwned: res.companyOwned,
            trailerNumber: res.trailerNumber,
            trailerTypeId: res.trailerType ? res.trailerType.name : null,
            vin: res.vin,
            trailerMakeId: res.trailerMake ? res.trailerMake.name : null,
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
            emptyWeight: res.emptyWeight,
            mileage: res.mileage,
            volume: res.volume,
            insurancePolicy: res.insurancePolicy,
          });
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

          this.modalService.changeModalStatus({
            name: 'deactivate',
            status: res.status === 1 ? false : true,
          });
          this.trailerStatus = res.status === 1 ? false : true;
        },
        error: (err) => {
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
        this.selectedOwner = event;
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
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value?.length === 17) {
          this.vinDecoderService
            .getVINDecoderData(value.toString())
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: VinDecodeResponse) => {
                this.trailerForm.patchValue({
                  model: res?.model ? res.model : null,
                  year: res?.year ? res.year : null,
                  trailerMakeId: res.truckMake?.name
                    ? res.truckMake.name
                    : null,
                });

                this.selectedTrailerMake = res.truckMake;
              },
              error: (error: any) => {
                this.notificationService.error(
                  `Can't get data for that ${value} VIN.`,
                  'Error:'
                );
              },
            });
        } else {
          this.trailerForm.patchValue({
            model: null,
            year: null,
            trailerMakeId: null,
          });
          this.selectedTrailerMake = null;
        }
      });
  }

  ngOnDestroy(): void {}
}
