import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

// constants
import { RepairShopDetailsCardConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';

// models
import { RepairShopResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';

@Component({
    selector: 'app-repair-shop-details-map-cover-card',
    templateUrl: './repair-shop-details-map-cover-card.component.html',
    styleUrls: ['./repair-shop-details-map-cover-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
        TaTabSwitchComponent,
        TaUploadFilesComponent,
    ],
})
export class RepairShopDetailsMapCoverCardComponent {
    @Input() set cardData(data: RepairShopResponse) {
        this.createMapCoverCardData(data);
    }

    public _cardData: RepairShopResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    private createMapCoverCardData(data: RepairShopResponse): void {
        this._cardData = data;

        this.mapLocationCoverTabs =
            RepairShopDetailsCardConstants.MAP_LOCATION_COVER_TABS.map(
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
