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

  public ownerTabs: any[] = [
    {
      id: 'sole',
      name: 'Sole Proprietor',
      checked: true,
    },
    {
      id: 'company',
      name: 'Company',
      checked: false,
    },
  ];

  public labelsBank: any[] = [
    {
      id: 1,
      name: 'Bank Of America',
      url: 'assets/svg/common/ic_bankAccount_color_dummy.svg',
    },
    {
      id: 2,
      name: 'Bank Of Serbia',
      url: 'assets/svg/common/ic_bankAccount_color_dummy.svg',
    },
  ];

  public labelsPayType: any[] = [
    {
      id: 1,
      name: 'Per mile',
    },
    {
      id: 2,
      name: 'Commission',
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

  public selectedTab: number = 1;
  public selectedOwnerTab: string = 'sole';

  public isOwner: boolean = false;
  public isBankSelected: boolean = false;

  public address: Address = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.onBankSelected();
    this.onIncludePayroll();
    this.onPayTypeSelected();
    this.onTwicTypeSelected();
    this.handleAddress();

    this.inputService.activeItemDropdown$
      .subscribe((value) => {
        console.log(value);
        if (value) {
          this.isBankSelected = true;
          this.inputService.changeValidators(this.driverForm.get('routing'));
          this.inputService.changeValidators(this.driverForm.get('account'));
        }
      });
  }

  public onModalAction(action: string): void {
    if (action === 'close') {
      this.driverForm.reset();
    } else {
      if (this.driverForm.invalid) {
        console.log(this.driverForm.value);
        this.inputService.markInvalid(this.driverForm);

        return;
      }
      this.ngbActiveModal.close();
    }
  }

  public createForm(): void {
    this.driverForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)],
      ],
      email: [null, [Validators.required, Validators.email]],
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
      ein: [null, [Validators.pattern(/^\d{2}\-\d{7}$/)]],
      bussinesName: [null], //TODO:
      address: [null, [Validators.required]],
      addressUnit: [null, [Validators.maxLength(6)]],
      bankId: [null, Validators.required], //number | null;
      account: [null, [Validators.minLength(4), Validators.maxLength(17)]],
      routing: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      payroll: [true],
      payType: [null, Validators.required],
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
    console.log("FORM ARRAY")
    console.log(this.driverForm.get('offDutyLocations') as FormArray)
    return this.driverForm.get('offDutyLocations') as FormArray;
  }

  public createOffDutyLocation(): FormGroup {
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
      streetName: [null]
    })
  }

  public addOffDutyLocation(event: any) {
    if(event) {
      this.offDutyLocations.push(this.createOffDutyLocation())
    }
  }

  public removeOffDutyLocation(id: number) {
    this.offDutyLocations.removeAt(id);
  }

  public onIncludePayroll(): void {
    this.driverForm
      .get('payroll')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(this.driverForm.get('payType'));
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('payType'),
            false
          );
        }
      });
  }

  public onBankSelected(): void {
    this.driverForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.isBankSelected = true;
          this.inputService.changeValidators(this.driverForm.get('routing'));
          this.inputService.changeValidators(this.driverForm.get('account'));
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

  public onPayTypeSelected(): void {
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

  public onTwicTypeSelected(): void {
    this.driverForm
      .get('twic')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        console.log('TWIC');
        console.log(value);
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
      this.inputService.changeValidators(this.driverForm.get('ein'), true);
    } else {
      this.inputService.changeValidators(this.driverForm.get('ein'), false);
    }
  }

  ngOnDestroy(): void {}
}
