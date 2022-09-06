import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OfficeStore } from '../settings-location/settings-office/state/company-office.store';
import { ParkingStore } from '../settings-location/settings-parking/parking-state/company-parking.store';
import { CompanyRepairShopStore } from '../settings-location/settings-repair-shop/state/company-repairshop.store';
import { TerminalStore } from '../settings-location/settings-terminal/state/company-terminal.store';
import { CompanyStore } from '../state/company-state/company-settings.store';

@Component({
  selector: 'app-settings-toolbar',
  templateUrl: './settings-toolbar.component.html',
  styleUrls: ['./settings-toolbar.component.scss'],
})
export class SettingsToolbarComponent implements OnInit {
  public countLocation: number;
  public settingsToolbar: any;

  constructor(
    private companyStore: CompanyStore,
    private terminalStore: TerminalStore,
    private comRShopStore: CompanyRepairShopStore,
    private parkingStore: ParkingStore,
    private officeStore: OfficeStore
  ) {}

  ngOnInit(): void {
    let countLocation;
    countLocation =
      this.terminalStore.getValue().ids.length +
      this.comRShopStore.getValue().ids.length +
      this.parkingStore.getValue().ids.length +
      this.officeStore.getValue().ids.length;
    this.settingsToolbar = [
      {
        id: 1,
        name: 'Settings',
        count: null,
        svg: null,
        background: '#FFFFFF',
        route: null,
      },
      {
        id: 2,
        name: 'Company',
        count:
          this.companyStore.getValue()?.entities[
            this.companyStore.getValue()?.ids[0]
          ]?.divisions?.length,
        svg: 'ic_company.svg',
        background: '#FFFFFF',
        route: '/settings/company',
      },
      {
        id: 3,
        name: 'Location',
        count: countLocation,
        svg: 'assets/svg/common/ic_location.svg',
        background: '#FFFFFF',
        route: '/settings/location',
      },
      {
        id: 4,
        name: 'Document',
        count: 9,
        svg: 'assets/svg/common/ic_document.svg',
        background: '#FFFFFF',
        route: '/settings/document',
      },
      {
        id: 5,
        name: 'Billing',
        count: 10,
        svg: 'assets/svg/common/ic_billing.svg',
        background: '#FFFFFF',
        route: '/settings/billing',
      },
      {
        id: 6,
        name: 'User',
        count: 15,
        svg: 'assets/svg/common/ic_user.svg',
        background: '#FFFFFF',
        route: '/settings/user',
      },
      {
        id: 7,
        name: 'Integration',
        count: 4,
        svg: 'assets/svg/common/ic_integration.svg',
        background: '#FFFFFF',
        route: '/settings/integration',
      },
      {
        id: 8,
        name: null,
        count: null,
        svg: null,
        background: '#FFFFFF',
        route: null,
      },
    ];
  }
  public identity(index: number, item: any): number {
    return item.id;
  }
}
