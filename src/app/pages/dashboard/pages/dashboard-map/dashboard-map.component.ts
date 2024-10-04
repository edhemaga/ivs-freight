import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

// constants
import { MapConstants } from '@shared/utils/constants/map.constants';

@Component({
    selector: 'app-dashboard-map',
    templateUrl: './dashboard-map.component.html',
    styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    dashboardMapSwitchTabs: any[] = [];

    data: any = {
        center: {
            lat: 41.860119,
            lng: -87.660156,
        },
        mapZoom: 1,
        markers: [],
        clustermarkers: [],
        routingMarkers: [],
        mapOptions: {
            fullscreenControl: false,
            disableDefaultUI: true,
            restriction: {
                latLngBounds: {
                    north: 75,
                    south: 9,
                    west: -170,
                    east: -50,
                },
                strictBounds: true,
            },
            streetViewControl: false,
            styles: [
                {
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#f5f5f5',
                        },
                    ],
                },
                {
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'on',
                        },
                    ],
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'transit',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'administrative.country',
                    stylers: [
                        {
                            color: '#616161',
                        },
                        {
                            visibility: 'on',
                        },
                        {
                            weight: 1,
                        },
                    ],
                },
                {
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#616161',
                        },
                    ],
                },
                {
                    elementType: 'labels.text.stroke',
                    stylers: [
                        {
                            color: '#f5f5f5',
                        },
                    ],
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#bdbdbd',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#eeeeee',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#757575',
                        },
                    ],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#e5e5e5',
                        },
                    ],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
                {
                    featureType: 'landscape',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#ffffff',
                        },
                    ],
                },
                {
                    featureType: 'road',
                    stylers: [
                        {
                            saturation: -100,
                        },
                        {
                            lightness: 30,
                        },
                    ],
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#757575',
                        },
                    ],
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#dadada',
                        },
                    ],
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#616161',
                        },
                    ],
                },
                {
                    featureType: 'road.local',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
                {
                    featureType: 'transit.line',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#e5e5e5',
                        },
                    ],
                },
                {
                    featureType: 'transit.station',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#eeeeee',
                        },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#c9c9c9',
                        },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
            ],
            keyboardShortcuts: false,
            panControl: true,
            gestureHandling: 'greedy',
        },
    };

    agmMap: any;
    styles: any = MapConstants.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: MapConstants.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };
    mapLatitude: number = 41.860119;
    mapLongitude: number = -87.660156;
    mapZoom: number = 1;

    constructor() {}

    ngOnInit(): void {
        this.dashboardMapSwitchTabs = [
            {
                name: 'GPS Device',
            },
            {
                name: 'Mobile App',
            },
        ];
    }

    changeMapSwitchTabs(_) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
