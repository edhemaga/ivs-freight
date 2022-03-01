import {Component, HostListener, OnInit} from '@angular/core';
import {imageMapType} from 'src/assets/utils/methods-global';
import * as AppConst from 'src/app/const';
declare var google: any;

declare const geoXML3: any;

@Component({
  selector: 'app-dashboard-weather-map',
  templateUrl: './dashboard-weather-map.component.html',
  styleUrls: ['./dashboard-weather-map.component.scss'],
})
export class DashboardWeatherMapComponent implements OnInit {
  agmMap: any;
  dopplerInterval: any;
  public styles = AppConst.GOOGLE_MAP_STYLES;
  timeZones: any;
  kmlUrl = 'assets/kml/timezones.kml';
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  hoveredCategory: any;
  categoryList: any = [
    {
      name: 'Truck',
      color: '#24C1A1'
    },
    {
      name: 'Shop',
      color: '#5673AA'
    },
    {
      name: 'Fuel Stop',
      color: '#50A8FB'
    },
    {
      name: 'Shipper',
      color: '#FA9952'
    }
  ];
  tollRoads: any = [];
  isTollRoadsActive: boolean;
  tollRoadsKml = [
    {state: 'assets/kml/toll-roads/florida.kml'},
    {state: 'assets/kml/toll-roads/Texas.kml'},
    {state: 'assets/kml/toll-roads/California.kml'},
  ];
  trafficLayerShow: boolean;
  tileNeXRad = [];
  allNexrad = [
    {nexrad: 'nexrad-n0q-900913'},
    {nexrad: 'nexrad-n0q-900913-m05m'},
    {nexrad: 'nexrad-n0q-900913-m10m'},
    {nexrad: 'nexrad-n0q-900913-m15m'},
    {nexrad: 'nexrad-n0q-900913-m20m'},
    {nexrad: 'nexrad-n0q-900913-m25m'},
    {nexrad: 'nexrad-n0q-900913-m30m'},
  ];
  isDopplerOn: boolean;
  fullScreenActive: boolean;
  parser: any;
  isTimeZoneActive: boolean;
  trafficLayer;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullScreenActive) {
        this.fullScreenActive = false;
      }
    }
  }

  chooseCategory(chart, indx: number): void {
    this.categoryList[indx].active = !this.categoryList[indx].active;
  }

  public getMapInstance(map) {
    this.agmMap = map;

    this.trafficLayer = new google.maps.TrafficLayer();
    /* geoXML3 initialization */
    this.parser = new geoXML3.parser({
      map: this.agmMap,
      processStyles: false,
      zoom: false,
      singleInfoWindow: false,
    });

    for (let i = 0; i < this.tollRoadsKml.length; i++) {
      this.tollRoads.push(
        new geoXML3.parser({
          map: this.agmMap,
          processStyles: false,
          zoom: false,
          singleInfoWindow: false,
        })
      );
    }

    this.activateDoppler();
  }

  /* Turn off other actions in the tools */
  turnOffOtherToolActions(toll: boolean, timeZone: boolean, doppler: boolean, traffic: boolean) {
    if (toll) {
      for (let i = 0; i < this.tollRoads.length; i++) {
        if (this.tollRoads[i].docs.length) {
          this.tollRoads[i].hideDocument();
        }
      }
      this.isTollRoadsActive = false;
    }
    if (timeZone) {
      if (this.parser.docs.length) {
        this.parser.hideDocument();
        this.isTimeZoneActive = false;
      }
    }
    if (doppler) {
      this.isDopplerOn = false;
      this.startAnimation(false);
      this.agmMap.overlayMapTypes.clear();
    }
    if (traffic) {
      this.trafficLayerShow = false;

      const interval = setInterval(() => {
        this.trafficLayer.setMap(null);
        localStorage.setItem('routingTraffic', JSON.stringify({show: false}));
        clearInterval(interval);
      }, 200);
    }
  }

  /* Timezone */
  onTimeZone() {
    if (this.parser.docs.length) {
      if (!this.isTimeZoneActive) {
        this.parser.showDocument();
      } else {
        this.parser.hideDocument();
      }
      this.isTimeZoneActive = !this.isTimeZoneActive;
    } else {
      this.parser.parse(this.kmlUrl);
      this.isTimeZoneActive = true;
    }

    this.turnOffOtherToolActions(true, false, true, true);
  }

  /* Toll Roads */
  onTollRoads() {
    for (let i = 0; i < this.tollRoads.length; i++) {
      if (this.tollRoads[i].docs.length) {
        if (!this.isTollRoadsActive) {
          this.tollRoads[i].showDocument();
        } else {
          this.tollRoads[i].hideDocument();
        }
      } else {
        this.tollRoads[i].parse(this.tollRoadsKml[i].state);
      }
    }
    this.isTollRoadsActive = !this.isTollRoadsActive;

    this.turnOffOtherToolActions(false, true, true, true);
  }

  // Animate the Weather Radar
  activateDoppler() {
    this.isDopplerOn = !this.isDopplerOn;
    if (this.isDopplerOn) {
      if (!this.tileNeXRad.length) {
        for (const rad of this.allNexrad) {
          this.tileNeXRad.push(imageMapType(rad));
        }
      }
      for (const tile of this.tileNeXRad) {
        this.agmMap.overlayMapTypes.push(tile);
      }
      this.startAnimation(true);
    } else {
      this.agmMap.overlayMapTypes.clear();
      this.startAnimation(false);
    }

    this.turnOffOtherToolActions(true, true, false, true);
  }

  /* Show Or Hide Traffic */
  onRenderTrafficLayer() {
    this.trafficLayerShow = !this.trafficLayerShow;

    const interval = setInterval(() => {
      if (this.trafficLayerShow) {
        this.trafficLayer.setMap(this.agmMap);
        localStorage.setItem('routingTraffic', JSON.stringify({show: true}));
      } else {
        this.trafficLayer.setMap(null);
        localStorage.setItem('routingTraffic', JSON.stringify({show: false}));
      }

      clearInterval(interval);
    }, 200);

    this.turnOffOtherToolActions(true, true, true, false);
    /* this.renderRoutesTrafficStyle(this.trafficLayerShow); */
  }

  public startAnimation(animationOn: boolean) {
    if (animationOn) {
      let index = this.agmMap.overlayMapTypes.getLength() - 1;

      this.dopplerInterval = window.setInterval(() => {
        this.agmMap.overlayMapTypes.getAt(index).setOpacity(0.0);

        index--;
        if (index < 0) {
          index = this.agmMap.overlayMapTypes.getLength() - 1;
        }
        this.agmMap.overlayMapTypes.getAt(index).setOpacity(0.6);
      }, 400);
    } else {
      clearInterval(this.dopplerInterval);
    }
  }

  /* Zoom On Route */
  setBounds(markers: any) {
    if (markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markers.map((marker) => {
        bounds.extend({
          lat: +parseFloat(marker.lat),
          lng: +parseFloat(marker.lng),
        });
      });

      this.agmMap.fitBounds(bounds);
      this.agmMap.setZoom(this.agmMap.getZoom() - 1);
    }
  }

  onFullScreen(isFullScreen: boolean) {
    this.fullScreenActive = isFullScreen;
  }

}
