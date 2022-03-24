import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsStoreService } from './../state/settings.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsCompanyComponent implements OnInit {
  public isModalOpen$: Observable<boolean> = of(false); // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
  public data: any[] = ['1'];

  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnInit(): void {
    this.isModalOpen$ = this.settingsStoreService.isModalActive$;
  }

}
