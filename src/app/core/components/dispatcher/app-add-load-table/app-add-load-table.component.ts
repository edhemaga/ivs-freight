import { AppLoadService } from './../../../services/load/app-load.service';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { DispatchLoad } from '../../shared/model/dispatch';
import * as AppConst from 'src/app/const';

declare var google: any;

@Component({
  selector: 'app-app-add-load-table',
  templateUrl: './app-add-load-table.component.html',
  styleUrls: ['./app-add-load-table.component.scss'],
  animations: [
    trigger('pickupAnimation', [
      transition(':enter', [
        style({ height: 100 }),
        animate('200ms', style({ height: '*' })),
      ]),
      transition(':leave', [animate('150ms', style({ height: 0 }))]),
    ]),
  ],
})
export class AppAddLoadTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  dispatchLoadsData: DispatchLoad[] = [];
  selectedLoad = 0;
  addButton = true;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  public styles = AppConst.GOOGLE_MAP_STYLES;
  distance: any;
  agmMap: any;
  waypointMarkers = [];
  markerTypes: any = {
    destination: [],
    pickup: [],
  };
  waypoints: any;
  directionRoutes: any = [];
  legMilage: any = [];
  mapCollors: any = {
    pickup: {
      marker: '#24C1A1',
      bottom: '#159F83',
      line: '#7B99D4',
    },
    delivery: {
      marker: '#FF5D5D',
      bottom: '#D85656',
      line: '#7B99D4',
    },
  };
  private destroy$ = new Subject<void>();

  constructor(
    private activeModal: NgbActiveModal,
    private loadService: AppLoadService
  ) {}

  ngOnInit() {
    this.getLoads();
    setTimeout(() => {
      const modal = document.getElementsByClassName(
        'modal-dialog'
      ) as HTMLCollectionOf<HTMLElement>;
      modal[0].style.maxWidth = '800px';
    });
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  getLoads() {
    this.loadService
      .getUnnasignedLoads()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.dispatchLoadsData = result;
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  addLoad() {
    const data = JSON.stringify({
      dispatchBoardId: this.inputData.data.dispatchBoardId,
      truckloadId: this.selectedLoad,
    });

    this.loadService
      .addLoadToDispatchBoardItem(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.activeModal.close();
      });
    // this.activeModal.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public showMaps(mod: any) {
    if (this.selectedLoad == mod.id) {
      this.selectedLoad = 0;
      return;
    }
    this.selectedLoad = mod.id;
    const allwaypoints = mod.route.reduce(
      (routeArray, item) => {
        if (
          (item.PointOrder > 1 && item.PointType == 'pickup') ||
          (item.PointType == 'delivery' && item.PointOrder < mod.deliveryCount)
        ) {
          routeArray.routeAddress.push({ location: item.PointAddress });
          routeArray.routes.push(item);
        }
        return routeArray;
      },
      { routes: [], routeAddress: [] }
    );
    const waypoints = allwaypoints.routeAddress;
    this.getDispatchMapDistance(
      mod.pickupLocation.address,
      mod.deliveryLocation.address,
      waypoints,
      allwaypoints.routes,
      mod
    );
  }

  public getDispatchMapDistance(
    origins: string,
    destinations: string,
    waypoint: any[],
    mod: any,
    load: any
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
    this.legMilage = [];
    let totalDistance = 0.0;
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        response.routes[0].legs.forEach((element, index) => {
          if (index == response.routes[0].legs.length - 1) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
              type: 'pickup',
              index: 1,
              shipper_id: load.pickupId,
            });
            this.waypointMarkers.push({
              lat: response.routes[0].legs[
                response.routes[0].legs.length - 1
              ].end_location.lat(),
              lng: response.routes[0].legs[
                response.routes[0].legs.length - 1
              ].end_location.lng(),
              type: 'delivery',
              index: load.deliveryCount,
              shipper_id: load.deliveryId,
            });

            this.directionRoutes.push({
              origin: load.pickupLocation.address,
              destination: load.deliveryLocation.address,
              waypoints: waypoint,
              renderOptions: {
                suppressMarkers: true,
                polylineOptions: {
                  fillOpacity: 0.35,
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                  strokeColor: '#5673AA',
                },
              },
            });

            this.directionRoutes.push({
              origin: {
                lat: response.routes[0].legs[0].start_location.lat(),
                lng: response.routes[0].legs[0].start_location.lng(),
              },
              destination: {
                lat: response.routes[0].legs[
                  response.routes[0].legs.length - 1
                ].end_location.lat(),
                lng: response.routes[0].legs[
                  response.routes[0].legs.length - 1
                ].end_location.lng(),
              },
              waypoints: waypoint,
              renderOptions: {
                suppressMarkers: true,
                polylineOptions: {
                  fillOpacity: 0.35,
                  strokeWeight: 3,
                  strokeOpacity: 0.8,
                  strokeColor:
                    this.mapCollors[load.route[index].PointType].line,
                },
              },
            });
          } else {
            this.waypointMarkers.push({
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
              type: mod[index].PointType,
              shipper_id: mod[index].ShipperId,
              index: mod[index].PointOrder,
            });
          }

          if (response.routes[0].legs.length > 1) {
            if (index === 0) {
              this.legMilage.push({
                distance: null,
                distanceValue: null,
                startAddress:
                  load.pickupLocation.city +
                  ', ' +
                  load.pickupLocation.stateShortName +
                  ' ' +
                  load.pickupLocation.zipCode,
                lat: element.start_location.lat(),
                lng: element.start_location.lng(),
                endAddress: null,
                shipper_id: load.pickupId,
                type: 'pickup',
              });
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                startAddress: null,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                endAddress:
                  mod[0].PointCity +
                  ', ' +
                  mod[0].PointState +
                  ' ' +
                  mod[0].PointZip,
                totalDistanceValue: null,
                shipper_id: mod[0].ShipperId,
                type: mod[0].PointType,
              });
            } else if (index !== response.routes[0].legs.length - 1) {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                totalDistanceValue: null,
                startAddress: null,
                endAddress:
                  mod[index]?.PointCity +
                  ', ' +
                  mod[index]?.PointState +
                  ' ' +
                  mod[index]?.PointZip,
                shipper_id: mod[index].shipperId,
                type: mod[index].PointType,
              });
            } else {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                startAddress: null,
                endAddress:
                  load.deliveryLocation.city +
                  ', ' +
                  load.deliveryLocation.stateShortName +
                  ' ' +
                  load.deliveryLocation.zipCode,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                totalDistanceValue: null,
                shipper_id: load.deliveryId,
                type: 'delivery',
              });
            }
          } else {
            this.legMilage.push({
              distance: null,
              distanceValue: null,
              startAddress:
                load.pickupLocation.city +
                ', ' +
                load.pickupLocation.stateShortName +
                ' ' +
                load.pickupLocation.zipCode,
              lat: element.start_location.lat(),
              lng: element.start_location.lng(),
              endAddress: null,
              shipper_id: load.pickupId,
              type: 'pickup',
            });
            this.legMilage.push({
              distance: element.distance.text.replace('mi', '').trim(),
              distanceValue: element.distance.value,
              startAddress: null,
              endAddress:
                load.deliveryLocation.city +
                ', ' +
                load.deliveryLocation.stateShortName +
                ' ' +
                load.deliveryLocation.zipCode,
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
              totalDistanceValue: null,
              shipper_id: load.deliveryId,
              type: 'delivery',
            });
          }
          totalDistance += element.distance.value;
        });

        this.distance = (totalDistance * 0.00062137).toFixed(0).toString();
        this.legMilage.forEach((element, index) => {
          if (index === 0) {
            element.mileageSum = 0;
            element.mileageSumString = null;
          } else {
            element.mileageSum =
              element.distanceValue + this.legMilage[index - 1].mileageSum;
            element.mileageSumString = (element.mileageSum * 0.00062137)
              .toFixed(0)
              .toString();
          }
        });
      }
    });
  }
}
