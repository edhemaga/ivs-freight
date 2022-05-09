import { ShipperModalResponse } from './../../../../../../appcoretruckassist/model/shipperModalResponse';
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
import { Address } from '../../shared/ta-input-address/ta-input-address.component';
import {
  AddressEntity,
  CreateShipperCommand,
  ShipperResponse,
  UpdateShipperCommand,
} from 'appcoretruckassist';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { ShipperModalService } from './shipper-modal.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-shipper-modal',
  templateUrl: './shipper-modal.component.html',
  styleUrls: ['./shipper-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
})
export class ShipperModalComponent implements OnInit, OnDestroy {
  @Input() editData: any = null;

  public shipperForm: FormGroup;

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

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public selectedAddress: Address | AddressEntity = null;

  public isAppointmentReceiving: boolean = false;
  public isAppointmentShipping: boolean = false;

  public selectedContractDepartmentFormArray: any[] = [];

  public labelsDepartments: any[] = [];
  public isContactCardsScrolling: boolean = false;

  public reviews: any[] = [];

  public isPhoneExtExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private shipperModalService: ShipperModalService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getShipperDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 3,
      };
      this.editShipperById(this.editData.id);
      this.tabs.push({
        id: 3,
        name: 'Review',
      });
    }
  }

  private createForm() {
    this.shipperForm = this.formBuilder.group({
      businessName: [null, Validators.required],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)],
      ],
      phoneExt: [null],
      email: [
        null,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      ],
      address: [null, Validators.required],
      addressUnit: [null],
      receivingAppointment: [false],
      receiving24h: [false],
      receivingFrom: [null],
      receivingTo: [null],
      isShippingHoursSameLikeReceiving: [false],
      shippingAppointment: [false],
      shipping24h: [false],
      shippingFrom: [null],
      shippingTo: [null],
      note: [null],
      shipperContacts: this.formBuilder.array([]),
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.shipperForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.shipperForm.invalid) {
          this.inputService.markInvalid(this.shipperForm);
          return;
        }
        if (this.editData) {
          this.updateShipper(this.editData.id);
        } else {
          this.addShipper();
        }
      }
      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteShipperById(this.editData.id);
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

  public get shipperContacts(): FormArray {
    return this.shipperForm.get('shipperContacts') as FormArray;
  }

  private createShipperContacts(): FormGroup {
    return this.formBuilder.group({
      fullName: [null],
      departmentId: [null],
      phone: [null],
      extensionPhone: [null],
      email: [null],
    });
  }

  public addShipperContacts(event: any) {
    if (event) {
      this.shipperContacts.push(this.createShipperContacts());
    }
  }

  public removeShipperContacts(id: number) {
    this.shipperContacts.removeAt(id);
    this.selectedContractDepartmentFormArray.splice(id, 1);
  }

  public onScrollingShipperContacts(event: any) {
    if (event.target.scrollLeft > 1) {
      this.isContactCardsScrolling = true;
    } else {
      this.isContactCardsScrolling = false;
    }
  }

  public onHandleAddress(event: any) {
    this.selectedAddress = event;
  }

  public onSelectContactDepartment(event: any, ind: number) {
    this.selectedContractDepartmentFormArray[ind] = event;
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

  private addShipper() {
    const {
      address,
      receiving24h,
      isShippingHoursSameLikeReceiving,
      shipping24h,
      shipperContacts,
      ...form
    } = this.shipperForm.value;
    
    let newData: CreateShipperCommand = {
      ...form,
      address: this.selectedAddress,
    };

    for (let index = 0; index < shipperContacts.length; index++) {
      shipperContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      shipperContacts,
    };

    this.shipperModalService
      .addShipper(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Shipper successfully added.',
            'Error:'
          );
        },
        error: () => {
          this.notificationService.error("Shipper can't be added.", 'Error:');
        },
      });
  }

  private updateShipper(id: number) {
    const {
      address,
      receiving24h,
      isShippingHoursSameLikeReceiving,
      shipping24h,
      shipperContacts,
      ...form
    } = this.shipperForm.value;
    let newData: UpdateShipperCommand = {
      id: id,
      ...form,
      address: this.selectedAddress,
    };

    for (let index = 0; index < shipperContacts.length; index++) {
      shipperContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      shipperContacts,
    };

    this.shipperModalService
      .updateShipper(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Shipper successfully updated.',
            'Error:'
          );
        },
        error: () => {
          this.notificationService.error("Shipper can't be updated.", 'Error:');
        },
      });
  }

  private deleteShipperById(id: number) {
    this.shipperModalService
      .deleteShipperById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Shipper successfully deleted.',
            'Error:'
          );
        },
        error: () => {
          this.notificationService.error("Shipper can't be deleted.", 'Error:');
        },
      });
  }

  private editShipperById(id: number) {
    this.shipperModalService
      .getShipperById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (reasponse: ShipperResponse) => {
          this.shipperForm.patchValue({
            businessName: reasponse.businessName,
            phone: reasponse.phone,
            phoneExt: reasponse.phoneExt,
            email: reasponse.email,
            address: reasponse.address.address,
            addressUnit: reasponse.address.addressUnit,
            receivingAppointment: reasponse.receivingAppointment,
            receiving24h: false,
            receivingFrom: reasponse.receivingFrom,
            receivingTo: reasponse.receivingTo,
            isShippingHoursSameLikeReceiving: false,
            shippingAppointment: reasponse.shippingAppointment,
            shipping24h: false,
            shippingFrom: reasponse.shippingFrom,
            shippingTo: reasponse.shippingTo,
            note: reasponse.note,
            shipperContacts: [],
          });
          this.selectedAddress = reasponse.address;

          if (reasponse.phoneExt) {
            this.isPhoneExtExist = true;
          }

          if (reasponse.shipperContacts.length) {
            for (const contact of reasponse.shipperContacts) {
              this.shipperContacts.push(
                this.formBuilder.group({
                  fullName: contact.fullName,
                  departmentId: contact.department.name,
                  phone: contact.phone,
                  extensionPhone: contact.phoneExt,
                  email: contact.email,
                })
              );
              this.selectedContractDepartmentFormArray.push(contact.department);
            }
          }

          if (reasponse.receivingAppointment) {
            this.isAppointmentReceiving = true;
          }

          if (reasponse.shippingAppointment) {
            this.isAppointmentShipping = true;
          }

          this.reviews = [...reasponse.shipperReviews].map((item) => ({
            ...item,
            companyUser: {
              ...item.companyUser,
              image: 'https://picsum.photos/id/237/200/300',
            },
          }));
        },
        error: () => {
          this.notificationService.error("Shipper can't be loaded.", 'Error:');
        },
      });
  }

  private getShipperDropdowns() {
    this.shipperModalService
      .getShipperDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: ShipperModalResponse) => {
          this.labelsDepartments = res.departments;
        },
        error: () => {
          this.notificationService.error(
            "Shipper dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  public onAppontmentShipping() {
    this.isAppointmentShipping = !this.isAppointmentShipping;
    this.shipperForm
      .get('shippingAppointment')
      .patchValue(this.isAppointmentShipping);
  }

  public onAppontmentReceiving() {
    this.isAppointmentReceiving = !this.isAppointmentReceiving;
    this.shipperForm
      .get('receivingAppointment')
      .patchValue(this.isAppointmentReceiving);
  }

  ngOnDestroy(): void {}
}
