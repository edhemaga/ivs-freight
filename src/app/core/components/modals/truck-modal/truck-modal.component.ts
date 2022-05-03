import { Observable } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateTruckCommand,
  GetTruckModalResponse,
  TruckResponse,
  UpdateTruckCommand,
} from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { TruckModalService } from './truck-modal.service';

@Component({
  selector: 'app-truck-modal',
  templateUrl: './truck-modal.component.html',
  styleUrls: ['./truck-modal.component.scss'],
  animations: [
    tab_modal_animation('animationTabsModal'),
    card_modal_animation('showHideCompanyOwned', '20px'),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TruckModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public truckForm: FormGroup;
  public truckType: any[] = [];
  public truckMakeType: any[] = [];
  public colorType: any[] = [];
  public ownerType: any[] = [];
  public grossWeight: any[] = [];
  public engineType: any[] = [];
  public tireSize: any[] = [];

  selectedTruckType: any = null;
  selectedTruckMake: any = null;
  selectedColor: any = null;
  selectedOwner: any = null;
  selectedTruckGrossWeight: any = null;
  selectedEngineType: any = null;
  selectedTireSize: any = null;

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

  public commissionOptions: Options = {
    floor: 2,
    ceil: 25,
    step: 0.5,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public animationObject = {value: this.selectedTab, params: {height: "0px"}}

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private truckModalService: TruckModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.getTruckDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
      };
      this.editTruckById(this.editData.id);
    }
  }

  private createForm(): void {
    this.truckForm = this.formBuilder.group({
      truckNumber: [null, [Validators.required, Validators.maxLength(6)]],
      truckTypeId: [null, Validators.required],
      vin: [
        null,
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
        ],
      ],
      truckMakeId: [null, Validators.required],
      model: [null, [Validators.required, Validators.maxLength(22)]],
      year: [null, [Validators.required, Validators.maxLength(4), Validators.pattern(/^(19[0-9]\d|20[0-4]\d|2100)$/)]],
      colorId: [null],
      companyOwned: [false],
      ownerId: [null],
      commission: [14.5],
      note: [null],
      truckGrossWeightId: [null],
      emptyWeight: [null, Validators.maxLength(6)],
      truckEngineTypeId: [null],
      tireSizeId: [null],
      axles: [null, Validators.maxLength(1)],
      insurancePolicy: [
        null,
        [Validators.minLength(8), Validators.maxLength(14)],
      ],
      mileage: [null, Validators.maxLength(10)],
      ipasEzpass: [null, Validators.maxLength(14)],
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector(".animation-two-tabs");
    this.animationObject = {value: this.selectedTab, params: {height: `${dotAnimation.getClientRects()[0].height}px`}}
  }

  public onModalAction(action: string): void {
    if (action === 'close') {
      this.truckForm.reset();
    } else {
      // Save & Update
      if (action === 'save') {
        if (this.truckForm.invalid) {
          this.inputService.markInvalid(this.truckForm);
          return;
        }
        if (this.editData) {
          this.updateTruck(this.editData.id);
        } else {
          this.addTruck();
        }
      }

      // Delete
      if (action === 'delete' && this.editData) {
        this.deleteTruckById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  private isCompanyOwned() {
    this.truckForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(this.truckForm.get('ownerId'));
        } else {
          this.inputService.changeValidators(
            this.truckForm.get('ownerId'),
            false
          );
        }
      });
  }

  public openCloseCheckboxCard(event: any) {
    if (this.truckForm.get('companyOwned').value) {
      event.preventDefault();
      event.stopPropagation();
      this.truckForm.get('companyOwned').setValue(false);
    }
  }

  public getTruckDropdowns() {
    this.truckModalService
      .getTruckDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetTruckModalResponse) => {
          this.truckType = res.truckTypes;
          this.truckMakeType = res.truckMakes;
          this.colorType = res.colors;
          this.ownerType = res.owners;
          this.grossWeight = res.truckGrossWeights;
          this.engineType = res.truckEngineTypes;
          this.tireSize = res.tireSizes;
        },
        error: (err) => {
          this.notificationService.error(
            "Cant't get truck dropdown items.",
            'Error:'
          );
        },
      });
  }

  public addTruck() {
    const newData: CreateTruckCommand = {
      ...this.truckForm.value,
      truckTypeId: this.selectedTruckType.id,
      truckMakeId: this.selectedTruckMake.id,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      ownerId: this.selectedOwner ? this.selectedOwner.id : null,
      truckGrossWeightId: this.selectedTruckGrossWeight
        ? this.selectedTruckGrossWeight.id
        : null,
      truckEngineTypeId: this.selectedEngineType
        ? this.selectedEngineType.id
        : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      mileage: this.truckForm.get('mileage').value
        ? parseFloat(
            this.truckForm.get('mileage').value.toString().replace(/,/g, '')
          )
        : null,
      axles: this.truckForm.get('axles').value
        ? parseInt(this.truckForm.get('axles').value)
        : null,
      emptyWeight: this.truckForm.get('emptyWeight').value
        ? parseFloat(
            this.truckForm.get('emptyWeight').value.toString().replace(/,/g, '')
          )
        : null,
      commission: this.truckForm.get('commission').value
        ? parseFloat(
            this.truckForm.get('commission').value.toString().replace(/,/g, '')
          )
        : null,
      year: parseInt(this.truckForm.get('year').value),
    };
    this.truckModalService
      .addTruck(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Truck successfully created.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error("Truck can't be created.", 'Error:'),
      });
  }

  public updateTruck(id: number) {
    const newData: UpdateTruckCommand = {
      id: id,
      ...this.truckForm.value,
      truckTypeId: this.selectedTruckType.id,
      truckMakeId: this.selectedTruckMake.id,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      ownerId: this.selectedOwner ? this.selectedOwner.id : null,
      truckGrossWeightId: this.selectedTruckGrossWeight
        ? this.selectedTruckGrossWeight.id
        : null,
      truckEngineTypeId: this.selectedEngineType
        ? this.selectedEngineType.id
        : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      mileage: this.truckForm.get('mileage').value
        ? parseFloat(
            this.truckForm.get('mileage').value.toString().replace(/,/g, '')
          )
        : null,
      axles: this.truckForm.get('axles').value
        ? parseInt(this.truckForm.get('axles').value)
        : null,
      emptyWeight: this.truckForm.get('emptyWeight').value
        ? parseFloat(
            this.truckForm.get('emptyWeight').value.toString().replace(/,/g, '')
          )
        : null,
      commission: this.truckForm.get('commission').value
        ? parseFloat(
            this.truckForm.get('commission').value.toString().replace(/,/g, '')
          )
        : null,
      year: parseInt(this.truckForm.get('year').value),
    };
    this.truckModalService
      .addTruck(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Truck successfully updated.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error("Truck can't be updated.", 'Error:'),
      });
  }

  public deleteTruckById(id: number) {
    this.truckModalService
      .deleteTruckById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Truck successfully deleted.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error("Truck can't be deleted.", 'Error:'),
      });
  }

  public editTruckById(id: number) {
    this.truckModalService
      .getTruckById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TruckResponse) => {
          this.truckForm.patchValue({
            truckNumber: res.truckNumber,
            truckTypeId: res.truckType.name,
            vin: res.vin,
            truckMakeId: res.truckMake.name,
            model: res.model,
            year: res.year,
            colorId: res.color.name,
            companyOwned: res.companyOwned,
            ownerId: res.owner.name, // TODO: PITATI BACK
            commission: res.commission,
            note: res.note,
            truckGrossWeightId: res.truckGrossWeight.name,
            emptyWeight: res.emptyWeight,
            truckEngineTypeId: res.truckEngineType.name,
            tireSizeId: res.tireSize.name,
            axles: res.axles,
            insurancePolicy: res.insurancePolicy,
            mileage: res.mileage,
            ipasEzpass: res.ipasEzpass,
          });
          this.selectedTruckType = res.truckType;
          this.selectedTruckMake = res.truckMake;
          this.selectedColor = res.color;
          this.selectedOwner = res.owner;
          this.selectedTruckGrossWeight = res.truckGrossWeight;
          this.selectedEngineType = res.truckEngineType;
          this.selectedTireSize = res.tireSize;
        },
        error: () => {
          this.notificationService.error("Cant't get truck.", 'Error:');
        },
      });
  }

  public onSelectTruckType(event: any) {
    this.selectedTruckType = event;
  }

  public onSelectTruckMake(event: any) {
    this.selectedTruckMake = event;
  }

  public onSelectColor(event: any) {
    this.selectedColor = event;
  }

  public onSelectOwner(event: any) {
    this.selectedOwner = event;
  }

  public onSelectTruckGrossWeight(event: any) {
    this.selectedTruckGrossWeight = event;
  }

  public onSelectTruckEngineType(event: any) {
    this.selectedEngineType = event;
  }

  public onSelectTireSize(event: any) {
    this.selectedTireSize = event;
  }

  ngOnDestroy(): void {}
}
