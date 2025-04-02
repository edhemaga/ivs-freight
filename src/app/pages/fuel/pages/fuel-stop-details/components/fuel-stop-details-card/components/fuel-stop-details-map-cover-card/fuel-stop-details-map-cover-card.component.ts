import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import {
    CaMapComponent,
    CaTabSwitchComponent,
    ICaMapProps,
    IMapMarkers,
    MapMarkerIconService,
    MapOptionsConstants,
} from 'ca-components';

// constants
import { FuelStopDetailsCardConstants } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/utils/constants';

// models
import { FuelStopResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models';

// services
import { MapsService } from '@shared/services/maps.service';

// enums
import { TableStringEnum } from '@shared/enums';

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
        CaTabSwitchComponent,
        TaUploadFilesComponent,
        CaMapComponent,
    ],
})
export class FuelStopDetailsMapCoverCardComponent implements AfterViewInit {
    @Input() set cardData(data: FuelStopResponse) {
        this.createMapCoverCardData(data);
    }

    public _cardData: FuelStopResponse;

    public mapLocationCoverTabs: Tabs[] = [];
    public selectedTabId: number = 1;

    public mapData: ICaMapProps = MapOptionsConstants.DEFAULT_MAP_CONFIG;

    constructor(
        private router: Router,
        private mapsService: MapsService,
        private markerIconService: MapMarkerIconService
    ) {}

    ngAfterViewInit(): void {
        this.setMapData(this._cardData);
    }

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

    public setMapData(data: FuelStopResponse): void {
        const markerIcon = this.markerIconService.getMarkerIcon(
            data.id,
            data.address?.address,
            data.isClosed,
            false,
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
            isClosed: data.isClosed,
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

        const fuelTableView = {
            tabSelected: TableStringEnum.FUEL_STOP,
            viewMode: TableStringEnum.MAP,
        };

        localStorage.setItem(
            TableStringEnum.FUEL_TABLE_VIEW,
            JSON.stringify(fuelTableView)
        );

        this.router.navigate(['/list/fuel']);
    }
}
