import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DriverCdlModalComponent } from '../../components/driver/driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../components/driver/driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../../components/driver/driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../../components/driver/driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { TtFhwaInspectionModalComponent } from '../../components/modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../components/modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtTitleModalComponent } from '../../components/modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { ConfirmationModalComponent } from '../../components/modals/confirmation-modal/confirmation-modal.component';
import { DriverModalComponent } from '../../components/modals/driver-modal/driver-modal.component';
import { TrailerModalComponent } from '../../components/modals/trailer-modal/trailer-modal.component';
import { TruckModalComponent } from '../../components/modals/truck-modal/truck-modal.component';
import { SettingsParkingModalComponent } from '../../components/settings/settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
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
            ...dataMedical,
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
            ...dataTest,
            testTypeName: dataTest.testType.name,
            reasonName: dataTest.testReason.name,
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
          id: driverId,
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
    name: string,
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
      switch (name) {
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
        }
      }
    } else if (event.type === 'delete-item') {
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...mappedEvent,
          template: 'parking',
          type: 'delete',
          svg: false,
        }
      );
    }
  }
}
