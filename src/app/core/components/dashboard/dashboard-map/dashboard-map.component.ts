import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as AppConst from 'src/app/const';

import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-dashboard-map',
    templateUrl: './dashboard-map.component.html',
    styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

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
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    // your search code here
                }
            });
    }

    changeMapSwitchTabs(ev) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
