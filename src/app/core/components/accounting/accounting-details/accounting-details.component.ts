import { takeUntil } from 'rxjs/operators';
import { TableOptions } from './../models/accounting-table';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { GOOGLE_MAP_STYLES, NORTH_AMERICA_BOUNDS } from 'src/app/const';

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss'],
})
export class AccountingDetailsComponent implements OnInit {
  public tableOptions: TableOptions;
  @ViewChild('t2') t2: any;
  @Input() selectedUser: any;
  agmMap: any;
  accountingChecbox = false;
  distance = '0 miles';
  openedTab = 'Open';
  destinationIcon = '../../../../assets/img/dispatch_marker.svg';
  originIcon = '../../../../assets/img/dispatch_icon_green.svg';
  waypointMarkers = [];
  origin = { lat: 0, lng: 0 };
  destination = { lat: 0, lng: 0 };
  legMilage = [];
  waypoints = [];
  selectedDispatchDataWaypoints: any;
  mapRestrictions = {
    latLngBounds: NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  public styles = GOOGLE_MAP_STYLES;
  mapCenter: any = {
    latitude: 0,
    longitude: 0,
  };
  markerTypes: any = {
    destination: [],
    pickup: [],
  };
  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#28529F',
    },
  };
  originMarker = {
    lat: 0,
    lng: 0,
  };
  destinationMarker = {
    lat: 0,
    lng: 0,
  };
  tableData: any = [
    {
      name: 'Bonuses',
      options: {
        addItem: true,
      },
      columns: [
        {
          title: 'Description',
          field: 'description',
        },
        {
          title: 'Date',
          field: 'date',
        },
        {
          title: 'Amount',
          field: 'amount',
        },
      ],
      data: [
        {
          driverId: 154,
          itemDate: new Date('2021-03-09T23:00:00.000Z'),
          description: 'Desc',
          amount: 1000,
          type: null,
          limitNumber: 1,
          payment: '$1,000.00',
        },
        {
          name: 'Drag to Next Period',
          start_period: '01/10/20',
          end_period: '01/17/20',
          draggable: true,
        },
      ],
    },
    {
      name: 'Deductions',
      options: {
        addItem: true,
        editItem: 'Reccurring',
      },
      columns: [
        {
          title: 'Description',
          field: 'description',
        },
        {
          title: 'Date',
          field: 'date',
        },
        {
          title: 'Amount',
          field: 'amount',
        },
      ],
      data: [
        {
          driverId: 154,
          itemDate: new Date('2021-03-16T23:00:00.000Z'),
          description: 'Desc',
          amount: 100,
          type: 2,
          limitNumber: 1,
          payment: '$100.00',
          limited: true,
          period: 2,
        },
        {
          driverId: 154,
          itemDate: new Date('2021-03-03T23:00:00.000Z'),
          description: 'Desc',
          amount: 100,
          type: 2,
          limitNumber: 1,
          payment: '$100.00',
          limited: false,
          period: 1,
        },
        {
          driverId: 154,
          itemDate: new Date('2021-03-03T23:00:00.000Z'),
          description: 'Desc',
          amount: 100,
          type: 1,
          limitNumber: 1,
          payment: '$100.00',
          limited: false,
          period: 1,
        },
        {
          name: 'Drag to Next Period',
          start_period: '01/10/20',
          end_period: '01/17/20',
          draggable: true,
        },
      ],
    },
    {
      name: 'Credits',
      options: {
        addItem: true,
      },
      columns: [
        {
          title: 'Description',
          field: 'description',
        },
        {
          title: 'Date',
          field: 'date',
        },
        {
          title: 'Amount',
          field: 'amount',
        },
      ],
      data: [
        {
          driverId: 154,
          itemDate: new Date('2021-03-09T23:00:00.000Z'),
          description: 'Desc',
          amount: 1000,
          type: null,
          limitNumber: 1,
          payment: '$1,000.00',
        },
        {
          name: 'Drag to Next Period',
          start_period: '01/10/20',
          end_period: '01/17/20',
          draggable: true,
        },
      ],
    },
  ];
  tableCurrentIndex: number;
  fullscreenActive: boolean;
  mapCollors: any = {
    start: {
      marker: '#707070',
      bottom: '#4B4B4B',
      line: '#707070',
    },
    pickup: {
      marker: '#24C1A1',
      bottom: '#159F83',
      line: '#3997E9',
    },
    delivery: {
      marker: '#FF5D5D',
      bottom: '#D85656',
      line: '#3997E9',
    },
  };
  mainMarkers: any;
  directionRoutes: any = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.showMaps(this.selectedUser);
    if (
      !this.selectedUser.route[this.selectedUser.route.length - 1].draggable
    ) {
      this.selectedUser.route.push({
        name: 'Pay Period',
        start_period: '01/10/20',
        end_period: '01/17/20',
        draggable: true,
        loaded: '0',
        empty: '0',
        total: '0',
      });
    }
    this.tableCurrentIndex = this.selectedUser.route.length;
    // const calc_data = this.calculateTotalItems(this.tableDetails);
    // Object.assign(this.tableDetails[this.tableDetails.length-1], calc_data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex == 0) {
      event.currentIndex = 1;
    }
    this.tableCurrentIndex = event.currentIndex;
    const tableDetails = this.selectedUser.route;

    moveItemInArray(tableDetails, event.previousIndex, event.currentIndex);
    const newData = tableDetails.slice(1, event.currentIndex);
    const calc_data = this.calculateTotalItems(newData);
    Object.assign(tableDetails[event.currentIndex], calc_data);
  }

  toggleCheckbox() {
    if (this.t2.isOpen()) {
      this.t2.close();
    } else {
      this.t2.open();
    }
  }

  // USE ARROW FUNCTION NOTATION TO ACCESS COMPONENT "THIS"
  containerPredictPosition = (index: number) => {
    return index !== 0;
  };

  acceptCheckbox() {
    this.accountingChecbox = !this.accountingChecbox;
    this.t2.close();
  }

  calculateTotalItems(data: any) {
    return data.reduce(
      (counts, objData) => {
        counts.loaded += objData.loaded ? parseInt(objData.loaded) : 0;
        counts.empty += objData.empty ? parseInt(objData.empty) : 0;
        counts.total += objData.total ? parseInt(objData.total) : 0;
        return counts;
      },
      { loaded: 0, empty: 0, total: 0 }
    );
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  public showMaps(mod: any) {
    const allwaypoints = mod.route.reduce(
      (routeArray, item) => {
        if (
          (item.PointOrder > 1 && item.PointType == 'pickup') ||
          (item.PointType == 'delivery' && item.PointOrder < 2)
        ) {
          routeArray.routeAddress.push({ location: item.PointAddress });
          routeArray.routes.push(item);
        }
        return routeArray;
      },
      { routes: [], routeAddress: [] }
    );

    const waypoints = allwaypoints.routeAddress;
    this.selectedDispatchDataWaypoints = allwaypoints.routes;
    this.destination = mod.deliveryLocation.address;
    this.origin = mod.pickupLocation.address;
    this.waypoints = waypoints;
    this.getDispatchMapDistance(
      mod.pickupLocation.address,
      mod.deliveryLocation.address,
      waypoints,
      mod
    );
  }

  public displayRouteWithDelay(start_routes) {
    const delay = setInterval(() => {
      if (start_routes.length == 0) {
        this.setBounds(this.mainMarkers);
        clearInterval(delay);
        return;
      }

      this.directionRoutes = this.directionRoutes.concat(
        start_routes.splice(0, 4)
      );
    }, 2000);
  }

  public getDispatchMapDistance(
    origins: string,
    destinations: string,
    waypoint: any[],
    mod: any
  ) {
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origins,
      destination: destinations,
      waypoints: waypoint,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };
    this.markerTypes = { delivery: [], pickup: [] };
    this.directionRoutes = [];
    const start_routes = [];
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.legMilage = [];
        this.waypointMarkers = [];
        this.mainMarkers = [];
        response.routes[0].legs.forEach((element, index) => {
          if (index == response.routes[0].legs.length - 1) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
              type: 'start',
              index: 1,
              shipper_id: mod.pickupId,
            });
            this.waypointMarkers.push({
              lat: response.routes[0].legs[
                response.routes[0].legs.length - 1
              ].end_location.lat(),
              lng: response.routes[0].legs[
                response.routes[0].legs.length - 1
              ].end_location.lng(),
              type: 'delivery',
              index: this.markerTypes.delivery.length + 1,
              shipper_id: mod.deliveryId,
            });
          }

          start_routes.push({
            origin: {
              lat: element.start_location.lat(),
              lng: element.start_location.lng(),
            },
            destination: {
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
            },
            renderOptions: {
              suppressMarkers: true,
              polylineOptions: {
                fillOpacity: 0.35,
                strokeWeight: 5,
                strokeOpacity: 0.8,
                strokeColor: '#000',
              },
            },
          });

          start_routes.push({
            origin: {
              lat: element.start_location.lat(),
              lng: element.start_location.lng(),
            },
            destination: {
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
            },
            renderOptions: {
              suppressMarkers: true,
              polylineOptions: {
                fillOpacity: 0.35,
                strokeWeight: 3,
                strokeOpacity: 0.8,
                strokeColor: this.mapCollors[mod.route[index].PointType].line,
              },
            },
          });

          this.originMarker.lat =
            response.routes[0].legs[0].start_location.lat();
          this.originMarker.lng =
            response.routes[0].legs[0].start_location.lng();
          this.destinationMarker.lat =
            response.routes[0].legs[
              response.routes[0].legs.length - 1
            ].end_location.lat();
          this.destinationMarker.lng =
            response.routes[0].legs[
              response.routes[0].legs.length - 1
            ].end_location.lng();
          this.mainMarkers.push({
            lat: this.originMarker.lat,
            lng: this.originMarker.lng,
          });
          this.mainMarkers.push({
            lat: this.destinationMarker.lat,
            lng: this.destinationMarker.lng,
          });
          this.mapCenter.latitude = this.originMarker.lat;
          this.mapCenter.longitude = this.destinationMarker.lng;
          if (response.routes[0].legs.length > 1) {
            if (index !== response.routes[0].legs.length - 1) {
              const destType =
                this.selectedDispatchDataWaypoints[index]?.PointType;
              const shipper_id =
                this.selectedDispatchDataWaypoints[index]?.ShipperId;
              if (destType) {
                this.markerTypes[destType].push(1);
              }
              this.waypointMarkers.push({
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                type: destType,
                shipper_id,
                index:
                  destType == 'pickup'
                    ? this.markerTypes[destType].length + 1
                    : this.markerTypes[destType].length,
              });
              this.mainMarkers.push({
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
              });
            }
          }
        });
        this.waypointMarkers.sort(function (a, b) {
          if (a.type == b.type) {
            return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
          } else {
            return a.type < b.type ? 1 : -1;
          }
        });

        setTimeout(() => {
          this.displayRouteWithDelay(start_routes);
        }, 1000);
      }
    });
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

  calcMarkerOpacity(i) {
    let opacity = 1 - i * 0.04;
    if (opacity < 0) {
      opacity = opacity + i * 0.04;
    }
    return opacity;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullscreenActive) {
        this.fullscreenActive = false;
      }
    }
  }

  onFullScreen(isFullScreen: boolean) {
    this.fullscreenActive = isFullScreen;
  }
}
