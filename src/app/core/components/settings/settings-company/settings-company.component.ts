import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsBasicModalComponent } from './company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from './company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from './company-modals/settings-factoring-modal/settings-factoring-modal.component';

import { SettingsStoreService } from './../state/settings.service';
import { CustomModalService } from './../../../services/modals/custom-modal.service';

import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsCompanyComponent implements OnInit {
  public isModalOpen: boolean = false; // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
  public data: any[] = ['1'];

  private destroy$ = new Subject<void>();

  constructor(
    private settingsStoreService: SettingsStoreService,
    private customModalService: CustomModalService
  ) {}

  ngOnInit(): void {
    this.settingsStoreService.modalSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe((modal) => {
        this.isModalOpen = modal.type;

        this.onModalAction(modal.type, modal.modalName);
      });
  }

  public onModalAction(type: boolean, modalName: string) {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
