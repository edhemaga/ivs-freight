import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { CaMapComponent, ICaMapProps, IMapMarkers, MapMarkerIconService } from 'ca-components';

// constants
import { RepairShopDetailsCardConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';
import { ShipperMapConfig } from '@pages/customer/pages/customer-table/utils/constants';

// models
import { ShipperResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';

// services
import { MapsService } from '@shared/services/maps.service';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

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
export class ShipperDetailsMapCoverCardComponent implements AfterViewInit {
    @Input() set cardData(data: ShipperResponse) {
        this.createMapCoverCardData(data);
    }

    ngAfterViewInit(): void {
        this.setMapData(this._cardData);
    }

    public _cardData: ShipperResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    public mapData: ICaMapProps = ShipperMapConfig.shipperMapConfig;

    constructor(
        private router: Router,
        private mapsService: MapsService,
        private markerIconService: MapMarkerIconService,
    ) {}

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
    }

    public onTabChange(tab: Tabs): void {
        this.selectedTabId = tab.id;
    }

    public setMapData(data: ShipperResponse): void {
        const markerIcon = this.markerIconService.getMarkerIcon(
            data.id,
            data.address?.address,
            !data.status,
            false,
            true
        );

        console.log('markerIcon', markerIcon);

        const markerData: IMapMarkers = {
            position: {
                lat: data.latitude,
                lng: data.longitude,
            },
            id: data.id,
            infoWindowContent: null,
            label: data.address?.address,
            isLargeMarker: true,
            isShowLabelOnHover: true,
            isClosed: !data.status,
            content: markerIcon,
            data,
        };

        this.mapData = {
            ...this.mapData,
            isZoomShown: true,
            isOpenInMapShown: true,
            markers: [markerData],
        };
    }

    public onOpenInMap(): void {
        this.mapsService.selectedMarker(this._cardData.id);

        const customerTableView = {
            tabSelected: TableStringEnum.INACTIVE,
            viewMode: TableStringEnum.MAP,
        };

        localStorage.setItem(
            TableStringEnum.CUSTOMER_TABLE_VIEW,
            JSON.stringify(customerTableView)
        );

        this.router.navigate(['/list/customer']);
    }
}
