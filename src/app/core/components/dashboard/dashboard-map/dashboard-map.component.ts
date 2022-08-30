import { Component, OnInit } from '@angular/core';
import * as AppConst from 'src/app/const';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss']
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

  constructor() { }

  ngOnInit(): void {
    this.dashboardMapSwitchTabs = [
      {
        name: 'GPS Device'
      },
      {
        name: 'Mobile App'
      }
    ];
  }

  changeMapSwitchTabs(ev){

  }

}
