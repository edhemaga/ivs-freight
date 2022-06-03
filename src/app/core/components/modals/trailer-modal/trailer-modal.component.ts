import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TrailerModalService } from './trailer-modal.service';
import {
  CreateTrailerCommand,
  GetTrailerModalResponse,
  TrailerResponse,
  UpdateTrailerCommand,
} from 'appcoretruckassist';
import {
  insurancePolicyRegex,
  yearValidRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.component.html',
  styleUrls: ['./trailer-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private trailerModalService: TrailerModalService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.getTrailerDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
      };
      this.editTrailerById(this.editData.id);
    }
  }

  private createForm() {
    this.trailerForm = this.formBuilder.group({
      companyOwned: [false],
      trailerNumber: [null, [Validators.required, Validators.maxLength(8)]],
      trailerTypeId: [null, [Validators.required]],
      vin: [null, [Validators.required]],
      trailerMakeId: [null, [Validators.required]],
      model: [null, [Validators.required]],
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
          .changeTrailerStatus(this.editData.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              console.log(res);
              if (res.status === '200' || res.status === '204') {
                this.modalService.changeModalStatus({
                  name: 'deactivate',
                  status: null,
                });
              }
            },
            error: () => {
              this.notificationService.error(
                "Driver status can't be changed.",
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
          } else {
            this.addTrailer();
          }
        }

        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteTrailerById(this.editData.id);
        }

        this.ngbActiveModal.close();
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
          this.trailerMakeType = res.trailerMakes.map(item => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trailermake',
            }
          });
          console.log(this.trailerMakeType);
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
        next: () =>
          this.notificationService.success(
            'Trailer successfully added.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error("Trailer can't be added.", 'Error:'),
      });
  }

  private deleteTrailerById(id: number): void {
    this.trailerModalService
      .deleteTrailerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Trailer successfully deleted.',
            'Success:'
          ),
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
        next: () =>
          this.notificationService.success(
            'Trailer successfully updated.',
            'Success:'
          ),
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
            ownerId: res.owner ? res.owner.name : null,
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
          this.selectedTrailerType = res.trailerType.name
            ? res.trailerType
            : null;
          this.selectedTrailerMake = res.trailerMake.name
            ? res.trailerMake
            : null;
          this.selectedColor = res.color.name ? res.color : null;
          this.selectedTrailerLength = res.trailerLength.name
            ? res.trailerLength
            : null;
          this.selectedOwner = res.owner.name ? res.owner : null;
          this.selectedSuspension = res.suspension.name ? res.suspension : null;
          this.selectedTireSize = res.tireSize.name ? res.tireSize : null;
          this.selectedDoorType = res.doorType.name ? res.doorType : null;
          this.selectedReeferType = res.reeferUnit.name ? res.reeferUnit : null;

          this.modalService.changeModalStatus({
            name: 'deactivate',
            status: res.status === 0 ? false : true,
          });
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

  ngOnDestroy(): void {}
}
