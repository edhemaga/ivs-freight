import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsStoreService } from '../state/settings.service';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { SettingsBasicModalComponent } from '../settings-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../settings-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../settings-modals/settings-factoring-modal/settings-factoring-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  public isModalOpen: boolean = false; // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
  public data: any[] = null;

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
      console.log(modalName)
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
