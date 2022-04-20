import { Options } from '@angular-slider/ngx-slider';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
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
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      ssn: [null, [Validators.required]],
      note: [null],
      dateOfBirth: [null, [Validators.required]],
      offDutyLocations: [null], //Array<CreateOffDutyLocationCommand> | null;
      isOwner: [false],
      ownerId: [null], //number | null;
      ownerType: [null], //OwnerType;
      ein: [null],
      bussinesName: [null],
      city: [null],
      state: [null],
      address: [null, [Validators.required]],
      country: [null],
      zipCode: [null],
      stateShortName: [null],
      addressUnit: [null],
      bankId: [null, Validators.required], //number | null;
      account: [null],
      routing: [null],
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

  public onIncludePayroll(): void {
    this.driverForm
      .get('payroll')
      .valueChanges.pipe(untilDestroyed(this))
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
      .valueChanges.pipe(untilDestroyed(this))
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
        .valueChanges.pipe(untilDestroyed(this))
        .subscribe((value) => {
          if(value?.toLowerCase() === 'per mile') {
            this.inputService.changeValidators(this.driverForm.get('soloEmptyMile'));
            this.inputService.changeValidators(this.driverForm.get('soloLoadedMile'));
          }
          else {
            this.inputService.changeValidators(this.driverForm.get('soloEmptyMile'), false);
            this.inputService.changeValidators(this.driverForm.get('soloLoadedMile'), false);
          }
        })
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
      this.driverForm.get('ein').setValidators([Validators.required]);
    } else {
      this.driverForm.get('ein').clearValidators();
    }

    this.driverForm.get('ein').updateValueAndValidity();
  }

  ngOnDestroy(): void {}
}
