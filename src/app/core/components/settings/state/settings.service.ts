import { Observable } from 'rxjs';
import { SettingsTerminalModalComponent } from './../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { SettingsRepairshopModalComponent } from './../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsOfficeModalComponent } from './../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from './../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SettingsStore } from './settings.store';
import { SettingsBasicModalComponent } from '../settings-company/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../settings-company/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../settings-company/company-modals/settings-factoring-modal/settings-factoring-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { CompanyResponse, CompanyService } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  public isModalActive$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private settingsStore: SettingsStore,
    private modalService: ModalService,
    private settingCompanyService: CompanyService,
    private http: HttpClient
  ) {}

  /**
   * Open Modal
   * @param type - is modal active
   * @param modalName - modal name
   * @param action - type of tab-switcher to be active
   */
  public onModalAction(data: { modalName: string; action?: string }) {
    switch (data.modalName) {
      case 'basic': {
        this.modalService.openModal(
          SettingsBasicModalComponent,
          {
            size: 'medium',
          },
          {
            type: data.action,
          }
        );
        break;
      }
      case 'insurance-policy': {
        this.modalService.openModal(SettingsInsurancePolicyModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'factoring': {
        this.modalService.openModal(SettingsFactoringModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'parking': {
        this.modalService.openModal(SettingsParkingModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'office': {
        this.modalService.openModal(SettingsOfficeModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'repairshop': {
        this.modalService.openModal(SettingsRepairshopModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'terminal': {
        this.modalService.openModal(SettingsTerminalModalComponent, {
          size: 'small',
        });
        break;
      }
      default:
        break;
    }
    this.isModalActive$.next(true);
  }
  public getCompany(): Observable<CompanyResponse> {
    return this.settingCompanyService.apiCompanyGet();
  }
  public getCompanyDivisionById(id: number): Observable<any> {
    return this.settingCompanyService.apiCompanyDivisionIdGet(id);
  }
}
