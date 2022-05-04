import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MockModalService } from 'src/app/core/services/mockmodal.service';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';

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
      isActive: true,
    },
    {
      label: 'Disable',
      value: 'disable',
      name: 'credit',
      checked: false,
    },
  ];

  public selectedPhysicalAddress: Address = null;
  public selectedPhysicalPoBoxCity: Address = null;
  public selectedBillingAddress: Address = null;
  public selectedBillingPoBoxCity: Address = null;

  public labelsPayType: any[] = [];
  public labelsDepartments: any[] =[];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService
  ) {}

  ngOnInit() {
    this.createForm();
    // this.onEinTyping();

    this.physicalAddressTabs = this.mockModalService.brokerPhysicalAddressTabs;
    this.billingAddressTabs = this.mockModalService.brokerBillingAddressTabs;

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
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
      physicalPoBox: [null], // TODO:  city?: string | null; state?: string | null;  zipCode?: string | null; poBox?: string | null;
      physicalPoBoxCity: [null],
      // Billing Address
      isCheckedBillingAddress: [false],
      billingAddress: [null],
      billingAddressUnit: [null],
      billingPoBox: [null], // TODO:  city?: string | null; state?: string | null;  zipCode?: string | null; poBox?: string | null;
      billingPoBoxCity: [null],
      isCredit: [true],
      creditLimit: [null],
      payTerm: [null],
      note: [null],
      creditType: [null],
      availableCredit: [null],
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
  }

  public onModalAction(action: string) {
    if (action === 'close') {
      this.brokerForm.reset();
    } else {
      // Save & Update
      if (action === 'save') {
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
      if (action === 'delete' && this.editData) {
        this.deleteBrokerById(this.editData.id);
      }

      this.ngbActiveModal.close();
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
    console.log('BILLING');
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

  public onHandlePhysicalAddress(event: any) {
    this.selectedPhysicalAddress = event;
  }

  public onHandlePhysicalPoBoxCityAddress(event: any) {
    this.selectedPhysicalPoBoxCity = event;
  }

  public onHandleBillingAddress(event: any) {
    this.selectedBillingAddress = event;
  }

  public onHandleBillingPoBoxCityAddress(event: any) {
    this.selectedBillingPoBoxCity = event;
  }

  public isCredit(event: any) {
    this.brokerForm.get('isCredit').patchValue(event.checked);

    if (this.brokerForm.get('isCredit').value) {
      this.inputService.changeValidators(this.brokerForm.get('creditLimit'));
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('creditLimit'),
        false
      );
    }
  }

  public onSelectContactDepartment(event: any) {

  }

  public onSelectPayType(event: any) {}

  private addBroker(): void {}

  private updateBroker(id: number): void {}

  private deleteBrokerById(id: number): void {}

  private editBrokerById(id: number): void {}



  ngOnDestroy(): void {}
}
