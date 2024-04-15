import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

// constants
import { MapConstants } from '@shared/utils/constants/map.constants';

@Component({
    selector: 'app-dashboard-map',
    templateUrl: './dashboard-map.component.html',
    styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    dashboardMapSwitchTabs: any[] = [];

    agmMap: any;
    styles: any = MapConstants.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: MapConstants.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };
    mapLatitude: number = 41.860119;
    mapLongitude: number = -87.660156;
    mapZoom: number = 1;

    constructor() {}

    ngOnInit(): void {
        this.dashboardMapSwitchTabs = [
            {
                name: 'GPS Device',
            },
            {
                name: 'Mobile App',
            },
        ];
    }

    changeMapSwitchTabs(_) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
