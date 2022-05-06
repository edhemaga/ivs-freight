import { AddressEntity } from './../../../../../../appcoretruckassist/model/addressEntity';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MockModalService } from 'src/app/core/services/mockmodal.service';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BrokerModalService } from './broker-modal.service';
import { BrokerModalResponse } from './../../../../../../appcoretruckassist/model/brokerModalResponse';
import {
  BrokerResponse,
  CreateBrokerCommand,
  UpdateBrokerCommand,
} from 'appcoretruckassist';

@Component({
  selector: 'app-broker-modal',
  templateUrl: './broker-modal.component.html',
  styleUrls: ['./broker-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
})
export class BrokerModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public brokerForm: FormGroup;

  public selectedTab: number = 1;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Details',
    },
    {
      id: 2,
      name: 'Contact',
    },
  ];

  public selectedPhysicalAddressTab: any = {
    id: 'physicaladdress',
    name: 'Physical Address',
    checked: true,
  };
  public physicalAddressTabs: any[] = [];

  public selectedBillingAddressTab: any = {
    id: 'billingaddress',
    name: 'Billing Address',
    checked: true,
  };
  public billingAddressTabs: any[] = [];

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public billingCredit = [
    {
      label: 'Enable',
      value: 'enable',
      name: 'credit',
      checked: true,
    },
    {
      label: 'Disable',
      value: 'disable',
      name: 'credit',
      checked: false,
    },
  ];

  public reviews: any[] = [];

  public selectedPhysicalAddress: Address | AddressEntity = null;
  public selectedPhysicalPoBox: Address | AddressEntity = null;
  public selectedBillingAddress: Address | AddressEntity = null;
  public selectedBillingPoBox: Address | AddressEntity = null;

  public labelsPayTerms: any[] = [];
  public labelsDepartments: any[] = [];

  public selectedContractDepartmentFormArray: any[] = [];
  public selectedContractDepartment: any = null;
  public selectedPayTerm: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService,
    private brokerModalService: BrokerModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getBrokerDropdown();
    this.isCredit(this.billingCredit);

    // this.onEinTyping();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 4,
      };
      this.editBrokerById(this.editData.id);
      this.tabs.push({
        id: 3,
        name: 'Review',
      });
    }
  }

  private createForm() {
    this.brokerForm = this.formBuilder.group({
      businessName: [null, Validators.required],
      dbaName: [null],
      mcFFNumber: [null, Validators.maxLength(8)],
      ein: [null, [Validators.pattern(/^\d{2}\-\d{7}$/)]],
      email: [
        null,
        [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
      ],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)],
      ],
      // Physical Address
      physicalAddress: [null],
      physicalAddressUnit: [null],
      physicalPoBox: [null],
      physicalPoBoxCity: [null],
      // Billing Address
      isCheckedBillingAddress: [false],
      billingAddress: [null],
      billingAddressUnit: [null],
      billingPoBox: [null],
      billingPoBoxCity: [null],
      isCredit: [true],
      creditType: [null], // Enable | Disable
      creditLimit: [null],
      availableCredit: [null],
      payTerm: [null],
      note: [null],
      ban: [null],
      dnu: [null],
      brokerContacts: this.formBuilder.array([]),
    });
  }

  public get brokerContacts(): FormArray {
    return this.brokerForm.get('brokerContacts') as FormArray;
  }

  private createBrokerContacts(): FormGroup {
    return this.formBuilder.group({
      contactName: [null],
      departmentId: [null],
      phone: [null],
      extensionPhone: [null],
      email: [null],
    });
  }

  public addBrokerContacts(event: any) {
    if (event) {
      this.brokerContacts.push(this.createBrokerContacts());
    }
  }

  public removeBrokerContacts(id: number) {
    this.brokerContacts.removeAt(id);
    this.selectedContractDepartmentFormArray.splice(id, 1);
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'bfb' || data.action === 'dnu') {
      // DNU
      if (data.action === 'dnu' && this.editData) {
        this.brokerForm.get('dnu').patchValue(data.bool);
      }
      // BFB
      if (data.action === 'bfb' && this.editData) {
        this.brokerForm.get('ban').patchValue(data.bool);
      }
    } else {
      if (data.action === 'close') {
        this.brokerForm.reset();
      } else {
        // Save & Update
        if (data.action === 'save') {
          if (this.brokerForm.invalid) {
            this.inputService.markInvalid(this.brokerForm);
            return;
          }
          if (this.editData) {
            this.updateBroker(this.editData.id);
          } else {
            this.addBroker();
          }
        }
        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteBrokerById(this.editData.id);
        }
        this.ngbActiveModal.close();
      }
    }
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector(
      this.editData ? '.animation-three-tabs' : '.animation-two-tabs'
    );
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public tabPhysicalAddressChange(event: any): void {
    this.selectedPhysicalAddressTab = event.find(
      (item) => item.checked === true
    );

    if (this.selectedPhysicalAddressTab?.name === 'physical address') {
      this.inputService.changeValidators(
        this.brokerForm.get('physicalAddress')
      );
      this.inputService.changeValidators(
        this.brokerForm.get('physicalPoBox'),
        false
      );
      this.inputService.changeValidators(
        this.brokerForm.get('physicalPoBoxCity'),
        false
      );
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('physicalAddress'),
        false
      );
      this.inputService.changeValidators(this.brokerForm.get('physicalPoBox'));
      this.inputService.changeValidators(
        this.brokerForm.get('physicalPoBoxCity')
      );
    }
  }

  public tabBillingAddressChange(event: any): void {
    this.selectedBillingAddressTab = event.find(
      (item) => item.checked === true
    );

    if (this.selectedBillingAddressTab?.name === 'billing address') {
      this.inputService.changeValidators(this.brokerForm.get('billingAddress'));
      this.inputService.changeValidators(
        this.brokerForm.get('billingPoBox'),
        false
      );
      this.inputService.changeValidators(
        this.brokerForm.get('billingPoBoxCity'),
        false
      );
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('billingAddress'),
        false
      );
      this.inputService.changeValidators(this.brokerForm.get('billingPoBox'));
      this.inputService.changeValidators(
        this.brokerForm.get('billingPoBoxCity')
      );
    }
  }

  public onHandlePhysicalAddress(event: Address) {
    this.selectedPhysicalAddress = event;
  }

  public onHandlePhysicalPoBoxCityAddress(event: Address) {
    this.selectedPhysicalPoBox = event;
  }

  public onHandleBillingAddress(event: Address) {
    this.selectedBillingAddress = event;
  }

  public onHandleBillingPoBoxCityAddress(event: Address) {
    this.selectedBillingPoBox = event;
  }

  public isCredit(event: any) {
    this.billingCredit = [...event];
    this.billingCredit.forEach((item) => {
      if (item.checked) {
        this.brokerForm.get('creditType').patchValue(item.label);
      }
    });

    if (this.brokerForm.get('creditType').value === 'Enable') {
      this.inputService.changeValidators(this.brokerForm.get('creditLimit'));
      this.inputService.changeValidators(this.brokerForm.get('payTerm'));
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('creditLimit'),
        false
      );
      this.inputService.changeValidators(this.brokerForm.get('payTerm'), false);
    }
  }

  public changeReviewsEvent(reviews: { data: any[]; action: string }) {
    this.reviews = [...reviews.data];
    // TODO: API CREATE OR DELETE
  }

  public addNewReview(event: any) {
    this.reviews.unshift({
      id: Math.random() * 100,
      companyUser: {
        id: Math.random() * 100,
        fullName: 'Angela Martin',
        image: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: true,
    });
  }

  public onSelectContactDepartment(event: any, index: number) {
    this.selectedContractDepartment = event;

    this.selectedContractDepartmentFormArray[index] = event;
  }

  public onSelectPayType(event: any) {
    this.selectedPayTerm = event;
  }

  private getBrokerDropdown() {
    this.brokerModalService
      .getBrokerDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (reasponse: BrokerModalResponse) => {
          this.labelsDepartments = reasponse.departments;
          this.labelsPayTerms = reasponse.payTerms;
        },
        error: () => {
          this.notificationService.error(
            "Broker's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
    this.physicalAddressTabs = this.mockModalService.brokerPhysicalAddressTabs;
    this.billingAddressTabs = this.mockModalService.brokerBillingAddressTabs;
  }

  private addBroker(): void {
    const {
      physicalAddress,
      physicalAddressUnit,
      physicalPoBox,
      physicalPoBoxCity,
      billingAddress,
      billingAddressUnit,
      billingPoBox,
      billingPoBoxCity,
      isCredit,
      isCheckedBillingAddress,
      brokerContacts,
      mcFFNumber,
      ...form
    } = this.brokerForm.value;
    let newData: CreateBrokerCommand = {
      ...form,
      mainAddress: {
        address: this.selectedPhysicalAddress.address,
        city: this.selectedPhysicalAddress.city,
        state: this.selectedPhysicalAddress.state,
        country: this.selectedPhysicalAddress.country,
        zipCode: this.selectedPhysicalAddress.zipCode,
        stateShortName: this.selectedPhysicalAddress.stateShortName,
        addressUnit: physicalAddressUnit,
      },
      billingAddress: {
        address: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.address
          : this.selectedBillingAddress.address,
        city: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.city
          : this.selectedBillingAddress.city,
        state: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.state
          : this.selectedBillingAddress.state,
        country: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.country
          : this.selectedBillingAddress.country,
        zipCode: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.zipCode
          : this.selectedBillingAddress.zipCode,
        stateShortName: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.stateShortName
          : this.selectedBillingAddress.stateShortName,
        addressUnit: isCheckedBillingAddress
          ? physicalAddressUnit
          : billingAddressUnit,
      },
      mainPoBox: {
        city: this.selectedPhysicalPoBox
          ? this.selectedPhysicalPoBox.city
          : null,
        state: this.selectedPhysicalPoBox
          ? this.selectedPhysicalPoBox.state
          : null,
        zipCode: this.selectedPhysicalPoBox
          ? this.selectedPhysicalPoBox.zipCode
          : null,
        poBox: this.selectedPhysicalPoBox ? physicalPoBox : null,
      },
      billingPoBox: {
        city: this.selectedBillingPoBox ? this.selectedBillingPoBox.city : null,
        state: this.selectedBillingPoBox
          ? this.selectedBillingPoBox.state
          : null,
        zipCode: this.selectedBillingPoBox
          ? this.selectedBillingPoBox.zipCode
          : null,
        poBox: billingPoBox,
      },
      isCheckedBillingAddress: isCheckedBillingAddress,
      isCredit: isCredit,
      mcNumber: mcFFNumber
    };
    for (let index = 0; index < brokerContacts.length; index++) {
      brokerContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }
    newData = {
      ...newData,
      brokerContacts,
    };
    this.brokerModalService
      .addBroker(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Broker successfully created.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Broker can't be created.", 'Error:');
        },
      });
  }

  private updateBroker(id: number): void {
    const {
      physicalAddress,
      physicalAddressUnit,
      physicalPoBox,
      physicalPoBoxCity,
      billingAddress,
      billingAddressUnit,
      billingPoBox,
      billingPoBoxCity,
      isCredit,
      isCheckedBillingAddress,
      brokerContacts,
      mcFFNumber,
      ...form
    } = this.brokerForm.value;

    let newData: UpdateBrokerCommand = {
      id: id,
      ...form,
      mainAddress: {
        address: this.selectedPhysicalAddress.address,
        city: this.selectedPhysicalAddress.city,
        state: this.selectedPhysicalAddress.state,
        country: this.selectedPhysicalAddress.country,
        zipCode: this.selectedPhysicalAddress.zipCode,
        stateShortName: this.selectedPhysicalAddress.stateShortName,
        addressUnit: physicalAddressUnit,
      },
      billingAddress: {
        address: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.address
          : this.selectedBillingAddress.address,
        city: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.city
          : this.selectedBillingAddress.city,
        state: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.state
          : this.selectedBillingAddress.state,
        country: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.country
          : this.selectedBillingAddress.country,
        zipCode: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.zipCode
          : this.selectedBillingAddress.zipCode,
        stateShortName: isCheckedBillingAddress
          ? this.selectedPhysicalAddress.stateShortName
          : this.selectedBillingAddress.stateShortName,
        addressUnit: isCheckedBillingAddress
          ? physicalAddressUnit
          : billingAddressUnit,
      },
      mainPoBox: {
        city: this.selectedPhysicalPoBox
          ? this.selectedPhysicalPoBox.city
          : null,
        state: this.selectedPhysicalPoBox
          ? this.selectedPhysicalPoBox.state
          : null,
        zipCode: this.selectedPhysicalPoBox
          ? this.selectedPhysicalPoBox.zipCode
          : null,
        poBox: this.selectedPhysicalPoBox ? physicalPoBox : null,
      },
      billingPoBox: {
        city: this.selectedBillingPoBox ? this.selectedBillingPoBox.city : null,
        state: this.selectedBillingPoBox
          ? this.selectedBillingPoBox.state
          : null,
        zipCode: this.selectedBillingPoBox
          ? this.selectedBillingPoBox.zipCode
          : null,
        poBox: billingPoBox,
      },
      isCheckedBillingAddress: isCheckedBillingAddress,
      mcNumber: mcFFNumber
    };
    console.log("PRE UPDATE")
    console.log(brokerContacts)
    for (let index = 0; index < brokerContacts.length; index++) {
      brokerContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }
    console.log("POSLE UPDATE")
    console.log(brokerContacts)
    newData = {
      ...newData,
      brokerContacts,
    };

    console.log("CEO UPDATE")
    console.log(newData)
    this.brokerModalService
      .updateBroker(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Broker successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Broker can't be updated.", 'Error:');
        },
      });
  }

  private deleteBrokerById(id: number): void {
    this.brokerModalService
      .deleteBrokerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Broker successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Broker can't be deleted.", 'Error:');
        },
      });
  }

  private editBrokerById(id: number): void {
    this.brokerModalService
      .getBrokerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (reasponse: BrokerResponse) => {
          this.brokerForm.patchValue({
            businessName: reasponse.businessName,
            dbaName: reasponse.dbaName,
            mcFFNumber: reasponse.mcNumber,
            ein: reasponse.ein,
            email: reasponse.email,
            phone: reasponse.phone,
            // Physical Address
            physicalAddress: reasponse.mainAddress.address,
            physicalAddressUnit: reasponse.mainAddress.addressUnit,
            physicalPoBox: reasponse.mainPoBox.poBox,
            physicalPoBoxCity: reasponse.mainPoBox.city,
            // Billing Address
            isCheckedBillingAddress:
              reasponse.mainAddress.address ===
              reasponse.billingAddress.address,
            billingAddress: reasponse.billingAddress.address,
            billingAddressUnit: reasponse.billingAddress.addressUnit,
            billingPoBox: reasponse.billingPoBox.poBox,
            billingPoBoxCity: reasponse.billingPoBox.city,
            creditType: reasponse.creditType,
            creditLimit: reasponse.creditType === 'Enable' ? 5 : null, // TODO: BACK
            availableCredit: reasponse.availableCredit,
            payTerm:
              reasponse.creditType === 'Enable' ? reasponse.payTerm : null,
            note: reasponse.note,
            ban: reasponse.ban,
            dnu: reasponse.dnu,
            brokerContacts: [],
          });

          if (reasponse.brokerContacts) {
            for (const contact of reasponse.brokerContacts) {
              this.brokerContacts.push(
                this.formBuilder.group({
                  contactName: contact.contactName,
                  departmentId: contact.department.name,
                  phone: contact.phone,
                  extensionPhone: contact.extensionPhone,
                  email: contact.email,
                })
              );
              this.selectedContractDepartmentFormArray.push(contact.department);
            }
          }

          console.log(this.selectedContractDepartmentFormArray)

          this.reviews = [...reasponse.brokerReviews].map((item) => ({
            ...item,
            companyUser: {
              ...item.companyUser,
              image: 'https://picsum.photos/id/237/200/300',
            },
          }));

          this.selectedPhysicalAddress = reasponse.mainAddress;
          this.selectedPhysicalPoBox = reasponse.mainPoBox;
          this.selectedBillingAddress = reasponse.billingAddress;
          this.selectedBillingPoBox = reasponse.billingPoBox;
          this.selectedPayTerm = null;

          if (reasponse.creditType === 'Enable') {
            this.billingCredit[0].checked = true;
            this.isCredit(this.billingCredit);
          } else {
            this.billingCredit[0].checked = false;
            this.billingCredit[1].checked = true;
            this.isCredit(this.billingCredit);
          }
        },
        error: () => {
          this.notificationService.error("Broker can't be loaded.", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {}
}
