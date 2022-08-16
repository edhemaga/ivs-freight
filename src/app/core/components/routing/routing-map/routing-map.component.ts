import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as AppConst from '../../../../const';
import { MapsService } from '../../../services/shared/maps.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  AddressEntity
} from 'appcoretruckassist';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

declare var google: any;

@Component({
  selector: 'app-routing-map',
  templateUrl: './routing-map.component.html',
  styleUrls: ['./routing-map.component.scss', '../../../../../assets/scss/maps.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoutingMapComponent implements OnInit {
  @ViewChild('mapToolbar') mapToolbar: any;

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
  public addressFlag: string = 'Empty';

  public selectedAddress: AddressEntity = null;

  addressInputs: FormArray = this.formBuilder.array([]);

  public markerOptions = {
      origin: {
          icon: 'https://www.shareicon.net/data/32x32/2016/04/28/756617_face_512x512.png',
          draggable: true,
      },
      destination: {
          icon: 'https://www.shareicon.net/data/32x32/2016/04/28/756626_face_512x512.png',
          label: 'MARKER LABEL',
          opacity: 0.8,
      },
  }

  selectedTab: string = 'map1';
  selectedMapIndex: number = 0;
  tableOptions: any = {};

  tableData: any[] = [];

  dropdownActions: any[] = [
    {
      title: 'Settings',
      name: 'open-settings',
      class: 'regular-text',
      contentType: 'settings',
      show: true,
      svg: 'assets/svg/common/ic_settings.svg',
    },
    {
      title: 'Report',
      name: 'open-report',
      class: 'regular-text',
      contentType: 'report',
      show: true,
      svg: 'assets/svg/common/ic_route_report.svg',
    },
    {
      title: 'Print',
      name: 'print-route',
      class: 'regular-text',
      contentType: 'print',
      show: true,
      svg: 'assets/svg/common/ic_print.svg',
    },
    {
      title: 'Duplicate',
      name: 'duplicate-route',
      class: 'regular-text',
      contentType: 'duplicate',
      show: true,
      svg: 'assets/svg/common/ic_route_duplicate.svg',
    },
    {
      title: 'Reverse',
      name: 'reverse-route-stops',
      class: 'regular-text',
      contentType: 'reverse',
      show: true,
      svg: 'assets/svg/common/ic_route_reverse.svg',
    },
    {
      title: 'Clear All',
      name: 'clear-route-stops',
      class: 'regular-text',
      contentType: 'clear',
      show: true,
      svg: 'assets/svg/common/ic_route_clear.svg',
    },
    {
      title: 'Delete',
      name: 'delete',
      type: 'route',
      text: 'Are you sure you want to delete this Route?',
      class: 'delete-text',
      contentType: 'delete',
      show: true,
      danger: true,
      svg: 'assets/svg/truckassist-table/dropdown/content/delete.svg',
    },
  ];

  public routes: any[] = [
    {
      'id': 1,
      'name': 'Route 1',
      'hidden': false,
      'expanded': false,
      'fullAddressView': false,
      'routeType': 'Practical',
      'truckId': '',
      'stopTime': '',
      'mpg': '',
      'fuelPrice': '',
      'stops': [
        {
          'address': 'Gary, IN 30055',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': true,
          'lat': 41.601970,
          'long': -87.349680
        },
        /*{
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': true,
          'lat': 41.883230,
          'long': -87.632400
        },*/
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
          'time': '00:23',
          'totalTime': '01:38',
          'empty': true,
          'lat': 39.951060,
          'long': -75.165620
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
          'time': '00:37',
          'totalTime': '02:05',
          'empty': false,
          'lat': 30.826909,
          'long': -96.655749
        },
      ]
    },
    {
      'id': 2,
      'name': 'Route 2',
      'hidden': false,
      'expanded': false,
      'fullAddressView': true,
      'routeType': 'Shortest',
      'truckId': '',
      'stopTime': '',
      'mpg': '',
      'fuelPrice': '',
      'stops': [
        {
          'address': 'Gary, IN 30055',
          'fullAddress': '2371 W 150th Hwy W, Crouse, NC 28033',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': true,
          'lat': 35.404478,
          'long': -81.331493
        },
        /*{
          'address': 'Chicago, IL 65005',
          'fullAddress': '1525 Park Dr, Munster, IN 46321',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': false,
          'lat': 41.5577897,
          'long': -87.4925295
        },*/
        {
          'address': 'Philadelphia, PA 52320',
          'fullAddress': '32075 Arlington Dr, Franklin,  MI 48025',
          'leg': '45.2',
          'total': '105.8',
          'time': '00:23',
          'totalTime': '01:38',
          'empty': true,
          'lat': 42.526144,
          'long': -83.20796
        },
        {
          'address': 'Nashville, KE 89600',
          'fullAddress': '2136 Warren H…, Hermanville, MS 39086',
          'leg': '168.8',
          'total': '273.1',
          'time': '00:37',
          'totalTime': '02:05',
          'empty': false,
          'lat': 32.469674,
          'long': -90.50994
        },
      ]
    },
    /*{
      'id': 3,
      'name': 'Route 3',
      'hidden': false,
      'expanded': false,
      'fullAddressView': false,
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': true,
          'lat': 41.883230,
          'long': -87.632400
        },
        {
          'address': 'Gary, IN 30055',
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': true,
          'lat': 41.601970,
          'long': -87.349680
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
          'time': '00:37',
          'totalTime': '02:05',
          'empty': true,
          'lat': 30.826909,
          'long': -96.655749
        },
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
          'time': '00:23',
          'totalTime': '01:38',
          'empty': true,
          'lat': 39.951060,
          'long': -75.165620
        },
      ]
    },*/
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

  public routeFocusColors: any[] = [
    '#596FE8',
    '#FD952D',
    '#ED445E',
    '#2FA558',
    '#7F39AA',
    '#38BDEB',
    '#F276EF',
    '#8D6E63'
  ];

  focusedRouteIndex: number = null;
  stopPickerActive: boolean = false;
  stopPickerLocation: any = {};
  stopJustAdded: boolean = false;

  constructor(
    private mapsService: MapsService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initTableOptions();

    this.addressForm = this.formBuilder.group({
      address: [null]
    });

    this.initAddressFields();

    this.routes.map((item, index) => {
      console.log('routes.map', index);
      this.calculateDistanceBetweenStops(index);
    });
  }

  initAddressFields() {
    new Array(this.routes.length).fill(1).map((item, index)=> {
      this.addressInputs.push(this.formBuilder.group({
        address: []
      }));
    });
  }

  get addressFields() {
    return this.addressInputs;
  }

  onTableBodyActions(action) {
    console.log('action', action);
  }

  dropRoutes(event: CdkDragDrop<string[]>, dropArray) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);
  }

  dropStops(event: CdkDragDrop<string[]>, dropArray, index) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);

    console.log(dropArray, event.previousIndex, event.currentIndex);
    
    this.calculateDistanceBetweenStops(index);
  }

  showHideRoute(route) {
    route.hidden = !route.hidden;
    if ( route.isFocused ) { route.isFocused = false; this.focusedRouteIndex = null; }
  }

  resizeCard(route) {
    route.expanded = !route.expanded;
  }

  deleteRouteStop(route, index) {
    route.stops.splice(index, 1);

    this.checkFullAddressView(route);

    this.ref.detectChanges();
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
    var mainthis = this;

    map.addListener('click', (e) => {
      console.log(e);
      if ( mainthis.stopJustAdded ) { mainthis.stopJustAdded = false; return false; }

      if ( mainthis.focusedRouteIndex != null && mainthis.stopPickerActive ) {
        var coords = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        var request = {
          location: coords,
          radius: 50000,
          type: 'locality'
        };
        
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
          console.log('search', results, status);

          if ( status == 'OK' && results.length && results[0].place_id ) {
            let placeId = results[0].place_id;

            service.getDetails({
              placeId: placeId
              }, function (result, status) {
                console.log(result);
                mainthis.stopPickerLocation = {
                  'address': result.formatted_address,
                  'lat': result.geometry.location.lat(),
                  'long': result.geometry.location.lng(),
                  'empty': null
                };

                console.log('stopPickerLocation', mainthis.stopPickerLocation, mainthis.focusedRouteIndex);

                mainthis.ref.detectChanges();
              });
          }
        });
      }
    });
  }

  mapPlacesSearch(results, status) {
    console.log('mapPlacesSearch', results);
    console.log('mapPlacesSearch', status);

    let placeService = new google.maps.places.PlacesService(this.agmMap);
    placeService.getDetails({
      placeId: results[0].place_id
      }, function (result, status) {
        console.log(result);
      });
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
    route,
    index
  ) {
    this.addressInputs.at(index).reset();
    if ( event.action == 'confirm' && event.address ) {
      console.log('onHandleAddress event', event);

      console.log('addressFlag', this.addressFlag);

      route.stops.push(
        {
          'address': event.address.address,
          'fullAddress': event.address.street ? event.address.address : false,
          'leg': '60.6',
          'total': '60.6',
          'time': '01:15',
          'totalTime': '01:15',
          'empty': this.addressFlag == 'Empty' ? true : false,
          'lat': 32.469674,
          'long': -90.50994
        }
      );

      this.calculateDistanceBetweenStops(index);
      this.checkFullAddressView(route);
    }
  }

  checkFullAddressView(route) {
    let fullAdressStops = 0;

    route.stops.map((item)=> {
      if ( item.fullAddress ) {
        fullAdressStops++;
      }
    });

    if ( fullAdressStops ) {
      route.fullAddressView = true;
    } else {
      route.fullAddressView = false;
    }
  }

  calculateDistanceBetweenStops(i: number) {
    /* Set all distance and totalDistance to 0 km or miles */
    for (let j = 0; j < this.routes[i].stops.length; j++) {
      this.routes[i].stops[j].leg = 0;
      this.routes[i].stops[j].total = 0;
    }
    /* For  Calculate Distance*/
    for (let j = 1; j < this.routes[i].stops.length; j++) {
      if (
        this.routes[i].stops[j].lat !== undefined &&
        this.routes[i].stops[j].long !== undefined
      ) {
        const firstAddress = new google.maps.LatLng(
          this.routes[i].stops[j - 1].lat,
          this.routes[i].stops[j - 1].long
        );
        const secondAddress = new google.maps.LatLng(
          this.routes[i].stops[j].lat,
          this.routes[i].stops[j].long
        );

        let distance: number;
        /* Chack if miles or km */
        if (this.tableData[this.selectedMapIndex].distanceUnit == 'mi') {
          distance =
            google.maps.geometry.spherical.computeDistanceBetween(firstAddress, secondAddress) *
            0.000621371;
        } else {
          distance =
            google.maps.geometry.spherical.computeDistanceBetween(firstAddress, secondAddress) /
            1000.0;
        }

        this.routes[i].stops[j].leg = distance;
        this.routes[i].stops[j].total =
          parseFloat(this.routes[i].stops[j - 1].total) + parseFloat(this.routes[i].stops[j].leg);
      }
    }
    for (let j = 1; j < this.routes[i].stops.length; j++) {
      var stopLeg = parseFloat(this.routes[i].stops[j].leg);
      var stopTotal = parseFloat(this.routes[i].stops[j].total);
      this.routes[i].stops[j].leg = stopLeg.toFixed(1);
      this.routes[i].stops[j].total = stopTotal.toFixed(1);
    }
  }

  callDropDownAction(event: any) {
    console.log('callDropDownAction', event);
    // Edit Call
    if (event.type === 'duplicate-route') {
      this.duplicateRoute(event.id);
    } else if (event.type === 'reverse-route-stops') {
      this.reverseRouteStops(event.id);
    } else if (event.type === 'clear-route-stops') {
      this.clearRouteStops(event.id);
    } else if (event.type === 'delete') {
      this.deleteRoute(event.id);
    } else if ( event.type === 'open-settings' ) {
      let route = this.getRouteById(event.id);
      this.mapToolbar.editRoute(route);
    }
  }

  showMoreOptions(route) {
    route.dropdownOpen = !route.dropdownOpen;
    console.log('showMoreOptions', route.dropdownOpen);
  }

  duplicateRoute(id) {
    let route = this.getRouteById(id);

    if ( route ) {
      this.addressInputs.push(this.formBuilder.group({
        address: []
      }));

      const lastId = Math.max(...this.routes.map(item => item.id));

      const newRoute = JSON.parse(JSON.stringify(route));
      newRoute.id = lastId+1;
      
      this.routes.push(newRoute);

      this.calculateDistanceBetweenStops(this.routes.length-1);
    }
  }

  reverseRouteStops(id) {
    let route = this.getRouteById(id);
    const routeIndex = this.routes.findIndex(route => {
      return route.id === id;
    });

    if ( route && route.stops && route.stops.length ) {
      route.stops = route.stops.reverse();

      this.calculateDistanceBetweenStops(routeIndex);
    }
  }

  clearRouteStops(id) {
    let route = this.getRouteById(id);

    if ( route && route.stops && route.stops.length ) {
      route.stops = [];
    }
  }

  deleteRoute(id) {
    const routeIndex = this.routes.findIndex(route => {
      return route.id === id;
    });

    if ( routeIndex > -1 ) {
      this.routes.splice(routeIndex, 1);
    }
  }

  getRouteById(id) {
    let route = this.routes
        .filter((item) => item.id === id)[0];

    return route ? route : false;
  }
  
  focusRoute(i) {
    this.stopPickerLocation = {};

    this.routes.map((route, index) => {
      if ( index == i ) {
        if ( !route.hidden ) {
          route.isFocused = !route.isFocused;

          if ( route.isFocused ) { 
            this.focusedRouteIndex = i;
          } else {
            this.focusedRouteIndex = null;
          }
        }
      } else {
        route.isFocused = false;
      }
    });
  }

  onToolBarAction(event: any) {
    console.log('onToolBarAction', event);

    if ( event.action == 'add-route' ) {
      var routeForm = event.data;

      const lastId = Math.max(...this.routes.map(item => item.id));

      this.addressInputs.push(this.formBuilder.group({
        address: []
      }));
      
      var newRoute = {
          'id': lastId+1,
          'name': routeForm.get('routeName').value,
          'hidden': false,
          'expanded': false,
          'fullAddressView': false,
          'routeType': routeForm.get('routeType').value,
          'truckId': routeForm.get('truckId').value ? routeForm.get('truckId').value : '',
          'stopTime': routeForm.get('durationTime').value ? routeForm.get('durationTime').value : '',
          'mpg': routeForm.get('fuelMpg').value ? routeForm.get('fuelMpg').value : '',
          'fuelPrice': routeForm.get('fuelPrice').value ? routeForm.get('fuelPrice').value : '',
          'stops': []
      };

      this.routes.push(newRoute);
    } else if ( event.action == 'edit-route' ) {
      var routeForm = event.data.form;
      let route = this.getRouteById(event.data.editId);

      route.name = routeForm.get('routeName').value;
      route.routeType = routeForm.get('routeType').value;
      route.truckId = routeForm.get('truckId').value;
      route.stopTime = routeForm.get('durationTime').value;
      route.mpg = routeForm.get('fuelMpg').value;
      route.fuelPrice = routeForm.get('fuelPrice').value;
      
      // = {
      //   'id': route.id,
      //   'name': routeForm.get('routeName').value,
      //   'hidden': false,
      //   'expanded': false,
      //   'fullAddressView': route.fullAddressView,
      //   'routeType': routeForm.get('routeType').value,
      //   'truckId': routeForm.get('truckId').value ? routeForm.get('truckId').value : '',
      //   'stopTime': routeForm.get('durationTime').value ? routeForm.get('durationTime').value : '',
      //   'mpg': routeForm.get('fuelMpg').value ? routeForm.get('fuelMpg').value : '',
      //   'fuelPrice': routeForm.get('fuelPrice').value ? routeForm.get('fuelPrice').value : '',
      //   'stops': route.stops
      // };

      this.ref.detectChanges();
    } else if ( event.action == 'map-settings' ) {
      console.log('onToolbarAction map-settings');

      var mapForm = event.data;

      var distanceUnitChanged = false;
      if ( this.tableData[this.selectedMapIndex].distanceUnit != mapForm.get('distanceUnit').value ) distanceUnitChanged = true;

      this.tableData[this.selectedMapIndex].title = mapForm.get('mapName').value;
      this.tableData[this.selectedMapIndex].distanceUnit = mapForm.get('distanceUnit').value;
      this.tableData[this.selectedMapIndex].addressType = mapForm.get('addressType').value;
      this.tableData[this.selectedMapIndex].borderType = mapForm.get('borderType').value;

      if ( distanceUnitChanged ) {
        this.routes.map((item, index) => {
          console.log('routes.map', index);
          this.calculateDistanceBetweenStops(index);
        });
      }

    } else if ( event.action == 'open-stop-picker' ) {
      console.log('onToolbarAction open-stop-picker');
      this.stopPickerActive = !this.stopPickerActive;
    } else if ( event.action == 'open-route-compare' ) {
      console.log('onToolbarAction open-route-compare');
    } else if ( event.action == 'open-keyboard-controls' ) {
      console.log('onToolbarAction open-keyboard-controls');
    } else if ( event.action == 'open-route-info' ) {
      console.log('onToolbarAction open-route-info');
    } else if ( event.action == 'open-layers' ) {
      console.log('onToolbarAction open-layers');
    }

    // // Add Call
    // if (event.action === 'open-modal') {
    //   // Add Broker Call Modal
    //   if (this.selectedTab === 'active') {
    //     this.modalService.openModal(BrokerModalComponent, { size: 'medium' });
    //   }
    //   // Add Shipper Call Modal
    //   else {
    //     this.modalService.openModal(ShipperModalComponent, { size: 'medium' });
    //   }
    // }
    // // Switch Tab Call
    // else if (event.action === 'tab-selected') {
    //   this.selectedTab = event.tabData.field;

    //   this.sendCustomerData();
    // } else if (event.action === 'view-mode') {
    //   this.tableOptions.toolbarActions.viewModeActive = event.mode;
    // }
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        hideViewMode: true,
        showMapView: false
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      }
    };

    this.tableData = [
      {
        title: 'Map 1',
        field: 'map1',
        length: this.routes.length,
        gridNameTitle: 'Routing',
        distanceUnit: 'mi', // mi or km
        borderType: 'open', // open or closed
        addressType: 'city' // city or address
      },
      // {
      //   title: 'Map 2',
      //   field: 'map2',
      //   length: 0,
      //   gridNameTitle: 'Routing'
      // },
      // {
      //   title: 'Map 3',
      //   field: 'map3',
      //   length: 0,
      //   gridNameTitle: 'Routing'
      // },
      // {
      //   title: 'Map 4',
      //   field: 'map4',
      //   length: 0,
      //   gridNameTitle: 'Routing'
      // },
    ];
  }

  zoomMap(zoom) {
    if ( zoom == 'minus' && this.mapZoom > 0 ) {
      this.mapZoom--;
    } else if ( this.mapZoom < 21 ) {
      this.mapZoom++;
    }
  }

  addNewStop(loadType) {
    console.log('addNewStop', loadType, this.focusedRouteIndex);
    this.stopPickerLocation.empty = loadType == 'empty' ? true : false;

    if ( this.stopPickerLocation.editIndex ) {
      this.routes[this.focusedRouteIndex].stops[this.stopPickerLocation.editIndex].empty = this.stopPickerLocation.empty;
    } else {
      this.routes[this.focusedRouteIndex].stops.push({
        'address': this.stopPickerLocation.address,
        'fullAddress': false,
        'leg': '0',
        'total': '0',
        'time': '0',
        'totalTime': '0',
        'empty': this.stopPickerLocation.empty,
        'lat': this.stopPickerLocation.lat,
        'long': this.stopPickerLocation.long
      });

      this.calculateDistanceBetweenStops(this.focusedRouteIndex);
    }

    //this.focusedRouteIndex = null;
    this.stopPickerLocation = {};
    //this.stopPickerActive = false;
    this.stopJustAdded = true;

    this.ref.detectChanges();
  }

  stopMarkerClick(route, stopIndex) {
    if ( this.focusedRouteIndex && this.stopPickerActive) {
      this.stopPickerLocation = route.stops[stopIndex];
      this.stopPickerLocation.editIndex = stopIndex;
    }
  }
}
