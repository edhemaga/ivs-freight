import { FormArray } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
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
import { DriverModalService } from './driver-modal.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  CreateDriverCommand,
  DriverResponse,
  GetDriverModalResponse,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import moment from 'moment';
@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss'],
  animations: [
    tab_modal_animation('animationTabsModal'),
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

  public isOwner: boolean = false;
  public isBankSelected: boolean = false;

  public selectedTab: number = 1;
  public selectedOwnerTab: any = null;
  public selectedAddress: Address = null;
  public selectedBank: any = null;
  public selectedPayType: any = null;

  public driverFullName: string = null;

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

  public animationObject = {value: this.selectedTab, params: {height: "0px"}}

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService,
    private driverModalService: DriverModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.onBankSelected();
    this.onIncludePayroll();
    this.onPayTypeSelected();
    this.onTwicTypeSelected();
    this.getDriverDropdowns();
    this.ownerTabs = this.mockModalService.ownerTabs;

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      /* this.editData = {
        ...this.editData,
        id: 4,
      }; */
      this.editDriverById(this.editData.id);
    }
  }

  public onModalAction(action: string): void {
    if (action === 'close') {
      this.driverForm.reset();
    } else {
      // Save & Update
      if (action === 'save') {
        if (this.driverForm.invalid) {
          this.inputService.markInvalid(this.driverForm);
          return;
        }
        if (this.editData) {
          this.updateDriver(this.editData.id);
        } else {
          this.addDriver();
        }
      }

      // Delete
      if (action === 'delete' && this.editData) {
        this.deleteDriverById(this.editData.id);
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
      ownerId: [null],
      ownerType: ['Sole Proprietor'],
      ein: [null],
      bussinesName: [null],
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
      // TODO: WAIT BACKEND
      // streetNumber: [null],
      // streetName: [null],
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
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('payType'),
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

  public onHandleAddress(event: any): void {
    this.selectedAddress = event;
  }

  public onHandleAddressFormArray(event: any, index: number) {
    const address: Address = event;
    console.log(address);
    this.offDutyLocations.at(index).patchValue({
      address: address.address,
      city: address.city,
      state: address.state,
      stateShortName: address.stateShortName,
      country: address.country,
      zipCode: address.zipCode,
      addressUnit: address.addressUnit,
      // streetNumber: address,
      // streetName: address,
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector(".animation-three-tabs");
    this.animationObject = {value: this.selectedTab, params: {height: `${dotAnimation.getClientRects()[0].height}px`}}
  }

  public tabOwnerChange(event: any[]): void {
    this.selectedOwnerTab = event.find((item) => item.checked === true);
    this.driverForm.get('ownerType').patchValue(this.selectedOwnerTab.name);
    if (
      this.driverForm.get('isOwner').value &&
      this.selectedOwnerTab?.name === 'company'
    ) {
      this.inputService.changeValidators(this.driverForm.get('ein'), true, [
        Validators.pattern(/^\d{2}\-\d{7}$/),
      ]);
    } else {
      this.inputService.changeValidators(this.driverForm.get('ein'), false);
    }
  }

  public openCloseCheckboxCard(event: any) {
    if (this.driverForm.get('ownerId').value) {
      event.preventDefault();
      event.stopPropagation();
      this.driverForm.get('ownerId').setValue(false);
    }
  }

  private getDriverDropdowns(): void {
    this.driverModalService
      .getDriverDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: GetDriverModalResponse) => {
          this.labelsBank = data.banks;
          this.labelsPayType = data.payTypes;
        },
        error: (err) => {
          this.notificationService.error(
            "Truck's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  private addDriver(): void {
    const {
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,
      ...form
    } = this.driverForm.value;

    const newData: CreateDriverCommand = {
      ...form,
      dateOfBirth: new Date(
        this.driverForm.get('dateOfBirth').value
      ).toISOString(),
      ownerId: 1, // TODO: BACKEND TREBA DA DOSTAVI
      city: this.selectedAddress.city,
      state: this.selectedAddress.state,
      address: this.selectedAddress.address,
      country: this.selectedAddress.country,
      zipCode: this.selectedAddress.zipCode,
      stateShortName: this.selectedAddress.stateShortName,
      bankId: this.selectedBank ? this.selectedBank.id : null,
      payType: this.selectedPayType ? this.selectedPayType.value : null,
      solo: {
        emptyMile: soloEmptyMile,
        loadedMile: soloLoadedMile,
        perStop: soloPerStop,
      },
      team: {
        emptyMile: teamEmptyMile,
        loadedMile: teamLoadedMile,
        perStop: teamPerStop,
      },
      commissionSolo: parseInt(this.driverForm.get('commissionSolo').value),
      commissionTeam: parseInt(this.driverForm.get('commissionTeam').value),
      twicExpDate: new Date(
        this.driverForm.get('twicExpDate').value
      ).toISOString(),
    };

    this.driverModalService
      .addDriver(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () =>
          this.notificationService.success(
            'Truck successfully added.',
            'Success:'
          ),
        error: () =>
          this.notificationService.error("Truck can't be added.", 'Error:'),
      });
  }

  private updateDriver(id: number): void {
    const {
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,
      ...form
    } = this.driverForm.value;

    const newData: UpdateDriverCommand = {
      id: id,
      ...form,
      dateOfBirth: new Date(
        this.driverForm.get('dateOfBirth').value
      ).toISOString(),
      ownerId: 1, // TODO: BACKEND TREBA DA DOSTAVI
      city: this.selectedAddress.city,
      state: this.selectedAddress.state,
      address: this.selectedAddress.address,
      country: this.selectedAddress.country,
      zipCode: this.selectedAddress.zipCode,
      stateShortName: this.selectedAddress.stateShortName,
      bankId: this.selectedBank ? this.selectedBank.id : null,
      payType: this.selectedPayType ? this.selectedPayType.value : null,
      solo: {
        emptyMile: soloEmptyMile,
        loadedMile: soloLoadedMile,
        perStop: soloPerStop,
      },
      team: {
        emptyMile: teamEmptyMile,
        loadedMile: teamLoadedMile,
        perStop: teamPerStop,
      },
      commissionSolo: parseInt(this.driverForm.get('commissionSolo').value),
      commissionTeam: parseInt(this.driverForm.get('commissionTeam').value),
      twicExpDate: new Date(
        this.driverForm.get('twicExpDate').value
      ).toISOString(),
      offDutyLocations: []
    };
    console.log(newData)
    this.driverModalService
      .updateDriver(newData)
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

  private editDriverById(id: number): void {
    this.driverModalService
      .getDriverById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: DriverResponse) => {
          this.driverForm.patchValue({
            firstName: res.firstName,
            lastName: res.lastName,
            phone: res.phone,
            email: res.email,
            ssn: res.ssn,
            note: res.note,
            dateOfBirth: moment(new Date(res.dateOfBirth)).format('YYYY-MM-DD'),
            offDutyLocations: [],
            isOwner: true,
            ownerId: 1,
            ownerType: "Company",
            ein: "77-777777",
            bussinesName: null,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            bankId: res.bank ? res.bank.name : null,
            account: res.account,
            routing: res.routing,
            payroll: res.payroll,
            payType: null,
            mailNotification: res.mailNotification,
            phoneCallNotification: res.phoneCallNotification,
            smsNotification: res.smsNotification,
            soloEmptyMile: res.solo.emptyMile,
            soloLoadedMile: res.solo.loadedMile,
            soloPerStop: res.solo.perStop,
            teamEmptyMile: res.team.emptyMile,
            teamLoadedMile: res.team.loadedMile,
            teamPerStop: res.team.perStop,
            commissionSolo: res.commissionSolo,
            commissionTeam: res.commissionTeam,
            twic: res.twic,
            twicExpDate: moment(new Date(res.twicExpDate)).format('YYYY-MM-DD'),
            fuelCard: res.fuelCard,
            emergencyContactName: res.emergencyContactName,
            emergencyContactPhone: res.emergencyContactPhone,
            emergencyContactRelationship: res.emergencyContactRelationship,
          });
          res.firstName =
            res.firstName.charAt(0).toUpperCase() + res.firstName.slice(1);
          res.lastName =
            res.lastName.charAt(0).toUpperCase() + res.lastName.slice(1);

          this.driverFullName = res.firstName.concat(' ', res.lastName);
          this.selectedBank = res.bank;
          this.selectedPayType = res.payType;
          this.onHandleAddress(res.address);

          if (res.offDutyLocations.length) {
            for (const offDuty of res.offDutyLocations) {
              this.offDutyLocations.push(
                this.formBuilder.group({
                  nickname: offDuty.nickname,
                  address: offDuty.address.address,
                  city: offDuty.address.city,
                  state: offDuty.address.state,
                  stateShortName: offDuty.address.stateShortName,
                  country: offDuty.address.country,
                  zipCode: offDuty.address.zipCode,
                  addressUnit: offDuty.address.addressUnit,
                  // streetNumber: null,
                  // streetName: null,
                })
              );
            }
          }
          console.log(res)
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  private deleteDriverById(id: number): void {
    this.driverModalService
      .deleteDriverByid(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Driver successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Driver can't be deleted.", 'Error:');
        },
      });
  }

  public onSelectBank(event: any): void {
    this.selectedBank = event;
  }

  public onSelectPayType(event: any): void {
    this.selectedPayType = event;
  }

  ngOnDestroy(): void {}
}
