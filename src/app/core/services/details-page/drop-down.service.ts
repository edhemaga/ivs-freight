import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DriverCdlModalComponent } from '../../components/driver/driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../components/driver/driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../../components/driver/driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../../components/driver/driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { BrokerModalComponent } from '../../components/modals/broker-modal/broker-modal.component';
import { TtFhwaInspectionModalComponent } from '../../components/modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../components/modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtTitleModalComponent } from '../../components/modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { ConfirmationModalComponent } from '../../components/modals/confirmation-modal/confirmation-modal.component';
import { DriverModalComponent } from '../../components/modals/driver-modal/driver-modal.component';
import { ShipperModalComponent } from '../../components/modals/shipper-modal/shipper-modal.component';
import { TrailerModalComponent } from '../../components/modals/trailer-modal/trailer-modal.component';
import { TruckModalComponent } from '../../components/modals/truck-modal/truck-modal.component';
import { SettingsOfficeModalComponent } from '../../components/settings/settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '../../components/settings/settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsRepairshopModalComponent } from '../../components/settings/settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsTerminalModalComponent } from '../../components/settings/settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { SettingsLocationService } from '../../components/settings/state/location-state/settings-location.service';
import { ModalService } from '../../components/shared/ta-modal/modal.service';

@Injectable({
  providedIn: 'root',
})
export class DropDownService {
  public parkingDataById: any;

