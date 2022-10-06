import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as AppConst from '../../../../const';
import { SignalRService } from './../../../services/dispatchboard/app-signalr.service';

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

  routeLineOptions: any = {};

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    // this.signalRService.startConnection().then((res) => {
    //   this.signalRService.addBroadcastDbStatusDataListener();
    //   this.signalRService.statusChange
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((data) => {
    //       console.log('signalR data', data);
    //       data.map((item) => {
    //         console.log('signalR item', item);
    //         return item;
    //       });
    //     });
    // });

    this.driverLocations = [
      {
        lat: 40.037375,
        long: -95.284267
      },
      // {
      //   lat: 29.108181,
      //   long: -104.738062
      // },
      // {
      //   lat: 37.747531,
      //   long: -111.942789
      // }
    ];

    this.driverDestinations = [
      {
        lat: 42.037375,
        long: -88.284267
      },
      // {
      //   lat: 31.108181,
      //   long: -97.738062
      // },
      // {
      //   lat: 39.747531,
      //   long: -104.942789
      // }
    ];
  }

  zoomChange(event) {
    this.mapZoom = event;
  }

  getMapInstance(map) {
    this.agmMap = map;

    var lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 3
    };
    
    this.routeLineOptions = new google.maps.Polyline({
        strokeColor: '#6C6C6C',
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '12px'
        }],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
