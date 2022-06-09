import { emailRegex } from './../../shared/ta-input/ta-input.regex-validations';
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
import {
  AddressEntity,
  CreateShipperCommand,
  ShipperResponse,
  UpdateShipperCommand,
} from 'appcoretruckassist';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { ShipperModalService } from './shipper-modal.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { HttpResponseBase } from '@angular/common/http';

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

  public selectedAddress: AddressEntity = null;

  public isAppointmentReceiving: boolean = false;
  public isAppointmentShipping: boolean = false;

  public selectedContractDepartmentFormArray: any[] = [];

  public labelsDepartments: any[] = [];
  public isContactCardsScrolling: boolean = false;

  public reviews: any[] = [];

  public isPhoneExtExist: boolean = false;

  public shipperDnuStatus: boolean = true;
  public shipperBanStatus: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private shipperModalService: ShipperModalService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getShipperDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 2,
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
      phone: [null, [Validators.required, phoneRegex]],
      phoneExt: [null],
      email: [null, emailRegex],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      receivingAppointment: [false],
      receivingOpenTwentyFourHours: [false],
      receivingFrom: [null],
      receivingTo: [null],
      shippingHoursSameReceiving: [false],
      shippingAppointment: [false],
      shippingOpenTwentyFourHours: [false],
      shippingFrom: [null],
      shippingTo: [null],
      note: [null],
      shipperContacts: this.formBuilder.array([]),
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'bfb' || data.action === 'dnu') {
      // DNU
      if (data.action === 'dnu' && this.editData) {
        this.shipperModalService
          .changeDnuStatus(this.editData.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.shipperDnuStatus = !this.shipperDnuStatus;
                this.modalService.changeModalStatus({
                  name: 'dnu',
                  status: this.shipperDnuStatus,
                });
                this.notificationService.success(
                  `Shipper ${
                    this.shipperDnuStatus
                      ? 'status changed to DNU'
                      : 'removed from DNU'
                  }.`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Shipper status can't be changed.",
                'Success:'
              );
            },
          });
      }
      // BFB
      if (data.action === 'bfb' && this.editData) {
        this.shipperForm.get('ban').patchValue(data.bool);
        this.shipperModalService
          .changeBanStatus(this.editData.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.shipperBanStatus = !this.shipperBanStatus;
                this.modalService.changeModalStatus({
                  name: 'bfb',
                  status: this.shipperBanStatus,
                });
                this.notificationService.success(
                  `Shipper ${
                    this.shipperBanStatus
                      ? 'status changed to BAN'
                      : 'removed from BAN'
                  } .`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Shipper status can't be changed.",
                'Success:'
              );
            },
          });
      }
    } else {
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
            this.modalService.setModalSpinner({
              action: null,
              status: true,
            });
          } else {
            this.addShipper();
            this.modalService.setModalSpinner({
              action: null,
              status: true,
            });
          }
        }
        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteShipperById(this.editData.id);
          this.modalService.setModalSpinner({
            action: 'delete',
            status: true,
          });
        }
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

  public get shipperContacts(): FormArray {
    return this.shipperForm.get('shipperContacts') as FormArray;
  }

  private createShipperContacts(): FormGroup {
    return this.formBuilder.group({
      fullName: [null],
      departmentId: [null],
      phone: [null, phoneRegex],
      phoneExt: [null],
      email: [null, emailRegex],
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

  public onHandleAddress(event: { address: AddressEntity; valid: boolean }) {
    this.selectedAddress = event.address;
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
    const { address, addressUnit, shipperContacts, ...form } =
      this.shipperForm.value;
    let receivingShipping = this.receivingShippingObject();
    let newData: CreateShipperCommand = {
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: this.shipperForm.get('addressUnit').value,
      },
      receivingFrom: receivingShipping.receiving.receivingFrom,
      receivingTo: receivingShipping.receiving.receivingTo,
      shippingAppointment: receivingShipping.shipping.shippingAppointment,
      shippingOpenTwentyFourHours:
        receivingShipping.shipping.shippingOpenTwentyFourHours,
      shippingFrom: receivingShipping.shipping.shippingFrom,
      shippingTo: receivingShipping.shipping.shippingTo,
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
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Shipper can't be added.", 'Error:');
        },
      });
  }

  private updateShipper(id: number) {
    const { address, addressUnit, shipperContacts, ...form } =
      this.shipperForm.value;

    let receivingShipping = this.receivingShippingObject();

    let newData: UpdateShipperCommand = {
      id: id,
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: this.shipperForm.get('addressUnit').value,
      },
      receivingFrom: receivingShipping.receiving.receivingFrom,
      receivingTo: receivingShipping.receiving.receivingTo,
      shippingAppointment: receivingShipping.shipping.shippingAppointment,
      shippingOpenTwentyFourHours:
        receivingShipping.shipping.shippingOpenTwentyFourHours,
      shippingFrom: receivingShipping.shipping.shippingFrom,
      shippingTo: receivingShipping.shipping.shippingTo,
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
          this.modalService.setModalSpinner({ action: null, status: false });
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
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
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
            receivingOpenTwentyFourHours:
              reasponse.receivingOpenTwentyFourHours,
            receivingFrom: reasponse.receivingFrom,
            receivingTo: reasponse.receivingTo,
            shippingHoursSameReceiving: reasponse.shippingHoursSameReceiving,
            shippingAppointment: reasponse.shippingAppointment,
            shippingOpenTwentyFourHours: false,
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
                  departmentId: contact.department
                    ? contact.department.name
                    : null,
                  phone: contact.phone,
                  phoneExt: contact.phoneExt,
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

  public receivingShippingObject(): {
    receiving;
    shipping;
  } {
    let receiving: any = null;
    let shipping: any = null;

    if (
      this.shipperForm.get('receivingAppointment').value &&
      this.shipperForm.get('receivingOpenTwentyFourHours').value
    ) {
      receiving = {
        receivingFrom: null,
        receivingTo: null,
      };
    } else {
      receiving = {
        receivingFrom: this.shipperForm.get('receivingFrom').value,
        receivingTo: this.shipperForm.get('receivingTo').value,
      };
    }

    if (this.shipperForm.get('shippingHoursSameReceiving').value) {
      shipping = {
        shippingAppointment: this.shipperForm.get('receivingAppointment').value,
        shippingOpenTwentyFourHours: this.shipperForm.get(
          'receivingOpenTwentyFourHours'
        ).value,
        shippingFrom: receiving.receivingFrom,
        shippingTo: receiving.receivingTo,
      };
    } else {
      if (
        this.shipperForm.get('shippingOpenTwentyFourHours').value &&
        this.shipperForm.get('shippingAppointment').value
      ) {
        shipping = {
          shippingAppointment: this.shipperForm.get('shippingAppointment')
            .value,
          shippingOpenTwentyFourHours: this.shipperForm.get(
            'shippingOpenTwentyFourHours'
          ).value,
          shippingFrom: null,
          shippingTo: null,
        };
      } else {
        shipping = {
          shippingAppointment: this.shipperForm.get('shippingAppointment')
            .value,
          shippingOpenTwentyFourHours: this.shipperForm.get(
            'shippingOpenTwentyFourHours'
          ).value,
          shippingFrom: this.shipperForm.get('shippingFrom').value,
          shippingTo: this.shipperForm.get('shippingTo').value,
        };
      }
    }
    return { receiving, shipping };
  }

  ngOnDestroy(): void {}
}