  constructor(
    private modalService: ModalService,
    private settingsLocationService: SettingsLocationService
  ) {}
  public getParkingById(id: number) {
    this.settingsLocationService
      .getCompanyParkingById(id)
      .subscribe((item) => (this.parkingDataById = item));
  }
  public dropActions(
    any: any,
    name: string,
    dataCdl?: any,
    dataMvr?: any,
    dataMedical?: any,
    dataTest?: any,
    driverId?: number,
    truckId?: number,
    trailerId?: number,
    data?: any,
    nameTruck?: string,
    hasActiveCdl?: boolean
  ) {
    switch (name) {
      case 'delete-cdl': {
        const mappedEvent = {
          ...any,
          data: {
            ...dataCdl,
            state: dataCdl.state.stateShortName,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'cdl',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-medical': {
        const mappedEvent = {
          ...any,
          data: {
            medicalIssued: dataMedical.issueDate,
            medicalExpDate: dataMedical.expDate,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'medical',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-mvr': {
        const mappedEvent = {
          ...any,
          data: {
            ...dataMvr,
            mvrIssueDate: dataMvr.issueDate,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'mvr',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-test': {
        const mappedEvent = {
          ...any,
          data: {
            testTypeName: dataTest.testType.name,
            reasonName: dataTest.testReason.name,
            issuedDataTest: dataTest.testingDate,
          },
        };
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'test',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'edit-licence': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: driverId,
            type: name,
          }
        );
        break;
      }

      case 'edit-drug': {
        this.modalService.openModal(
          DriverDrugAlcoholModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: driverId,
            type: name,
          }
        );
        break;
      }
      case 'edit-medical': {
        this.modalService.openModal(
          DriverMedicalModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: driverId,
            type: name,
          }
        );
        break;
      }
      case 'edit-mvr': {
        this.modalService.openModal(
          DriverMvrModalComponent,
          { size: 'small' },
          {
            file_id: any.id,
            id: driverId,
            type: name,
          }
        );
        break;
      }
      case 'delete-inspection': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            id: any.id,
            template: 'inspection',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-registration': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            id: any.id,
            template: 'registration',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'delete-title': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            id: any.id,
            template: 'title',
            type: 'delete',
            image: false,
          }
        );
        break;
      }
      case 'edit-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: any.id,
            type: name,
            modal: nameTruck === 'truck' ? 'truck' : 'trailer',
          }
        );
        break;
      }
      case 'edit-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: any.id,
            type: name,
            modal: nameTruck === 'truck' ? 'truck' : 'trailer',
          }
        );
        break;
      }
      case 'edit-title': {
        this.modalService.openModal(
          TtTitleModalComponent,
          { size: 'small' },
          {
            id: data.id,
            payload: data,
            file_id: any.id,
            type: name,
            modal: nameTruck === 'truck' ? 'truck' : 'trailer',
          }
        );
        break;
      }
      case 'renew': {
        alert('Ubaci modal ovde u globalni servis, details page');
        break;
      }
      case 'activate-item': {
        alert('Ubaci modal ovde u globalni servis, details page za aktivate');
        break;
      }
      default: {
        break;
      }
    }
  }
  public dropActionsHeader(event: any, driverObject?: any, driverId?: number) {
    const mappedEvent = {
      ...driverObject,
      data: {
        ...driverObject,
        name: driverObject?.firstName + ' ' + driverObject?.lastName,
      },
    };
    if (event.type === 'edit') {
      this.modalService.openModal(
        DriverModalComponent,
        { size: 'small' },
        {
          ...event,
          disableButton: true,
          id: event.id,
        }
      );
    } else if (event.type === 'deactivate' || event.type === 'activate') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'driver',
          type: driverObject.status === 1 ? 'deactivate' : 'activate',
          image: true,
        }
      );
    } else if (event.type === 'delete-item') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'driver',
          type: 'delete',
          image: true,
        }
      );
    }
  }

  public dropActionsHeaderShipperBroker(
    event: any,
    dataObject?: any,
    name?: string
  ) {
    const mappedEvent = {
      ...dataObject,
      data: {
        ...dataObject,
        name: dataObject?.businessName,
      },
    };
    if (event.type === 'edit' && name === 'shipper') {
      this.modalService.openModal(
        ShipperModalComponent,
        { size: 'small' },
        {
          ...event,
          disableButton: true,
          id: event.id,
        }
      );
    }
    if (event.type === 'edit' && name === 'broker') {
      this.modalService.openModal(
        BrokerModalComponent,
        { size: 'small' },
        {
          ...event,
          disableButton: true,
          id: event.id,
        }
      );
    } else if (event.type === 'delete-item') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: name === 'shipper' ? 'shipper' : 'broker',
          type: 'delete',
          image: false,
        }
      );
    } else if (event.type === 'move-to-ban') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'broker',
          subType: 'ban list',
          subTypeStatus: 'move',
          type: 'info',
          image: false,
        }
      );
    } else if (event.type === 'remove-from-ban') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'broker',
          subType: 'ban list',
          subTypeStatus: 'remove',
          type: 'info',
          image: false,
        }
      );
    } else if (event.type === 'move-to-dnu') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'broker',
          subType: 'dnu',
          subTypeStatus: 'move',
          type: 'info',
          image: false,
        }
      );
    } else if (event.type === 'remove-from-dnu') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'broker',
          subType: 'dnu',
          subTypeStatus: 'remove',
          type: 'info',
          image: false,
        }
      );
    }
  }
  public dropActionHeaderTruck(
    event: any,
    truckObject?: any,
    truckId?: number,
    trailerId?: number
  ) {
    const mappedEvent = {
      ...truckObject,
      data: {
        ...truckObject,
        number: trailerId
          ? truckObject?.trailerNumber
          : truckObject?.truckNumber,
        avatar: trailerId
          ? `assets/svg/common/trailers/${truckObject?.trailerType?.logoName}`
          : `assets/svg/common/trucks/${truckObject?.truckType?.logoName}`,
      },
    };
    if (event.type === 'edit' && !trailerId) {
      this.modalService.openModal(
        TruckModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          type: 'edit',
          disableButton: true,
        }
      );
    }
    if (event.type === 'edit' && trailerId) {
      this.modalService.openModal(
        TrailerModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
          disableButton: true,
          id: trailerId,
        }
      );
    } else if (event.type === 'deactivate' || event.type === 'activate') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: trailerId ? 'trailer' : 'truck',
          type: truckObject.status === 1 ? 'deactivate' : 'activate',
          svg: true,
        }
      );
    } else if (event.type === 'delete-item') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: trailerId ? 'trailer' : 'truck',
          type: 'delete',
          svg: true,
        }
      );
    }
  }

  public dropActionCompanyLocation(
    event: any,
    names: string,
    parkingObject?: any
  ) {
    const mappedEvent = {
      ...parkingObject,
      data: {
        ...parkingObject,
        name: parkingObject?.name,
      },
    };
    if (event.type === 'edit') {
      switch (names) {
        case 'edit-parking': {
          this.modalService.openModal(
            SettingsParkingModalComponent,
            {
              size: 'small',
            },
            {
              ...event,
              disableButton: true,
              id: event.id,
            }
          );
          break;
        }
        case 'edit-office': {
          this.modalService.openModal(
            SettingsOfficeModalComponent,
            {
              size: 'small',
            },
            {
              ...event,
              disableButton: true,
              id: event.id,
            }
          );
          break;
        }
        case 'edit-repair-shop': {
          this.modalService.openModal(
            SettingsRepairshopModalComponent,
            {
              size: 'small',
            },
            {
              ...event,
              disableButton: true,
              id: event.id,
            }
          );
          break;
        }
        case 'edit-terminal': {
          this.modalService.openModal(
            SettingsTerminalModalComponent,
            {
              size: 'small',
            },
            {
              ...event,
              disableButton: true,
              id: event.id,
            }
          );
          break;
        }
      }
    } else if (event.type === 'delete-item') {
      switch (names) {
        case 'delete-parking': {
          this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              ...mappedEvent,
              template: 'Company Parking',
              type: 'delete',
              svg: false,
            }
          );
          break;
        }
        case 'delete-office': {
          this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              ...mappedEvent,
              template: 'Company Office',
              type: 'delete',
              svg: false,
            }
          );
          break;
        }
        case 'delete-repair-shop': {
          this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              ...mappedEvent,
              template: 'Company Repair Shop',
              type: 'delete',
              svg: false,
            }
          );
          break;
        }
        case 'delete-terminal': {
          this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              ...mappedEvent,
              template: 'Company Terminal',
              type: 'delete',
              svg: false,
            }
          );
          break;
        }
      }
    }
  }
}
