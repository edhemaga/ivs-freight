import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// constants
import { DashboardStateConstants } from '../../../state/utils/constants/dashboard-state.constants';

// models
import { MapStates } from '../../../state/models/dashboard-state-models/map-states.model';
import { MapListItem } from '../../../state/models/dashboard-state-models/map-list-item.model';

@Component({
    selector: 'app-dashboard-state-tracking',
    templateUrl: './dashboard-state-tracking.component.html',
    styleUrls: ['./dashboard-state-tracking.component.scss'],
})
export class DashboardStateTrackingComponent implements OnChanges {
    @Input() selectedMapList: MapListItem;
    @Input() selectedTab: string;

    public usaStates: MapStates;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.selectedMapList?.currentValue.length !==
            changes.selectedMapList?.previousValue
        ) {
            this.setUsaStates();

            this.setSelectedStates(changes.selectedMapList.currentValue);
        }
    }

    private setUsaStates(): void {
        this.usaStates = JSON.parse(
            JSON.stringify(DashboardStateConstants.usaStates)
        );
    }

    private setSelectedStates(selectedMapList: MapListItem[]): void {
        selectedMapList.map((selectedMapItem) => {
            const selectedState = this.usaStates[selectedMapItem.state];

            selectedState.color = selectedMapItem.selectedColor;
            selectedState.value = selectedMapItem.value;
            selectedState.percent = selectedMapItem.percent;
        });
    }
}
