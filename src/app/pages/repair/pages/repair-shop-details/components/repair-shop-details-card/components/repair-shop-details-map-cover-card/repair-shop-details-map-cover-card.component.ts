import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { CaMapComponent, ICaMapProps } from 'ca-components';

// constants
import { RepairShopDetailsCardConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';
import { RepairShopMapConfig } from '@pages/repair/pages/repair-table/utils/constants/repair-shop-map.config';

// models
import { RepairShopResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';
import { RepairShopMapMarkersHelper } from '@pages/repair/pages/repair-table/utils/helpers';

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
        CaMapComponent,
    ],
})
export class RepairShopDetailsMapCoverCardComponent {
    @Input() set cardData(data: RepairShopResponse) {
        this.createMapCoverCardData(data);
    }

    public _cardData: RepairShopResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    public mapData: ICaMapProps = RepairShopMapConfig.repairShopMapConfig;

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

        this.setMapData(data);
    }

    public onTabChange(tab: Tabs): void {
        this.selectedTabId = tab.id;
    }

    public setMapData(data: RepairShopResponse): void {
        const markerData = {
            position: {
                lat: data.latitude,
                lng: data.longitude,
            },
            icon: {
                url: RepairShopMapMarkersHelper.getMapMarker(
                    data.pinned,
                    !data.status
                ),
                labelOrigin: new google.maps.Point(95, 25),
                scaledSize: new google.maps.Size(45, 50),
            },
            infoWindowContent: null,
            label: data.address?.address
                ? {
                      text: data.address.address,
                      fontSize: '11px',
                      color: '#424242',
                      fontWeight: '700',
                      isShowOnHover: true,
                  }
                : null,
            labelOrigin: { x: 90, y: 15 },
            options: {
                zIndex: 1,
                animation: google.maps.Animation.DROP,
                cursor: 'default',
            },
            isLargeMarker: true,
            data,
        };

        this.mapData = {
            ...this.mapData,
            isZoomShown: true,
            isOpenInMapShown: true,
            markers: [markerData],
        };
    }

    public onOpenInMap(): void {}
}
