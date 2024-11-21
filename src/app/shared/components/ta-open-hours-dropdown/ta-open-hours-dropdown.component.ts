import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// svg routes
import { OpenHoursDropdownSvgRoutes } from '@shared/components/ta-open-hours-dropdown/utils/svg-routes';

// models
import { RepairShopOpenHoursCommand } from 'appcoretruckassist';

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
    @Input() componentData: {
        rowId?: number;
        width?: number;
        openHours: RepairShopOpenHoursCommand[];
        openHoursToday: any; // w8 for back
    };

    public openHoursDropdownSvgRoutes = OpenHoursDropdownSvgRoutes;

    public openHoursDropdownActiveId: number = -1;

    public trackByIdentity = <T>(index: number, _: T): number => index;

    public onShowOpenHoursDropdown(popover: NgbPopover): void {
        let data = [];

        this.componentData?.openHours?.forEach(
            (dayOfWeek: RepairShopOpenHoursCommand) => {
                const startTime =
                    MethodsCalculationsHelper.convertTimeFromBackendBadFormat(
                        dayOfWeek?.startTime
                    );
                const endTime =
                    MethodsCalculationsHelper.convertTimeFromBackendBadFormat(
                        dayOfWeek?.endTime
                    );

                const workingHourItem = {
                    workingDays: dayOfWeek?.dayOfWeek,
                    workingHours: `${startTime} - ${endTime}`,
                };

                data = [...data, workingHourItem];
            }
        );

        if (popover.isOpen()) {
            popover.close();

            this.openHoursDropdownActiveId = -1;
        } else {
            popover.open({ data });

            this.openHoursDropdownActiveId = this.componentData?.rowId;
        }
    }
}
