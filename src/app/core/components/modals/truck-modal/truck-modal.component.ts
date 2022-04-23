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
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MockModalService } from 'src/app/core/services/mockmodal.service';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.truckType = this.mockModalService.truckType;
    this.truckMakeType = this.mockModalService.truckMakeType;
    this.colorType = this.mockModalService.colorType;
    this.ownerType = this.mockModalService.ownerType;
    this.grossWeight = this.mockModalService.grossWeight;
    this.engineType = this.mockModalService.engineType;
    this.tireSize = this.mockModalService.tireSize;
  }

  public createForm(): void {
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
      year: [null, Validators.required, Validators.maxLength(4)],
      colorId: [null],
      companyOwned: [false],
      ownerId: [null],
      commission: [14.5],
      note: [null],
      truckGrossWeightId: [null],
      emptyWeight: [null, Validators.maxLength(6)],
      truckEngineTypeId: [null],
      tireSizeId: [null],
      axles: [null],
      insurancePolicy: [null],
      mileage: [null, Validators.maxLength(8)],
      ipasEzpass: [null, Validators.maxLength(14)],
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
  }

  public onModalAction(action: string): void {
    if (action === 'close') {
      this.truckForm.reset();
    } else {
      if (this.truckForm.invalid) {
        console.log(this.truckForm.value);
        this.inputService.markInvalid(this.truckForm);
        return;
      }
      this.ngbActiveModal.close();
    }
  }

  public isCompanyOwned() {
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

  ngOnDestroy(): void {}
}
