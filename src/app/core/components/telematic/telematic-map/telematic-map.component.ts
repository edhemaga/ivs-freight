import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as AppConst from '../../../../const';
import { SignalRService } from './../../../services/dispatchboard/app-signalr.service';
import { MapsService } from '../../../services/shared/maps.service';
import { TelematicStateService } from '../state/telematic-state.service';
import { GpsServiceService } from '../../../../global/services/gps-service.service';

@Component({
    selector: 'app-telematic-map',
    templateUrl: './telematic-map.component.html',
    styleUrls: [
        './telematic-map.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class TelematicMapComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    agmMap: any;
    styles = AppConst.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };
    mapLatitude: number = 41.860119;
    mapLongitude: number = -87.660156;
    mapZoom: number = 1;
    mapHover: boolean = false;

    driverLocations: any[] = [];
    driverDestinations: any[] = [];

    gpsAssignedData: any[] = [];
    gpsUnassignedData: any[] = [];

    routeLineOptions: any = {};

    constructor(
        private signalRService: SignalRService,
        private mapsService: MapsService,
        private telematicService: TelematicStateService,
        private gpsService: GpsServiceService
    ) {}

    ngOnInit(): void {
      this.telematicService.startGpsConnection();
      this.gpsService.gpsStatusChange
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          let driverIndex = this.driverLocations.findIndex(
            (device) => device.deviceId === data.deviceId
          );

          if ( driverIndex == -1 ) {
            this.driverLocations.push(data);
          } else {
            this.driverLocations[driverIndex] = data;
            console.log('update device', this.driverLocations[driverIndex]);
          }
        });

        // this.driverLocations = [
        //   {
        //     latitude: 40.037375,
        //     longitude: -95.284267,
        //     heading: 45,
        //     deviceId: 1211211211,
        //     speed: 0
        //   },
        //   {
        //     latitude: 29.108181,
        //     longitude: -104.738062,
        //     heading: 125,
        //     deviceId: 1221221221,
        //     speed: 73.68
        //   },
        //   {
        //     latitude: 37.747531,
        //     longitude: -111.942789,
        //     heading: 277,
        //     deviceId: 1231231231,
        //     speed: 72.25
        //   }
        // ];

        this.driverDestinations = [
            // {
            //   latitude: 42.037375,
            //   longitude: -88.284267
            // },
            // {
            //   latitude: 31.108181,
            //   longitude: -97.738062
            // },
            // {
            //   latitude: 39.747531,
            //   longitude: -104.942789
            // }
        ];

        this.getGpsData();
        this.getUnassignedGpsData();
    }

    zoomChange(event) {
        this.mapZoom = event;
    }

    getMapInstance(map) {
        this.agmMap = map;

        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            scale: 3,
        };

        this.routeLineOptions = new google.maps.Polyline({
            strokeColor: '#6C6C6C',
            strokeOpacity: 0,
            icons: [
                {
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '12px',
                },
            ],
        });
    }

    markerClick(index) {
        this.driverLocations.map((location, i) => {
            if (i == index) {
                location.isFocused = !location.isFocused;
            } else {
                location.isFocused = false;
            }
        });
    }

    getGpsData() {
        this.telematicService
            .getAllGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                console.log('getGpsData', gpsData);
                this.gpsAssignedData = gpsData.data;
                this.driverLocations = [...this.driverLocations, ...gpsData.data];
                console.log('driverLocations', this.driverLocations);
            });
    }

    getUnassignedGpsData() {
        this.telematicService
            .getUnassignedGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                console.log('getUnassignedGpsData', gpsData);
                this.gpsUnassignedData = gpsData.data;
                this.driverLocations = [...this.driverLocations, ...gpsData.data];
                console.log('driverLocations', this.driverLocations);
            });
    }

    getDataByDeviceId(deviceId) {
      this.telematicService
          .getDeviceData(deviceId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((deviceData: any) => {
              console.log('getDataByDeviceId deviceData', deviceData);
              deviceData.transform = 'translate(-3309.177px, 10942px) rotate('+deviceData.heading+'deg)';

              let driverIndex = this.driverLocations.findIndex(
                (device) => device.deviceId === deviceId
              );

              if ( driverIndex == -1 ) {
                this.driverLocations.push(deviceData);
              } else {
                this.driverLocations[driverIndex] = deviceData;
              }
          });
  }

    ngOnDestroy(): void {
        this.telematicService.stopGpsConnection();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
