import { Component } from '@angular/core';
import { SettingsStoreService } from '../state/settings.service';

@Component({
  selector: 'app-settings-payroll',
  templateUrl: './settings-payroll.component.html',
  styleUrls: ['./settings-payroll.component.scss']
})
export class SettingsPayrollComponent {

  constructor(private settingsStoreService: SettingsStoreService) { }

  public onAction(modal: {modalName: string, type: boolean, action: string}) {
    this.settingsStoreService.modalSubject$.next(modal);
  }

}
