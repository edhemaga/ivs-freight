import { Injectable } from '@angular/core';
import {
  CompanyOfficeModalResponse,
  CompanyOfficeResponse,
  CompanyOfficeService,
  CreateCompanyOfficeCommand,
  CreateParkingCommand,
  CreateResponse,
  ParkingResponse,
  ParkingService,
  UpdateCompanyOfficeCommand,
  UpdateParkingCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { SettingsOfficeModalComponent } from '../../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '../../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsRepairshopModalComponent } from '../../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsTerminalModalComponent } from '../../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';

@Injectable({
  providedIn: 'root',
})
export class SettingsLocationService {
  constructor(
    private modalService: ModalService,
    private companyOfficeService: CompanyOfficeService,
    private companyParkingService: ParkingService
  ) {}

  /**
   * Open Modal
   * @param type - payload
   * @param modalName - modal name
   */
  public onModalAction(data: { modalName: string; type?: any }) {
    switch (data.modalName) {
      case 'parking': {
        this.modalService.openModal(
          SettingsParkingModalComponent,
          {
            size: 'small',
          },
          { ...data.type }
        );
        break;
      }
      case 'office': {
        this.modalService.openModal(
          SettingsOfficeModalComponent,
          {
            size: 'small',
          },
          { ...data.type }
        );
        break;
      }
      case 'repairshop': {
        this.modalService.openModal(
          SettingsRepairshopModalComponent,
          {
            size: 'small',
          },
          { ...data.type }
        );
        break;
      }
      case 'terminal': {
        this.modalService.openModal(
          SettingsTerminalModalComponent,
          {
            size: 'small',
          },
          { ...data.type }
        );
        break;
      }
      default:
        break;
    }
  }

  // Location Parking
  public deleteCompanyParkingById(id: number): Observable<any> {
    return this.companyParkingService.apiParkingIdDelete(id);
  }

  public getCompanyParkingById(id: number): Observable<ParkingResponse> {
    return this.companyParkingService.apiParkingIdGet(id);
  }

  public addCompanyParking(
    data: CreateParkingCommand
  ): Observable<CreateResponse> {
    return this.companyParkingService.apiParkingPost(data);
  }

  public updateCompanyParking(data: UpdateParkingCommand): Observable<any> {
    return this.companyParkingService.apiParkingPut(data);
  }

  // Location Office
  public deleteCompanyOfficeById(id: number): Observable<any> {
    return this.companyOfficeService.apiCompanyofficeIdDelete(id);
  }

  public getCompanyOfficeById(id: number): Observable<CompanyOfficeResponse> {
    return this.companyOfficeService.apiCompanyofficeIdGet(id);
  }

  public getModalDropdowns(): Observable<CompanyOfficeModalResponse> {
    return this.companyOfficeService.apiCompanyofficeModalGet();
  }

  public addCompanyOffice(
    data: CreateCompanyOfficeCommand
  ): Observable<CreateResponse> {
    return this.companyOfficeService.apiCompanyofficePost(data);
  }

  public updateCompanyOffice(
    data: UpdateCompanyOfficeCommand
  ): Observable<any> {
    return this.companyOfficeService.apiCompanyofficePut(data);
  }
}
