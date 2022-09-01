import { Component, OnInit } from '@angular/core';
import * as AppConst from 'src/app/const';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@UntilDestroy()
@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent implements OnInit {
  dashboardMapSwitchTabs: any[] = [];

  agmMap: any;
  styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  mapLatitude: number = 41.860119;
  mapLongitude: number = -87.660156;
  mapZoom: number = 1;

  public searchDashboardOptions = {
    gridNameTitle: 'Map',
  };

  constructor(private tableService: TruckassistTableService) {}

  ngOnInit(): void {
    this.dashboardMapSwitchTabs = [
      {
        name: 'GPS Device',
      },
      {
        name: 'Mobile App',
      },
    ];

    this.tableService.currentSearchTableData
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          // your search code here
        }
      });
  }

  changeMapSwitchTabs(ev) {}
}
