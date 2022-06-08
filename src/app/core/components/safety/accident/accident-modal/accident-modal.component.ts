import {
  phoneRegex,
  emailRegex,
} from './../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { tab_modal_animation } from '../../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';

@Component({
  selector: 'app-accident-modal',
  templateUrl: './accident-modal.component.html',
  styleUrls: ['./accident-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class AccidentModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public accidentForm: FormGroup;

  public selectedTab: number = 1;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
  ];

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public documents: any[] = [];
  public media: any[] = [];

  public selectedLocation: AddressEntity = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (this.editData) {
      this.editAccidentById(this.editData.id);
    }
    this.createForm();
  }

  private createForm() {
    this.accidentForm = this.formBuilder.group({
      report: [null],
      federallyRecordable: [null],
      stateRecordable: [null],
      injury: [null],
      fatality: [null],
      towing: [null],
      hazmat: [null],
      vehicleNumber: [null],
      location: [null],
      date: [null],
      time: [null],
      driverName: [null],
      driverLicenceNumber: [null],
      driverState: [null],
      driverDOB: [null],
      truckUnit: [null],
      truckType: [null],
      truckMake: [null],
      truckPlateNumber: [null],
      truckState: [null],
      truckVIN: [null],
      trailerUnit: [null],
      trailerType: [null],
      trailerMake: [null],
      trailerPlateNumber: [null],
      trailerState: [null],
      trailerVIN: [null],
      // Vioaltion
      insuranceType: [null],
      insuranceClaimNumber: [null],
      insuranceAdjuster: [null],
      insurancePhone: [null, phoneRegex],
      insuranceEmail: [null, emailRegex],
      note: [null],
      roadwayTrafficWay: [null],
      weatherCondition: [null],
      roadAccessControl: [null],
      roadSurfaceCondition: [null],
      lightCondition: [null],
      reportingAgency: [null],
      authorityPoliceOffice: [null],
      authorityBadgeNumber: [null],
      authorityAddress: [null],
      authorityPhone: [null, phoneRegex],
      authorityFax: [null],
      shippingOriginLocation: [null],
      shippingDestinationLocation: [null],
      shippingCustomer: [null],
      shippingBOL: [null],
      shippingCargo: [null],
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public onModalAction(data: { action: string; bool: boolean }): void {}

  public editAccidentById(id: number) {}

  public onHandleAddress(event: any, action: string) {
    switch (action) {
      case 'location': {
        this.selectedLocation = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any, action: string) {
    switch (action) {
      case 'documents': {
        this.documents = event;
        break;
      }
      case 'media': {
        this.media = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
