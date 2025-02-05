import { AfterViewInit, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import {
    CaMapComponent,
    ICaMapProps,
    IMapMarkers,
    MapMarkerIconService,
} from 'ca-components';

// constants
import { RepairShopDetailsCardConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';
import { RepairShopMapConfig } from '@pages/repair/pages/repair-table/utils/constants/repair-shop-map.config';

// services
import { MapsService } from '@shared/services/maps.service';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

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
        CaMapComponent,
    ],
})
export class RepairShopDetailsMapCoverCardComponent implements AfterViewInit {
    @Input() set cardData(data: RepairShopResponse) {
        this.createMapCoverCardData(data);
    }

    public _cardData: RepairShopResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    public mapData: ICaMapProps = RepairShopMapConfig.repairShopMapConfig;

    constructor(
        private router: Router,

        // services
        private mapsService: MapsService,
        private markerIconService: MapMarkerIconService
    ) {}

    ngAfterViewInit(): void {
        this.setMapData(this._cardData);
    }

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

    public setMapData(data: RepairShopResponse): void {
        const markerIcon = this.markerIconService.getMarkerIcon(
            data.id,
            data.address?.address,
            !data.status,
            data.pinned,
            true
        );

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
        this.markerIconService.resetMarkersData();

        this.mapsService.selectedMarker(this._cardData.id);

        const repairTableView = {
            tabSelected: TableStringEnum.REPAIR_SHOP,
            viewMode: TableStringEnum.MAP,
        };

        localStorage.setItem(
            TableStringEnum.REPAIR_TABLE_VIEW,
            JSON.stringify(repairTableView)
        );

        this.router.navigate([RepairShopDetailsStringEnum.REPAIR_LIST_ROUTE]);
    }
}
