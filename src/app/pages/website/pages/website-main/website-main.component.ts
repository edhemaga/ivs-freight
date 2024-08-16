import { Component, OnInit } from '@angular/core';
import { MapConstants } from '@shared/utils/constants/map.constants';

@Component({
    selector: 'app-website-main',
    templateUrl: './website-main.component.html',
    styleUrls: ['./website-main.component.scss'],
})
export class WebsiteMainComponent implements OnInit {
    constructor() {}

    public data =  {
        center: { lat: 41.860119, lng: -87.660156 },
        mapZoom: 1,
        markers: [
            {
                position: { lat: 41.860119, lng: -87.660156 },
                icon: {
                    url: 'svg/map/marker.svg',
                    labelOrigin: new google.maps.Point(90, 15),
                },
                infoWindowContent: 'chicago',
                label: {
                    text: 'GRAND CENTRAL PARKING',
                    fontSize: '10px',
                    color: 'grey',
                    fontWeight: '400',
                },
                labelOrigin: { x: 90, y: 15 },
            },
            {
                position: { lat: 34.0575929993607, lng: -118.2620935496002 },
                icon: {
                    url: 'svg/map/marker_2.svg',
                    labelOrigin: new google.maps.Point(80, 15),
                },
                infoWindowContent: 'Los Angeles',
                label: {
                    text: 'CMA ALTAIRE OFFICE',
                    fontSize: '10px',
                    color: 'grey',
                    fontWeight: '400',
                },
                labelOrigin: { x: 80, y: 15 },
            },
            {
                position: { lat: 40.71298681021848, lng: -74.00578496193896 },
                icon: {
                    url: 'svg/map/marker_3.svg',
                    labelOrigin: new google.maps.Point(85, 15),
                },
                infoWindowContent: 'New York',
                label: {
                    text: 'NIAGARA BOTTLING, LLC',
                    fontSize: '10px',
                    color: 'grey',
                    fontWeight: '400',
                },
                labelOrigin: { x: 85, y: 15 },
            },
            {
                position: { lat: 36.17478769085862, lng: -115.14136650349738 },
                icon: {
                    url: 'svg/map/marker_4.svg',
                    labelOrigin: new google.maps.Point(80, 15),
                },
                infoWindowContent: 'Las Vegas',
                label: {
                    text: 'CMA ALTAIRE OFFICE',
                    fontSize: '10px',
                    color: 'grey',
                    fontWeight: '400',
                },
                labelOrigin: { x: 80, y: 15 },
            },
        ],
        clustermarkers: [],
        routingMarkers: [],
        mapOptions: {
            restriction: {
                latLngBounds: MapConstants.NORTH_AMERICA_BOUNDS,
                strictBounds: true,
            },
            streetViewControl: false,
            styles: MapConstants.GOOGLE_MAP_STYLES,
            keyboardShortcuts: false,
            panControl: true,
            gestureHandling: 'greedy',
        },
    };

    ngOnInit(): void {}
}
