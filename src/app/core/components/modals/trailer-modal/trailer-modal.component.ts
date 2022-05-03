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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TrailerModalService } from './trailer-modal.service';
import {
  CreateTrailerCommand,
  GetTrailerModalResponse,
  TrailerResponse,
  UpdateTrailerCommand,
} from 'appcoretruckassist';
import { throws } from 'assert';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.component.html',
  animations: [
    tab_modal_animation('animationTabsModal'),
    card_modal_animation('showHideCompanyOwned', '20px'),
  ],
  styleUrls: ['./trailer-modal.component.scss'],
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

  public animationObject = {value: this.selectedTab, params: {height: "0px"}}

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private trailerModalService: TrailerModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.getTrailerDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 5,
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
      year: [null, [Validators.required, Validators.pattern(/^(19[0-9]\d|20[0-4]\d|2100)$/)]],
      trailerLengthId: [null, [Validators.required]],
      ownerId: [null],
      note: [null],
      axles: [null],
      suspension: [null],
      tireSizeId: [null],
      doorType: [null],
      reeferUnit: [null],
      emptyWeight: [null],
      mileage: [null],
      volume: [null],
      insurancePolicy: [
        null,
        [Validators.minLength(8), Validators.maxLength(14)],
      ],
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

  public onModalAction(action: string): void {
    if (action === 'close') {
      this.trailerForm.reset();
    } else {
      // Save & Update
      if (action === 'save') {
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
      if (action === 'delete' && this.editData) {
        this.deleteTrailerById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector(".animation-two-tabs");
    this.animationObject = {value: this.selectedTab, params: {height: `${dotAnimation.getClientRects()[0].height}px`}}
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
          this.trailerType = res.trailerTypes;
          this.trailerMakeType = res.trailerMakes;
          this.colorType = res.colors;
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
       ownerId: this.trailerForm.get('companyOwned').value ? null : this.selectedOwner.id,
       axles: this.trailerForm.get('axles').value ? parseInt(this.trailerForm.get('axles').value) : null,
       tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,

       suspension: this.selectedSuspension ? this.selectedSuspension.value : null,
       doorType: this.selectedDoorType ? this.selectedDoorType.value : null,
       reeferUnit: this.selectedReeferType ? this.selectedReeferType.value : null,
       emptyWeight: this.trailerForm.get('emptyWeight').value
        ? parseFloat(
            this.trailerForm.get('emptyWeight').value.toString().replace(/,/g, '')
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
        })
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
      ownerId: this.trailerForm.get('companyOwned').value ? null : this.selectedOwner.id,
      axles: this.trailerForm.get('axles').value ? parseInt(this.trailerForm.get('axles').value) : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,

      suspension: this.selectedSuspension ? this.selectedSuspension.value : null,
      doorType: this.selectedDoorType ? this.selectedDoorType.value : null,
      reeferUnit: this.selectedReeferType ? this.selectedReeferType.value : null,
      emptyWeight: this.trailerForm.get('emptyWeight').value
       ? parseFloat(
           this.trailerForm.get('emptyWeight').value.toString().replace(/,/g, '')
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
            trailerTypeId: res.trailerType.name,
            vin: res.vin,
            trailerMakeId: res.trailerMake.name,
            model: res.model,
            colorId: res.color.name,
            year: res.year,
            trailerLengthId: res.trailerLength.name,
            ownerId: res.owner.name,
            note: res.note,
            axles: res.axles,
            suspension: res.suspension.name,
            tireSizeId: res.tireSize.name,
            doorType: res.doorType.name,
            reeferUnit: res.reeferUnit.name,
            emptyWeight: res.emptyWeight,
            mileage: res.mileage,
            volume: res.volume,
            insurancePolicy: res.insurancePolicy,
          });
          this.selectedTrailerType = res.trailerType;
          this.selectedTrailerMake = res.trailerMake;
          this.selectedColor = res.color;
          this.selectedTrailerLength = res.trailerLength;
          this.selectedOwner = res.owner;
          this.selectedSuspension = res.suspension;
          this.selectedTireSize = res.tireSize;
          this.selectedDoorType = res.doorType;
          this.selectedReeferType = res.reeferUnit;
        },
        error: (err) => {
          this.notificationService.error("Cant't get trailer.", 'Error:');
        },
      });
  }

  public onSelectTruckType(event: any) {
    this.selectedTrailerType = event;
  }

  public onSelectTruckMake(event: any) {
    this.selectedTrailerMake = event;
  }

  public onSelectColor(event: any) {
    this.selectedColor = event;
  }

  public onSelectTrailerLength(event: any) {
    this.selectedTrailerLength = event;
  }

  public onSelectOwner(event: any) {
    this.selectedOwner = event;
  }

  public onSelectReeferUnit(event: any) {
    this.selectedReeferType = event;
  }

  public onSelectSuspension(event: any) {
    this.selectedSuspension = event;
  }

  public onSelectTireSize(event: any) {
    this.selectedTireSize = event;
  }

  public onSelectDoorType(event: any) {
    this.selectedDoorType = event;
  }

  ngOnDestroy(): void {}
}
