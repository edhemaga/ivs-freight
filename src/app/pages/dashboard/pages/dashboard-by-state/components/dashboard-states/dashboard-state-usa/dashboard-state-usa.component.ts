import { Component, Input, ChangeDetectorRef } from '@angular/core';

// models
import { MapStates } from '@pages/dashboard/pages/dashboard-by-state/models/map-states.model';
import { MapListItem } from '@pages/dashboard/pages/dashboard-by-state/models/map-list-item.model';

@Component({
    selector: 'app-dashboard-state-usa',
    templateUrl: './dashboard-state-usa.component.html',
    styleUrls: ['./dashboard-state-usa.component.scss'],
})
export class DashboardStateUsaComponent {
    @Input() usaStates: MapStates;
    @Input() selectedTab: string;

    public currentState: MapListItem;
    public currentStateHovered: string;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public handleStateHover(
        stateShortName: string,
        isRemovingHover: boolean
    ): void {
        if (!isRemovingHover) {
            const selectedState = this.usaStates[stateShortName];

            this.currentState = {
                state: selectedState.state,
                selectedColor: selectedState.color,
                value: selectedState.value,
                percent: selectedState.percent,
            };

            this.currentStateHovered = stateShortName;
        } else {
            this.currentState = null;
            this.currentStateHovered = null;
        }

        this.changeDetectorRef.detectChanges();
    }
}
