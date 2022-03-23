import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SettingsStore } from './settings.store';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { SettingsBasicModalComponent } from '../settings-company/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../settings-company/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../settings-company/company-modals/settings-factoring-modal/settings-factoring-modal.component';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {

  public isModalActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
  public onModalAction(type: boolean, modalName: string, action?: string) {
    if (type && modalName === 'basic') {
      this.customModalService.openModal(
        SettingsBasicModalComponent,
        null,
        null,
        { size: 'small' }
      );
    } else if (type && modalName === 'insurance-policy') {
      console.log(modalName);
      this.customModalService.openModal(
        SettingsInsurancePolicyModalComponent,
        null,
        null,
        { size: 'small' }
      );
    } else if (type && modalName === 'factoring') {
      this.customModalService.openModal(
        SettingsFactoringModalComponent,
        null,
        null,
        { size: 'small' }
      );
    }
    this.isModalActive$.next(true);
  }
}
