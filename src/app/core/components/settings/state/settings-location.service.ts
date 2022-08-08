import { Injectable } from '@angular/core';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { SettingsOfficeModalComponent } from '../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsRepairshopModalComponent } from '../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsTerminalModalComponent } from '../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';

@Injectable({
  providedIn: 'root',
})
export class SettingsLocationService {
  constructor(private modalService: ModalService) {}

  /**
   * Open Modal
   * @param type - is modal active
   * @param modalName - modal name
   * @param action - type of tab-switcher to be active
   */
  public onModalAction(data: {
    modalName: string;
    type?: string;
    company?: any;
  }) {
    switch (data.modalName) {
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
  }
}
