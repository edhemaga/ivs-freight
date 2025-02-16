import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// svg routes
import { OpenHoursDropdownSvgRoutes } from '@shared/components/ta-open-hours-dropdown/utils/svg-routes';

// models
import {
    OpenHoursTodayResponse,
    RepairShopOpenHoursResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-ta-open-hours-dropdown',
    templateUrl: './ta-open-hours-dropdown.component.html',
    styleUrls: ['./ta-open-hours-dropdown.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbModule,
        AngularSvgIconModule,

        // components
        TaAppTooltipV2Component,
    ],
})
export class TaOpenHoursDropdownComponent {
    @Input() dropdownConfig: {
        rowId?: number;
        width?: number;
        openHours: RepairShopOpenHoursResponse[];
        openHoursToday: OpenHoursTodayResponse;
    };

    public openHoursDropdownSvgRoutes = OpenHoursDropdownSvgRoutes;

    ngOnInit() {
        console.log('dropdownConfig', this.dropdownConfig);
    }

    public openHoursDropdownActiveId: number = -1;

    public onShowOpenHoursDropdown(popover: NgbPopover): void {
        let data = [];

        this.dropdownConfig?.openHours?.forEach((workingDay) => {
            const { dayOfWeek, startTime, endTime } = workingDay;

            const workingHourItem = {
                workingDays: dayOfWeek,
                workingHours: `${startTime} - ${endTime}`,
            };

            data = [...data, workingHourItem];
        });

        this.openHoursDropdownActiveId = popover.isOpen()
            ? -1
            : this.dropdownConfig?.rowId;

        popover.isOpen() ? popover.close() : popover.open({ data });
    }
}
