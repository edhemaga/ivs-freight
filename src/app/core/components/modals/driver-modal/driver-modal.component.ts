import { FormArray } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs';
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
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';
import { MockModalService } from 'src/app/core/services/mockmodal.service';
@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss'],
  animations: [
    tab_modal_animation('animationTabsModal'),
    card_modal_animation('showHideOwner', '6px'),
    card_modal_animation('showHidePayroll', '6px'),
    card_modal_animation('showHidePerMile', '32px'),
    card_modal_animation('showHideCommission', '24px'),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DriverModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public driverForm: FormGroup;
  public ownerTabs: any[] = [];
  public labelsBank: any[] = [];
  public labelsPayType: any[] = [];

  public selectedTab: number = 1;
  public selectedOwnerTab: string = 'sole';

  public isOwner: boolean = false;
  public isBankSelected: boolean = false;

  public address: Address = null;

  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Pay',
    },
    {
      id: 3,
      name: 'Additional',
    },
  ];

  public soloSliderOptions: Options = {
    floor: 10,
    ceil: 50,
    step: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public teamSliderOptions: Options = {
    floor: 10,
    ceil: 50,
    step: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.onBankSelected();
    this.onIncludePayroll();
    this.onPayTypeSelected();
    this.onTwicTypeSelected();
    this.handleAddress();

    this.ownerTabs = this.mockModalService.ownerTabs;
    this.labelsBank = this.mockModalService.labelsBank;
    this.labelsPayType = this.mockModalService.labelsPayType;
  }

  public onModalAction(action: string): void {
    if (action === 'close') {
      this.driverForm.reset();
    } else {
      if (this.driverForm.invalid) {
        this.inputService.markInvalid(this.driverForm);
        return;
      }
      this.ngbActiveModal.close();
    }
  }

  private createForm(): void {
    this.driverForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)],
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      ssn: [
        null,
        [Validators.required, Validators.pattern(/^\d{3}\-\d{2}\-\d{4}$/)],
      ],
      note: [null],
      dateOfBirth: [null, [Validators.required]],
      offDutyLocations: this.formBuilder.array([]),
      isOwner: [false],
      ownerId: [null], //number | null; TODO:
      ownerType: [null], //OwnerType; TODO:
      ein: [null],
      bussinesName: [null], //TODO:
      address: [null, [Validators.required]],
      addressUnit: [null, [Validators.maxLength(6)]],
      bankId: [null],
      account: [null],
      routing: [null],
      payroll: [false],
      payType: [null],
      mailNotification: [true],
      phoneCallNotification: [false],
      smsNotification: [false],
      soloEmptyMile: [null],
      soloLoadedMile: [null],
      soloPerStop: [null],
      teamEmptyMile: [null],
      teamLoadedMile: [null],
      teamPerStop: [null],
      commissionSolo: [25],
      commissionTeam: [25],
      twic: [false],
      twicExpDate: [null],
      fuelCard: [null],
      emergencyContactName: [null],
      emergencyContactPhone: [null],
      emergencyContactRelationship: [null],
    });
  }

  public get offDutyLocations(): FormArray {
    return this.driverForm.get('offDutyLocations') as FormArray;
  }

  private createOffDutyLocation(): FormGroup {
    return this.formBuilder.group({
      nickname: [null],
      address: [null],
      city: [null],
      state: [null],
      stateShortName: [null],
      country: [null],
      zipCode: [null],
      addressUnit: [null],
      streetNumber: [null],
      streetName: [null],
    });
  }

  public addOffDutyLocation(event: any) {
    if (event) {
      this.offDutyLocations.push(this.createOffDutyLocation());
    }
  }

  public removeOffDutyLocation(id: number) {
    this.offDutyLocations.removeAt(id);
  }

  private onIncludePayroll(): void {
    this.driverForm
      .get('payroll')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.driverForm.get('payType'),
            true,
            [Validators.required]
          );
          this.inputService.changeValidators(
            this.driverForm.get('bankId'),
            true,
            [Validators.required]
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('payType'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('bankId'),
            false
          );
        }
      });
  }

  private onBankSelected(): void {
    this.driverForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.isBankSelected = true;
          this.inputService.changeValidators(
            this.driverForm.get('routing'),
            true,
            [Validators.minLength(9), Validators.maxLength(9)]
          );
          this.inputService.changeValidators(
            this.driverForm.get('account'),
            true,
            [Validators.minLength(4), Validators.maxLength(17)]
          );
        } else {
          this.isBankSelected = false;
          this.inputService.changeValidators(
            this.driverForm.get('routing'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('account'),
            false
          );
        }
      });
  }

  private onPayTypeSelected(): void {
    this.driverForm
      .get('payType')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value?.toLowerCase() === 'per mile') {
          this.inputService.changeValidators(
            this.driverForm.get('soloEmptyMile')
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloLoadedMile')
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('soloEmptyMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloLoadedMile'),
            false
          );
        }
      });
  }

  private onTwicTypeSelected(): void {
    this.driverForm
      .get('twic')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.driverForm.get('twicExpDate')
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('twicExpDate'),
            false
          );
        }
      });
  }

  public handleAddress(): void {
    this.inputService.getGoogleAddress$
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.address = value;
      });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
  }

  public tabOwnerChange(event: any[]): void {
    this.selectedOwnerTab = event.find((item) => item.checked === true).id;

    if (
      this.driverForm.get('isOwner').value &&
      this.selectedOwnerTab === 'company'
    ) {
      this.inputService.changeValidators(this.driverForm.get('ein'), true, [
        Validators.pattern(/^\d{2}\-\d{7}$/),
      ]);
    } else {
      this.inputService.changeValidators(this.driverForm.get('ein'), false);
    }
  }

  ngOnDestroy(): void {}
}
