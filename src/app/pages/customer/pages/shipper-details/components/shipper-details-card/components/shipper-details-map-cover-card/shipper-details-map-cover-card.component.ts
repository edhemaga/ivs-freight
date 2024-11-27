import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { CaMapComponent, ICaMapProps } from 'ca-components';

// constants
import { RepairShopDetailsCardConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';
import { ShipperMapConfig } from '@pages/customer/pages/customer-table/utils/constants';

// models
import { ShipperResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';
import { RepairShopMapMarkersHelper } from '@pages/repair/pages/repair-table/utils/helpers';

@Component({
    selector: 'app-shipper-details-map-cover-card',
    templateUrl: './shipper-details-map-cover-card.component.html',
    styleUrls: ['./shipper-details-map-cover-card.component.scss'],
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
export class ShipperDetailsMapCoverCardComponent {
    @Input() set cardData(data: ShipperResponse) {
        this.createMapCoverCardData(data);
    }

    public _cardData: ShipperResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    public mapData: ICaMapProps = ShipperMapConfig.shipperMapConfig;

    private createMapCoverCardData(data: ShipperResponse): void {
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

    public setMapData(data: ShipperResponse): void {
        const markerData = {
            position: {
                lat: data.latitude,
                lng: data.longitude,
            },
            icon: {
                url: RepairShopMapMarkersHelper.getMapMarker(
                    false,
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
