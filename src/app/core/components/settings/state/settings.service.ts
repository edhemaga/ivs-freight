import { SettingsTerminalModalComponent } from './../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { SettingsRepairshopModalComponent } from './../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsOfficeModalComponent } from './../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from './../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SettingsStore } from './settings.store';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { SettingsBasicModalComponent } from '../settings-company/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../settings-company/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../settings-company/company-modals/settings-factoring-modal/settings-factoring-modal.component';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  public isModalActive$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private settingsStore: SettingsStore,
    private customModalService: CustomModalService,
    private http: HttpClient
  ) {}

  /**
   * Open Modal
   * @param type - is modal active
   * @param modalName - modal name
   * @param action - type of tab-switcher to be active
   */
  public onModalAction(data: {
    type: boolean;
    modalName: string;
    action?: string;
  }) {
    switch (data.modalName) {
      case 'basic': {
        if (data.type) {
          this.customModalService.openModal(
            SettingsBasicModalComponent,
            null,
            null,
            { size: 'small' }
          );
        }
        break;
      }
      case 'insurance-policy': {
        if (data.type) {
          this.customModalService.openModal(
            SettingsInsurancePolicyModalComponent,
            null,
            null,
            { size: 'small' }
          );
        }
        break;
      }
      case 'factoring': {
        this.customModalService.openModal(
          SettingsFactoringModalComponent,
          null,
          null,
          { size: 'small' }
        );
        break;
      }
      case 'parking': {
        this.customModalService.openModal(
          SettingsParkingModalComponent,
          null,
          null,
          { size: 'small' }
        );
        break;
      }
      case 'office': {
        this.customModalService.openModal(
          SettingsOfficeModalComponent,
          null,
          null,
          { size: 'small' }
        );
        break;
      }
      case 'repairshop': {
        this.customModalService.openModal(
          SettingsRepairshopModalComponent,
          null,
          null,
          { size: 'small' }
        );
        break;
      }
      case 'terminal': {
        this.customModalService.openModal(
          SettingsTerminalModalComponent,
          null,
          null,
          { size: 'small' }
        );
        break;
      }
      default:
        break;
    }
    this.isModalActive$.next(true);
  }
}
