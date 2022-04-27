import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MockModalService } from 'src/app/core/services/mockmodal.service';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService
  ) {}
  

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    
    this.trailerType = this.mockModalService.trailerType;
    this.trailerMakeType = this.mockModalService.trailerMakeType;
    this.colorType = this.mockModalService.colorType;
    this.trailerLengthType = this.mockModalService.trailerLengthType;
    this.ownerType = this.mockModalService.ownerType;
    this.suspensionType = this.mockModalService.suspensionType;
    this.tireSize = this.mockModalService.tireSize;
    this.doorType = this.mockModalService.doorType;
    this.reeferUnitType = this.mockModalService.reeferUnitType;
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
      year: [null, [Validators.required]],
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
      insurancePolicy: [null, [Validators.minLength(8), Validators.maxLength(14)]],
    });
  }

  private isCompanyOwned() {
    this.trailerForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
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
      if (this.trailerForm.invalid) {
        console.log(this.trailerForm.value);
        this.inputService.markInvalid(this.trailerForm);
        return;
      }

      this.ngbActiveModal.close();
    }
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
  }

  ngOnDestroy(): void {}
}
