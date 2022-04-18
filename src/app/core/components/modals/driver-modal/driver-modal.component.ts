import { Component, OnDestroy, OnInit } from '@angular/core';
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
  animations: [tab_modal_animation('animationTabsModal'), card_modal_animation('showHideOwner', '6px')],
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
  ]
  public labelsBank: any[] = [
    {
      id: 1,
      name: 'Bank Of America',
      url: 'assets/svg/common/ic_bankAccount_color_dummy.svg'
    },
    {
      id: 2,
      name: 'Bank Of Serbia',
      url: 'assets/svg/common/ic_bankAccount_color_dummy.svg'
    }
  ]
  public labelsPayType: any[] = [
      {
        id: 1,
        name: 'Per mile',
      },
      {
        id: 2,
        name: 'Commission',
      },
  ]
  public selectedTab = 1;
  public selectedOwnerTab = 1;
  public isOwner: boolean = false;
  public isBankSelected: boolean = false;
  public isIncludePayroll: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.onBankSelected();
    this.onIncludePayroll();
  }

  public onModalAction(action: string) {
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

  public createForm() {
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
      bankId: [null], //number | null;
      account: [null],
      routing: [null],
      payroll: [false],
      payType: [null],
      mailNotification: [true],
      phoneCallNotification: [false],
      smsNotification: [false],
      solo: [null],
      team: [null],
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

  public onIncludePayroll() {
    this.driverForm.get('payroll').valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      if(value) {
        this.isIncludePayroll = true;
        this.driverForm.get('payType').setValidators(Validators.required)
      }
      else {
        this.isIncludePayroll = false;
        this.driverForm.get('payType').reset();
      }
    })
  }

  public onBankSelected() {
    this.driverForm.get('bankId').valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      if(value) {
        this.isBankSelected = true;
        this.driverForm.get('routing').setValidators(Validators.required);
        this.driverForm.get('account').setValidators(Validators.required);
      }
      else {
        this.isBankSelected = false;
        this.driverForm.get('routing').reset();
        this.driverForm.get('account').reset();
      }
    })
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
    console.log(this.selectedTab)
  }

  public tabOwnerChange(event: any[]) {
   this.selectedOwnerTab = event.find(item => item.checked === true).id;
   console.log(this.selectedOwnerTab)
  }

  ngOnDestroy(): void {}
}
