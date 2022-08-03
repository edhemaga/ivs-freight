import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as AppConst from '../../../../const';
import { MapsService } from '../../../services/shared/maps.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressEntity
} from 'appcoretruckassist';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-routing-map',
  templateUrl: './routing-map.component.html',
  styleUrls: ['./routing-map.component.scss', '../../../../../assets/scss/maps.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoutingMapComponent implements OnInit {

  public agmMap: any;
  public styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };

  public mapLatitude: number = 41.860119;
  public mapLongitude: number = -87.660156;
  public mapZoom: number = 1;
  
  public addressForm: FormGroup;
  public addressFlag: string = 'empty';

  public selectedAddress: AddressEntity = null;

  public routes: any[] = [
    {
      'name': 'Route 1',
      'hidden': false,
      'expanded': false,
      'startPoint': {
        'address': 'Gary, IN 30055',
      },
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15'
        },
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
          'time': '00:23',
          'totalTime': '01:38'
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
          'time': '00:37',
          'totalTime': '02:05'
        },
      ]
    },
    {
      'name': 'Route 2',
      'hidden': false,
      'expanded': false,
      'startPoint': {
        'address': 'Gary, IN 30055',
        'fullAddress': '2371 W 150th Hwy W, Crouse, NC 28033'
      },
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'fullAddress': '1525 Park Dr, Munster, IN 46321',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15'
        },
        {
          'address': 'Philadelphia, PA 52320',
          'fullAddress': '32075 Arlington Dr, Franklin,  MI 48025',
          'leg': '45.2',
          'total': '105.8',
          'time': '00:23',
          'totalTime': '01:38'
        },
        {
          'address': 'Nashville, KE 89600',
          'fullAddress': '2136 Warren H…, Hermanville, MS 39086',
          'leg': '168.8',
          'total': '273.1',
          'time': '00:37',
          'totalTime': '02:05'
        },
      ]
    },
    {
      'name': 'Route 3',
      'hidden': false,
      'expanded': false,
      'startPoint': {
        'address': 'Gary, IN 30055',
      },
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15'
        },
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
          'time': '00:23',
          'totalTime': '01:38'
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
          'time': '00:37',
          'totalTime': '02:05'
        },
      ]
    },
  ];

  public routeColors: any[] = [
    '#8A9AEF',
    '#FDB46B',
    '#F27B8E',
    '#6DC089',
    '#A574C3',
    '#73D0F1',
    '#F69FF3',
    '#A1887F'
  ];

  constructor(
    private mapsService: MapsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      address: [null],
      addressUnit: [null, Validators.maxLength(6)]
    });
  }

  onTableBodyActions(action) {
    console.log('action', action);
  }

  drop(event: CdkDragDrop<string[]>, dropArray) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);

    console.log(dropArray, event.previousIndex, event.currentIndex);
  }

  showHideRoute(route) {
    route.hidden = !route.hidden;
  }

  resizeCard(route) {
    route.expanded = !route.expanded;
  }

  deleteRouteStop(route, index) {
    route.stops.splice(index, 1);
  }

  mapClick(event) {
    console.log('mapClick', event);
  }

  zoomChange(event){
    this.mapZoom = event;
  }

  getMapInstance(map) {
    this.agmMap = map;
    console.log('getMapInstance', this.agmMap);
  }

  // public onHandleAddress(event: {
  //   address: AddressEntity | any;
  //   valid: boolean;
  // }): void {
  //   console.log('onHandleAddress', event);
  //   if (event.valid) {
  //     this.selectedAddress = event.address;
  //   }
  // }

  public onHandleAddress(
    event: any,
    route
  ) {
    console.log('onHandleAddress', event);
    console.log('onHandleAddress', route);
    if ( event.action == 'confirm' && event.address ) {
      route.stops.push(
        {
          'address': event.address.address,
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15'
        }
      );
    }
  }
}
