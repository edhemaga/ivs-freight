import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { MockModalService } from 'src/app/core/services/mockmodal.service';

@Component({
  selector: 'app-broker-modal',
  templateUrl: './broker-modal.component.html',
  styleUrls: ['./broker-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
})
export class BrokerModalComponent implements OnInit {
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

  public selectedMainAddressTab: any = null;
  public mainAddressTabs: any[] = [];

  public selectedBillingAddressTab: any = null;
  public billingAddressTabs: any[] = [];

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private mockModalService: MockModalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.mainAddressTabs = this.mockModalService.brokerMainAddressTabs;
    this.billingAddressTabs = this.mockModalService.billingAddressTabs;
    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editBrokerById(this.editData.id);
    }
  }

  private createForm() {
    this.brokerForm = this.formBuilder.group({
      businessName: [null],
      dbaName: [null],
      mcNumber: [null],
      ein: [null],
      email: [null],
      phone: [null],
      mainAddress: [null],
      mainAddressUnit: [null],
      billingAddress: [null],
      mainPoBox: [null], // TODO:  city?: string | null; state?: string | null;  zipCode?: string | null; poBox?: string | null;
      billingPoBox: [null], // TODO:  city?: string | null; state?: string | null;  zipCode?: string | null; poBox?: string | null;
      isCheckedBillingAddress: [false],
      isCredit: [false],
      creditType: [null],
      creditLimit: [null],
      availableCredit: [null],
      payTerm: [null],
      dnu: [false],
      ban: [false],
      note: [null],
      brokerContacts: [null],
      //  contactName?: string | null;
      // departmentId?: number | null;
      // phone?: string | null;
      //extensionPhone?: string | null;
      //email?: string | null;
    });
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
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public tabMainAddressChange(event: any): void {
    console.log(event);
  }

  public onHandleAddress(event: any) {

  }

  private addBroker(): void {}

  private updateBroker(id: number): void {}

  private deleteBrokerById(id: number): void {}

  private editBrokerById(id: number): void {}
}
