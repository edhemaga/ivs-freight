import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { CaMapComponent } from 'ca-components';

// constants
import { FuelStopDetailsCardConstants } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/utils/constants';

// models
import { FuelStopResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models';

@Component({
    selector: 'app-fuel-stop-details-map-cover-card',
    templateUrl: './fuel-stop-details-map-cover-card.component.html',
    styleUrl: './fuel-stop-details-map-cover-card.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
        TaTabSwitchComponent,
        TaUploadFilesComponent,
        CaMapComponent,
    ],
})
export class FuelStopDetailsMapCoverCardComponent {
    @Input() set cardData(data: FuelStopResponse) {
        this.createMapCoverCardData(data);
    }

    public _cardData: FuelStopResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    constructor() {}

    private createMapCoverCardData(data: FuelStopResponse): void {
        this._cardData = data;

        this.mapLocationCoverTabs =
            FuelStopDetailsCardConstants.MAP_LOCATION_COVER_TABS.map(
                (tab, index) => ({
                    ...tab,
                    disabled:
                        index === 1
                            ? !this._cardData?.cover?.url
                            : tab.disabled,
                })
            );
    }

    public onTabChange(tab: Tabs): void {
        this.selectedTabId = tab.id;
    }
}
