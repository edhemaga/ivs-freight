import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as AppConst from '../../../../const';
import { MapsService } from '../../../services/shared/maps.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AddressEntity } from 'appcoretruckassist';
import { addressValidation } from '../../shared/ta-input/ta-input.regex-validations';
import {imageMapType} from 'src/assets/utils/methods-global';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { ModalService } from './../../shared/ta-modal/modal.service';

declare var google: any;
declare const geoXML3: any;

@Component({
  selector: 'app-routing-map',
  templateUrl: './routing-map.component.html',
  styleUrls: [
    './routing-map.component.scss',
    '../../../../../assets/scss/maps.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RoutingMapComponent implements OnInit {
  @ViewChild('mapToolbar') mapToolbar: any;
  @ViewChild('t2') t2: any;

  @HostListener('mousemove', ['$event']) onMouseOver(event) {
    if (this.stopPickerActive && this.focusedRouteIndex != null) {
      let stopPickerCursor: HTMLElement =
        document.querySelector('#stopPickerCursor');

      if (stopPickerCursor) {
        stopPickerCursor.style.top = event.pageY + 15 + 'px';
        stopPickerCursor.style.left = event.pageX + 10 + 'px';
      }
    }
  }

  dontUseTab: boolean = false;

  // @HostListener('keydown', ['$event']) onKeyDown(e) {
  //   console.log('keydown key', e);

  //   if (e.shiftKey && e.keyCode == 9) {
  //     this.switchRouteFocus(true);
  //     this.dontUseTab = true;
  //   }
  // }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    console.log('document:keydown key', key);

    if (key === 9) {
      /* Tab switch routes */
      event.preventDefault();
      this.switchRouteFocus(event.shiftKey);
    } else if ( key === 27 ) {
      if ( this.focusedRouteIndex != null ) {
        /* Remove focus from all routes */
        this.focusRoute(this.focusedRouteIndex);
      }
    } else if ( key === 46 ) {
      if ( this.focusedRouteIndex != null ) {
        /* Delete focused route */
        this.dropDownActive = this.routes[this.focusedRouteIndex].id;
        this.callDropDownAction(event, this.dropdownActions[6]);
      }
    } else if (key === 40 || key === 38) {
      /* Up and Down arrow */
      event.preventDefault();
      if (this.focusedRouteIndex != null ) {
        this.onUpAndDownArrow(event);
      }
    } else if (key === 119) {
      if (this.focusedRouteIndex != null ) {
        var currentlyFocusedStop = this.findFocusedStop(this.focusedRouteIndex);

        if ( currentlyFocusedStop > -1 ) {
          this.deleteRouteStop(event, this.routes[this.focusedRouteIndex], currentlyFocusedStop);
        }
      }
    } else if (key === 107) {
      console.log('Plus pressed');
      console.log(this.mapToolbar.addRoutePopup);

      var addRoutePopover = this.mapToolbar.addRoutePopup;
      if ( !addRoutePopover.isOpen() ) {
        /* Open Add Route popover on Plus key press */
        this.mapToolbar.onShowRoutePopover(addRoutePopover);
      }
    } else if (key === 13) {
      var addRoutePopover = this.mapToolbar.addRoutePopup;
      if ( addRoutePopover.isOpen() ) {
        event.preventDefault();
        event.stopPropagation();
        
        this.mapToolbar.onToolBarAction(this.mapToolbar.routeToEdit?.id ? 'edit-route' : 'add-route');
      }
    }

    // if (key === 27) {
    //   /* Esc */
    //   if (this.fullScreenMode && this.currentlyFocusedRoute === -1) {
    //     this.onFullScreen(false);
    //   }
    //   if (this.currentlyFocusedRoute !== -1) {
    //     this.checkIfOpenInternalAdd(this.currentlyFocusedRoute);
    //     this.routs[this.currentlyFocusedRoute].rightColorHight = this.calculateHeight(
    //       this.currentlyFocusedRoute
    //     );
    //   }
    //   this.routAddress = null;
    //   if (this.openAddNewPlaceOnEnter) {
    //     this.openAddNewPlaceOnEnter = false;
    //   }
    //   this.internalAddPlace = false;
    //   this.currentlyFocusedPlace = -1;
    //   this.indexOFInternalInput = -1;
    //   this.firstUsageOfUpAndDownArrow = false;
    //   this.currentlyFocusedRoute = -1;
    // } else if (!this.dontUseTab && key === 9) {
    //   /* Tab switch routes */
    //   event.preventDefault();
    //   this.switchRoute();
    // } else if (key === 40 || key === 38) {
    //   /* Up and Down arrow */
    //   event.preventDefault();
    //   if (this.currentlyFocusedRoute !== -1) {
    //     this.onUpAndDownArrow(key);
    //   }
    // } else if (key === 119) {
    //   /* F8 */
    //   event.preventDefault();
    //   this.canUseUpAndDown = true;
    //   if (!this.internalAddPlace) {
    //     if (this.currentlyFocusedPlace !== -1) {
    //       this.onDeleteWithShortCut();
    //     }
    //   } else {
    //     if (this.indexOFInternalInput !== this.currentlyFocusedPlace) {
    //       this.onDeleteWithShortCut(true);
    //     } else {
    //       this.internalAddPlace = false;
    //       this.indexOFInternalInput = -1;
    //       this.checkIfOpenInternalAdd(this.currentlyFocusedRoute);
    //     }
    //   }
    // } else if (key === 118) {
    //   /* F7 */
    //   event.preventDefault();
    //   this.routAddress = '';
    //   if (this.currentlyFocusedRoute !== -1) {
    //     if (this.currentlyFocusedPlace !== -1) {
    //       this.firstUsageOfUpAndDownArrow = false;
    //       this.checkIfOpenInternalAdd(this.currentlyFocusedRoute);
    //       this.internalAddPlace = true;
    //       this.showAddNewPlace = this.currentlyFocusedRoute;
    //       this.hideRegularInput = true;
    //       this.canUseUpAndDown = true;
    //       this.indexOFInternalInput = this.currentlyFocusedPlace;
    //       this.routs[this.currentlyFocusedRoute].places.splice(this.currentlyFocusedPlace, 0, {
    //         emptyPlace: true,
    //       });
    //       this.routs[this.currentlyFocusedRoute].rightColorHight = this.calculateHeight(
    //         this.currentlyFocusedRoute,
    //         true
    //       );
    //       let count = 0;
    //       const interval = setInterval(() => {
    //         document.getElementById('insertPlaceInternal' + this.currentlyFocusedPlace).focus();
    //         count++;
    //         if (count === 1) {
    //           clearInterval(interval);
    //         }
    //       }, 100);
    //     } else {
    //       this.onAddNewPlace(this.currentlyFocusedRoute);
    //     }
    //   }
    // }
    this.dontUseTab = false;
  }

  mapHover: boolean = false;

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
  };

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
      svg: 'assets/svg/common/routing/ic_route_report.svg',
      showArrow: true,
      openPopover: true,
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
      svg: 'assets/svg/common/routing/ic_route_duplicate.svg',
      disabledTooltip: '8 Route Limit'
    },
    {
      title: 'Reverse',
      name: 'reverse-route-stops',
      class: 'regular-text',
      contentType: 'reverse',
      show: true,
      svg: 'assets/svg/common/routing/ic_route_reverse.svg',
    },
    {
      title: 'Clear All',
      name: 'clear-route-stops',
      class: 'regular-text',
      contentType: 'clear',
      show: true,
      svg: 'assets/svg/common/routing/ic_route_clear.svg',
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

  public routes: any[] = [];

  public routeColors: any[] = [
    '#3074D3',
    '#FFA726',
    '#EF5350',
    '#26A690',
    '#AB47BC',
    '#38BDEB',
    '#F276EF',
    '#8D6E63',
  ];

  public routeFocusColors: any[] = [
    '#3074D3',
    '#FFA726',
    '#EF5350',
    '#26A690',
    '#AB47BC',
    '#38BDEB',
    '#F276EF',
    '#8D6E63',
  ];

  focusedRouteIndex: number = null;
  focusedStopIndex: number = null;
  stopPickerActive: boolean = false;
  stopPickerLocation: any = {};
  stopJustAdded: boolean = false;

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  placesService: any;
  geocoder = new google.maps.Geocoder();

  routeProperties: any = {
    legTime: {
      expandedText: 'Leg t',
      value: 'time',
      expandedOnly: true,
      width: '40px',
      order: 1,
      class: 'route-row-leg marker-like-text',
    },
    totalTime: {
      expandedText: 'Total t',
      value: 'totalTime',
      expandedOnly: true,
      width: '44px',
      order: 2,
      class: 'route-row-total marker-like-text marker-semibold-text',
      boldValue: true,
    },
    legPrice: {
      expandedText: 'Leg $',
      value: 'legPrice',
      expandedOnly: true,
      width: '56px',
      order: 3,
      class: 'route-row-leg marker-like-text',
    },
    totalPrice: {
      expandedText: 'Total $',
      value: 'totalPrice',
      expandedOnly: true,
      width: '60px',
      order: 4,
      class: 'route-row-total marker-like-text marker-semibold-text',
      boldValue: true,
    },
    legDistance: {
      text: 'Leg',
      expandedText: 'Leg',
      value: 'leg',
      width: '44px',
      order: 5,
      class: 'route-row-leg marker-like-text',
      insertExpandedText: 'distanceUnit',
    },
    emptyDistance: {
      expandedText: 'Empty',
      value: 'emptyDistance',
      expandedOnly: true,
      width: '46px',
      order: 6,
      class: 'route-row-total marker-like-text marker-semibold-text',
      boldValue: true,
      checkMainValue: 'hasEmptyMiles',
    },
    loadedDistance: {
      expandedText: 'Loaded',
      value: 'loadedDistance',
      expandedOnly: true,
      width: '46px',
      order: 7,
      class: 'route-row-leg marker-like-text marker-semibold-text',
      boldValue: true,
      checkMainValue: 'hasEmptyMiles',
    },
    totalDistance: {
      text: 'Total',
      expandedText: 'Total',
      value: 'total',
      width: '46.5px',
      order: 8,
      class: 'route-row-total marker-like-text marker-semibold-text m-0',
      insertExpandedText: 'distanceUnit',
      boldValue: true,
    },
  };

  renderBorderArray = [];
  renderArray = [];
  allRenderInArray = [];
  delayRequest = 100;

  tooltip: any;
  dropDownActive: number = -1;

  tollRoads: any = [];
  isTollRoadsActive: boolean;
  tollRoadsKml = [
    { state: 'assets/kml/toll-roads/florida.kml' },
    { state: 'assets/kml/toll-roads/Texas.kml' },
    { state: 'assets/kml/toll-roads/California.kml' },
  ];

  trafficLayer;
  trafficLayerShow = false;
  timeZones: any;
  isTimeZoneActive: boolean;
  kmlUrl = 'assets/kml/timezones.kml';

  tileNeXRad = [];
  allNexrad = [
    { nexrad: 'nexrad-n0q-900913' },
    { nexrad: 'nexrad-n0q-900913-m05m' },
    { nexrad: 'nexrad-n0q-900913-m10m' },
    { nexrad: 'nexrad-n0q-900913-m15m' },
    { nexrad: 'nexrad-n0q-900913-m20m' },
    { nexrad: 'nexrad-n0q-900913-m25m' },
    { nexrad: 'nexrad-n0q-900913-m30m' },
  ];
  isDopplerOn: boolean;
  dopplerInterval: any;

  actionDisabledTooltip: boolean = false;
  actionDisabledTooltipFinished: boolean = false;

  constructor(
    private mapsService: MapsService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private modalService: ModalService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.addressForm = this.formBuilder.group({
      address: [null, [...addressValidation]],
    });

    this.initAddressFields();

    this.routes.map((item, index) => {
      this.calculateDistanceBetweenStops(index);
      this.calculateRouteWidth(item);
    });

    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      //.pipe(untilDestroyed(this))
      .subscribe({
        next: (res: Confirmation) => {
          console.log('confirmationData', res);
          switch (res.type) {
            case 'delete': {
              if (res.template === 'route') {
                this.deleteRoute(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
  }

  initAddressFields() {
    new Array(this.routes.length).fill(1).map((item, index) => {
      this.addressInputs.push(
        this.formBuilder.group({
          address: [],
        })
      );
    });
  }

  get addressFields() {
    return this.addressInputs;
  }

  dropRoutes(event: CdkDragDrop<string[]>, dropArray) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);
  }

  dropStops(event: CdkDragDrop<string[]>, dropArray, index) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);

    this.calculateDistanceBetweenStops(index);
    this.calculateRouteWidth(this.routes[index]);
  }

  showHideRoute(event, route) {
    event.stopPropagation();
    event.preventDefault();

    route.hidden = !route.hidden;
    if ( route.isFocused ) { route.isFocused = false; this.focusedRouteIndex = null; this.focusedStopIndex = null; }
    if ( route.expanded ) { route.expanded = false; route.expandFinished = false; }
  }

  resizeCard(event, route) {
    event.stopPropagation();
    event.preventDefault();

    route.expanded = !route.expanded;
    this.calculateRouteWidth(route);
    setTimeout(() => {
      route.expandFinished = !route.expandFinished;
      this.ref.detectChanges();
    }, 150);
  }

  deleteRouteStop(event, route, index) {
    event.stopPropagation();
    event.preventDefault();

    const routeIndex = this.getRouteIndexById(route.id);

    route.stops.splice(index, 1);

    this.calculateDistanceBetweenStops(routeIndex);
    this.calculateRouteWidth(route);

    this.ref.detectChanges();
  }

  mapClick(event) {
    console.log('mapClick', event);
  }

  zoomChange(event) {
    this.mapZoom = event;
  }

  getMapInstance(map) {
    this.agmMap = map;
    var mainthis = this;

    mainthis.placesService = new google.maps.places.PlacesService(map);

    this.trafficLayer = new google.maps.TrafficLayer();

    this.timeZones = new geoXML3.parser({
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

    map.addListener('click', (e) => {
      if (mainthis.stopJustAdded) {
        mainthis.stopJustAdded = false;
        return false;
      }

      if (mainthis.focusedRouteIndex != null && mainthis.stopPickerActive) {
        mainthis.geocoder.geocode(
          {
            latLng: e.latLng,
          },
          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              var sortedResults = results.sort((a, b) => {
                return (
                  b.address_components.length - a.address_components.length
                );
              });

              var result = sortedResults[0];

              if (result) {
                //console.log('geocoder result', result);

                var address = {
                  address: '',
                  city: '',
                  country: '',
                  state: '',
                  stateShortName: '',
                  street: '',
                  streetNumber: '',
                  zipCode: '',
                };

                result.address_components.map((item, index) => {
                  if (item.types.indexOf('locality') > -1) {
                    address.city = item.long_name;
                  } else if (item.types.indexOf('country') > -1) {
                    address.country = item.short_name;
                  } else if (
                    item.types.indexOf('administrative_area_level_1') > -1
                  ) {
                    address.state = item.short_name;
                    address.stateShortName = item.short_name;
                  } else if (item.types.indexOf('route') > -1) {
                    address.street = item.long_name;
                  } else if (item.types.indexOf('street_number') > -1) {
                    address.streetNumber = item.short_name;
                  } else if (item.types.indexOf('postal_code') > -1) {
                    address.zipCode = item.short_name;
                  }
                });

                if (result.formatted_address) {
                  address.address = result.formatted_address;
                }

                if (address.city && address.zipCode) {
                  mainthis.stopPickerLocation = {
                    address: address,
                    cityAddress:
                      address.city +
                      ', ' +
                      address.state +
                      ' ' +
                      address.zipCode,
                    lat: result.geometry.location.lat(),
                    long: result.geometry.location.lng(),
                    empty: null,
                  };

                  mainthis.ref.detectChanges();
                }
              }
            }
          }
        );
      }
    });
  }

  mapPlacesSearch(results, status) {
    this.placesService.getDetails(
      {
        placeId: results[0].place_id,
      },
      function (result, status) {
        console.log(result);
      }
    );
  }

  public onHandleAddress(event: any, route, index) {
    this.addressInputs.at(index).reset();
    if (event.action == 'confirm' && event.address) {
      var request = {
        query: event.address.address,
        fields: ['formatted_address', 'place_id', 'name', 'geometry'],
      };

      var mainthis = this;

      mainthis.placesService.findPlaceFromQuery(
        request,
        function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            route.stops.push({
              address: event.address,
              cityAddress:
                event.address.city +
                ', ' +
                event.address.state +
                ' ' +
                event.address.zipCode,
              leg: '60.6',
              total: '60.6',
              time: '01:15',
              totalTime: '01:15',
              empty: mainthis.addressFlag == 'Empty' ? true : false,
              lat: results[0].geometry.location.lat(),
              long: results[0].geometry.location.lng(),
            });

            mainthis.calculateDistanceBetweenStops(index);
            mainthis.calculateRouteWidth(route);
            mainthis.ref.detectChanges();
          }
        }
      );
    }
  }

  calculateDistanceBetweenStops(i: number) {
    /* Set all distance and totalDistance to 0 km or miles */
    for (let j = 0; j < this.routes[i].stops.length; j++) {
      this.routes[i].stops[j].leg = 0;
      this.routes[i].stops[j].total = 0;

      this.routes[i].stops[j].emptyDistance = 0;
      this.routes[i].stops[j].loadedDistance = 0;

      this.routes[i].hasEmptyMiles = false;

      if (this.routes[i].fuelPrice && this.routes[i].mpg) {
        this.routes[i].stops[j].legPrice = 0;
        this.routes[i].stops[j].totalPrice = 0;
      } else {
        this.routes[i].stops[j].legPrice = null;
        this.routes[i].stops[j].totalPrice = null;
      }
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
            google.maps.geometry.spherical.computeDistanceBetween(
              firstAddress,
              secondAddress
            ) * 0.000621371;
        } else {
          distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              firstAddress,
              secondAddress
            ) / 1000.0;
        }

        this.routes[i].stops[j].leg = distance;
        this.routes[i].stops[j].total =
          parseFloat(this.routes[i].stops[j - 1].total) +
          parseFloat(this.routes[i].stops[j].leg);

        this.routes[i].stops[j].emptyDistance =
          parseFloat(this.routes[i].stops[j - 1].emptyDistance) +
          (this.routes[i].stops[j].empty ? distance : 0);
        this.routes[i].stops[j].loadedDistance =
          parseFloat(this.routes[i].stops[j - 1].loadedDistance) +
          (!this.routes[i].stops[j].empty ? distance : 0);

        if (this.routes[i].fuelPrice && this.routes[i].mpg) {
          let distanceInMiles =
            this.tableData[this.selectedMapIndex].distanceUnit == 'mi'
              ? distance
              : distance / 1.609344;

          let fuel = distanceInMiles / this.routes[i].mpg;
          let tripCost = fuel * this.routes[i].fuelPrice;

          let fuelShort = fuel.toFixed(1);
          let tripCostShort = tripCost.toFixed(1);

          this.routes[i].stops[j].legPrice = tripCostShort;
          this.routes[i].stops[j].totalPrice =
            parseFloat(this.routes[i].stops[j - 1].legPrice) +
            parseFloat(this.routes[i].stops[j].legPrice);
        }
      }
    }
    for (let j = 1; j < this.routes[i].stops.length; j++) {
      var stopLeg = parseFloat(this.routes[i].stops[j].leg);
      var stopTotal = parseFloat(this.routes[i].stops[j].total);
      this.routes[i].stops[j].leg = stopLeg.toFixed(1);
      this.routes[i].stops[j].total = stopTotal.toFixed(1);

      var emptyLeg = parseFloat(this.routes[i].stops[j].emptyDistance);
      var loadedLeg = parseFloat(this.routes[i].stops[j].loadedDistance);
      this.routes[i].stops[j].emptyDistance = emptyLeg.toFixed(1);
      this.routes[i].stops[j].loadedDistance = loadedLeg.toFixed(1);

      if (this.routes[i].stops[j].emptyDistance > 0) {
        this.routes[i].hasEmptyMiles = true;
      }

      if (this.routes[i].fuelPrice && this.routes[i].mpg) {
        var legCost = parseFloat(this.routes[i].stops[j].legPrice);
        var totalCost = parseFloat(this.routes[i].stops[j].totalPrice);

        this.routes[i].stops[j].legPrice = legCost.toFixed(1);
        this.routes[i].stops[j].totalPrice = totalCost.toFixed(1);
      }
    }
  }

  callDropDownAction(event, action: any) {
    event.stopPropagation();
    event.preventDefault();

    console.log('callDropDownAction', action);

    // Edit Call
    if (action.name === 'duplicate-route') {
      this.duplicateRoute(this.dropDownActive);
    } else if (action.name === 'reverse-route-stops') {
      this.reverseRouteStops(this.dropDownActive);
    } else if (action.name === 'clear-route-stops') {
      this.clearRouteStops(this.dropDownActive);
    } else if (action.name === 'delete') {
      //this.deleteRoute(this.dropDownActive);

      var routeObj = {
        id: this.dropDownActive,
        type: "delete-item"
      }
      
      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...routeObj,
          template: 'route',
          type: 'delete'
        }
      );

    } else if ( action.name === 'open-settings' ) {
      let route = this.getRouteById(this.dropDownActive);
      this.mapToolbar.editRoute(route);
    }
  }

  showMoreOptions(event, route) {
    event.stopPropagation();
    event.preventDefault();

    route.dropdownOpen = !route.dropdownOpen;
  }

  duplicateRoute(id) {
    let route = this.getRouteById(id);

    if (route) {
      this.addressInputs.push(
        this.formBuilder.group({
          address: [],
        })
      );

      const lastId = Math.max(...this.routes.map((item) => item.id));

      const newRoute = JSON.parse(JSON.stringify(route));
      newRoute.id = lastId + 1;
      newRoute.isFocused = false;
      newRoute.expanded = false;
      newRoute.expandFinished = false;
      newRoute.hover = false;
      newRoute.nameHover = false;
      newRoute.stops.map((stop) => {
        stop.isSelected = false;
      });
      //newRoute.width = '312px';

      newRoute.color = this.findRouteColor();
      
      if ( this.routes.length < 8 ) {
        this.routes.push(newRoute);
      }

      this.showHideDuplicate();
      
      this.tableData[this.selectedMapIndex].length = this.routes.length;

      this.calculateDistanceBetweenStops(this.routes.length - 1);
      this.calculateRouteWidth(this.routes[this.routes.length - 1]);
    }
  }

  reverseRouteStops(id) {
    let route = this.getRouteById(id);

    const routeIndex = this.getRouteIndexById(id);

    if (route && route.stops && route.stops.length) {
      route.stops = route.stops.reverse();

      this.calculateDistanceBetweenStops(routeIndex);
      this.calculateRouteWidth(route);
    }
  }

  clearRouteStops(id) {
    let route = this.getRouteById(id);
    const routeIndex = this.getRouteIndexById(id);

    if (route && route.stops && route.stops.length) {
      route.stops = [];
    }
  }

  deleteRoute(id) {
    const routeIndex = this.getRouteIndexById(id);

    if (routeIndex > -1) {
      this.routes.splice(routeIndex, 1);
    }

    this.tableData[this.selectedMapIndex].length = this.routes.length;
    this.showHideDuplicate();
  }

  getRouteById(id) {
    let route = this.routes.filter((item) => item.id === id)[0];

    return route ? route : false;
  }

  getRouteIndexById(id) {
    const routeIndex = this.routes.findIndex((route) => {
      return route.id === id;
    });

    return routeIndex;
  }

  focusRoute(i) {
    this.stopPickerLocation = {};

    this.routes.map((route, index) => {
      if (index == i) {
        if (!route.hidden) {
          route.isFocused = !route.isFocused;

          if (route.isFocused) {
            this.focusedRouteIndex = i;
          } else {
            this.focusedRouteIndex = null;

            route.stops.map((stop) => {
              if ( stop.isSelected ) {
                stop.isSelected = false;
                this.focusedStopIndex = null;
              }
            });
          }
        }
      } else {
        route.isFocused = false;

        route.stops.map((stop) => {
          if (stop.isSelected) stop.isSelected = false;
        });
      }
    });
  }

  onToolBarAction(event: any) {
    if (event.action == 'add-route') {
      var routeForm = event.data;

      let lastId = Math.max(...this.routes.map((item) => item.id));
      if (!lastId || lastId < 1) {
        lastId = 1;
      }

      this.addressInputs.push(
        this.formBuilder.group({
          address: [],
        })
      );

      var newRoute = {
          'id': lastId+1,
          'name': routeForm.get('routeName').value,
          'hidden': false,
          'expanded': false,
          'routeType': routeForm.get('routeType').value,
          'truckId': routeForm.get('truckId').value ? routeForm.get('truckId').value : '',
          'stopTime': routeForm.get('durationTime').value ? routeForm.get('durationTime').value : '',
          'mpg': routeForm.get('fuelMpg').value ? routeForm.get('fuelMpg').value : '',
          'fuelPrice': routeForm.get('fuelPrice').value ? routeForm.get('fuelPrice').value : '',
          'stops': [],
          'color': this.findRouteColor()
      };

      console.log('newRoute', newRoute.color);

      if ( this.routes.length < 8 ) {
        this.routes.push(newRoute);
      }

      this.showHideDuplicate();
      
      this.calculateRouteWidth(this.routes[this.routes.length-1]);

      this.tableData[this.selectedMapIndex].length = this.routes.length;
    } else if (event.action == 'edit-route') {
      var routeForm = event.data.form;
      let route = this.getRouteById(event.data.editId);

      route.name = routeForm.get('routeName').value;
      route.routeType = routeForm.get('routeType').value;
      route.truckId = routeForm.get('truckId').value;
      route.stopTime = routeForm.get('durationTime').value;
      route.mpg = routeForm.get('fuelMpg').value;
      route.fuelPrice = routeForm.get('fuelPrice').value;

      const routeIndex = this.getRouteIndexById(event.data.editId);

      this.calculateDistanceBetweenStops(routeIndex);
      this.calculateRouteWidth(route);

      this.ref.detectChanges();
    } else if (event.action == 'map-settings') {
      var mapForm = event.data;

      var infoTypeChanged = false;
      if (
        this.tableData[this.selectedMapIndex].distanceUnit !=
        mapForm.get('distanceUnit').value
      )
        infoTypeChanged = true;
      if (
        this.tableData[this.selectedMapIndex].addressType !=
        mapForm.get('addressType').value
      )
        infoTypeChanged = true;
      if (
        this.tableData[this.selectedMapIndex].borderType !=
        mapForm.get('borderType').value
      )
        infoTypeChanged = true;

      this.tableData[this.selectedMapIndex].title =
        mapForm.get('mapName').value;
      this.tableData[this.selectedMapIndex].distanceUnit =
        mapForm.get('distanceUnit').value;
      this.tableData[this.selectedMapIndex].addressType =
        mapForm.get('addressType').value;
      this.tableData[this.selectedMapIndex].borderType =
        mapForm.get('borderType').value;

      if (infoTypeChanged) {
        this.routes.map((item, index) => {
          this.calculateDistanceBetweenStops(index);
          this.calculateRouteWidth(item);
        });
      }
    } else if (event.action == 'open-stop-picker') {
      this.stopPickerActive = !this.stopPickerActive;
      this.stopPickerLocation = {};
      if ( this.stopPickerActive ) {
        this.agmMap.setOptions({draggableCursor:'pointer'});
        this.findNextStopIndex();
      } else {
        this.agmMap.setOptions({ draggableCursor: '' });
      }
    } else if (event.action == 'open-route-compare') {
      console.log('onToolbarAction open-route-compare');
    } else if (event.action == 'open-keyboard-controls') {
      console.log('onToolbarAction open-keyboard-controls');
    } else if (event.action == 'open-route-info') {
      console.log('onToolbarAction open-route-info');
    } else if (event.action == 'open-layers') {
      console.log('onToolbarAction open-layers');
    } else if (event.action == 'toggle-toll-roads') {
      this.toggleTollRoads();
    } else if (event.action == 'toggle-time-zones') {
      this.toggleTimeZones();
    } else if (event.action == 'toggle-radar') {
      this.toggleRadar();
    } else if (event.action == 'toggle-traffic') {
      this.toggleTraffic();
    }
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        hideViewMode: true,
        showMapView: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
    };

    this.tableData = [
      {
        title: 'Map 1',
        field: 'map1',
        length: this.routes.length,
        gridNameTitle: 'Routing',
        distanceUnit: 'mi', // mi or km
        borderType: 'open', // open or closed
        addressType: 'city', // city or address
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
    if (zoom == 'minus' && this.mapZoom > 0) {
      this.mapZoom--;
    } else if (this.mapZoom < 21) {
      this.mapZoom++;
    }
  }

  addNewStop(loadType) {
    this.stopPickerLocation.empty = loadType == 'empty' ? true : false;
    this.addressFlag = loadType == 'empty' ? 'Empty' : 'Loaded';

    if (this.stopPickerLocation.editIndex != null) {
      this.routes[this.focusedRouteIndex].stops[
        this.stopPickerLocation.editIndex
      ].empty = this.stopPickerLocation.empty;
    } else {
      var insertIndex = this.focusedStopIndex != null ? this.focusedStopIndex+1 : this.routes[this.focusedRouteIndex].stops.length;

      // this.routes[this.focusedRouteIndex].stops.push({
      //   'address': this.stopPickerLocation.address,
      //   'cityAddress': this.stopPickerLocation.cityAddress,
      //   'leg': '0',
      //   'total': '0',
      //   'time': '0',
      //   'totalTime': '0',
      //   'empty': this.stopPickerLocation.empty,
      //   'lat': this.stopPickerLocation.lat,
      //   'long': this.stopPickerLocation.long
      // });

      this.routes[this.focusedRouteIndex].stops.splice(insertIndex, 0, {
        'address': this.stopPickerLocation.address,
        'cityAddress': this.stopPickerLocation.cityAddress,
        'leg': '0',
        'total': '0',
        'time': '0',
        'totalTime': '0',
        'empty': this.stopPickerLocation.empty,
        'lat': this.stopPickerLocation.lat,
        'long': this.stopPickerLocation.long
      });

      this.calculateDistanceBetweenStops(this.focusedRouteIndex);
      this.calculateRouteWidth(this.routes[this.focusedRouteIndex]);
    }

    this.stopPickerLocation = {};
    this.stopJustAdded = true;

    this.ref.detectChanges();
  }

  stopMarkerClick(event, routeIndex, stopIndex) {
    // if ( this.focusedRouteIndex != null && this.stopPickerActive) {
    //   this.stopPickerLocation = this.routes[routeIndex].stops[stopIndex];
    //   this.stopPickerLocation.editIndex = stopIndex;
    // } else {
    //   this.focusStop(event, routeIndex, stopIndex);
    // }

    if ( this.focusedRouteIndex != routeIndex ) {
      this.focusRoute(routeIndex);
    }

    this.stopPickerLocation = this.routes[routeIndex].stops[stopIndex];
    this.stopPickerLocation.editIndex = stopIndex;

    this.ref.detectChanges();
  }

  focusStop(event, routeIndex, stopIndex) {
    event.stopPropagation();
    event.preventDefault();

    var route = this.routes[routeIndex];

    if (!route.isFocused) {
      this.focusRoute(routeIndex);
    }

    route.stops.map((item, index) => {
      if (index == stopIndex) {
        item.isSelected = !item.isSelected;

        if ( item.isSelected ) {
          this.focusedStopIndex = index;
        } else {
          this.focusedStopIndex = null;
        }
      } else {
        item.isSelected = false;
      }
    });

    this.ref.detectChanges();
  }

  sortKeys = (a, b) => {
    return a.order > b.order ? -1 : 1;
  };

  toggleDropdown(event, tooltip: any, route: any) {
    event.stopPropagation();
    event.preventDefault();

    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ data: this.dropdownActions });
    }

    this.dropDownActive = tooltip.isOpen() ? route.id : -1;
  }

  hoverRoute(route) {
    if (route.hidden) {
      route.nameHover = true;
      route.hover = false;
    } else if (
      (this.tooltip &&
        this.tooltip.isOpen() &&
        this.dropDownActive == route.id) ||
      (!route.stops.length &&
        !route.truckId &&
        !route.stopTime &&
        !route.mpg &&
        !route.fuelPrice)
    ) {
      route.hover = false;
    } else {
      route.hover = true;
    }

    this.calculateRouteWidth(route);
  }

  leaveRouteHover(route) {
    route.hover = false;
    route.nameHover = false;

    this.calculateRouteWidth(route);
  }

  calculateRouteWidth(route) {
    var widthNumber = 312;

    if (route.expanded) {
      if (this.tableData[this.selectedMapIndex].addressType == 'address') {
        if (route.fuelPrice && route.hasEmptyMiles) {
          widthNumber = 792;
        } else if (route.fuelPrice && !route.hasEmptyMiles) {
          widthNumber = 664;
        } else if (!route.fuelPrice && route.hasEmptyMiles) {
          widthNumber = 640;
        } else {
          widthNumber = 512;
        }
      } else {
        if (route.fuelPrice && route.hasEmptyMiles) {
          widthNumber = 712;
        } else if (route.fuelPrice && !route.hasEmptyMiles) {
          widthNumber = 584;
        } else if (!route.fuelPrice && route.hasEmptyMiles) {
          widthNumber = 560;
        } else {
          widthNumber = 432;
        }
      }
    } else {
      if (this.tableData[this.selectedMapIndex].addressType == 'address') {
        widthNumber = 392;
      } else {
        widthNumber = 312;
      }
    }

    if (
      route.hover &&
      (route.stops.length ||
        route.truckId ||
        route.stopTime ||
        route.mpg ||
        route.fuelPrice)
    ) {
      widthNumber += 10;
    }

    route.width = widthNumber + 'px';
  }

  toggleTollRoads() {
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

  toggleTimeZones() {
    if (this.timeZones.docs.length) {
      if (!this.isTimeZoneActive) {
        this.timeZones.showDocument();
      } else {
        this.timeZones.hideDocument();
      }
      this.isTimeZoneActive = !this.isTimeZoneActive;
    } else {
      this.timeZones.parse(this.kmlUrl);
      this.isTimeZoneActive = true;
    }

    this.turnOffOtherToolActions(true, false, true, true);
  }

  toggleRadar() {
    this.isDopplerOn = !this.isDopplerOn;
    this.onToggleDoppler(this.isDopplerOn);

    this.turnOffOtherToolActions(true, true, false, true);
  }

  /* On Off Doppler Radar */
  onToggleDoppler(on: boolean) {
    if (on) {
      if (!this.tileNeXRad.length) {
        for (const rad of this.allNexrad) {
          this.tileNeXRad.push(imageMapType(rad));
        }
      }
      for (const tile of this.tileNeXRad) {
        this.agmMap.overlayMapTypes.push(tile);
      }

      for (let i = 0; i < this.agmMap.overlayMapTypes.getLength(); i++) {
        this.agmMap.overlayMapTypes.getAt(i).setOpacity(0.6);
      }

      this.startAnimation(true);
    } else {
      this.startAnimation(false);
      this.agmMap.overlayMapTypes.clear();
    }
  }

  /* Animate For Doppler Radar */
  public startAnimation(animationOn: boolean) {
    let countIntervalTime = 0;
    if (animationOn) {
      let index = this.agmMap.overlayMapTypes.getLength() - 1;
      this.dopplerInterval = window.setInterval(() => {
        this.agmMap.overlayMapTypes.getAt(index).setOpacity(0.0);
        index--;
        if (index < 0) {
          index = this.agmMap.overlayMapTypes.getLength() - 1;
        }
        this.agmMap.overlayMapTypes.getAt(index).setOpacity(0.6);
        countIntervalTime++;
        if (countIntervalTime === 700) {
          clearInterval(this.dopplerInterval);
          this.agmMap.overlayMapTypes.clear();
          this.isDopplerOn = false;
        }
      }, 400);
    } else {
      clearInterval(this.dopplerInterval);
    }
  }

  toggleTraffic() {
    this.trafficLayerShow = !this.trafficLayerShow;

    const interval = setInterval(() => {
      if (this.trafficLayerShow) {
        this.trafficLayer.setMap(this.agmMap);
        //localStorage.setItem('routingTraffic', JSON.stringify({show: true}));
      } else {
        this.trafficLayer.setMap(null);
        //localStorage.setItem('routingTraffic', JSON.stringify({show: false}));
      }
      clearInterval(interval);
    }, 200);

    this.turnOffOtherToolActions(true, true, true, false);
  }

  turnOffOtherToolActions(
    toll: boolean,
    timeZone: boolean,
    doppler: boolean,
    traffic: boolean
  ) {
    if (toll) {
      for (let i = 0; i < this.tollRoads.length; i++) {
        if (this.tollRoads[i].docs.length) {
          this.tollRoads[i].hideDocument();
        }
      }
      this.isTollRoadsActive = false;
    }
    if (timeZone) {
      if (this.timeZones.docs.length) {
        this.timeZones.hideDocument();
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
        //localStorage.setItem('routingTraffic', JSON.stringify({show: false}));
        clearInterval(interval);
      }, 200);
    }
  }

  deleteStopPickerLocation(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.stopPickerLocation.editIndex != null) {
      this.routes[this.focusedRouteIndex].stops.splice(
        this.stopPickerLocation.editIndex,
        1
      );
    }

    this.stopPickerLocation = {};

    this.ref.detectChanges();
  }

  findRouteColor() {
    var allColors = this.routeFocusColors;
    console.log('allColors', allColors);
    var takenColors = [];
    var freeColors = [];

    this.routes.map((route) => {
      takenColors.push(route.color);
    });

    console.log('takenColors', takenColors);

    allColors.map((color) => {
      var colorTaken = takenColors.indexOf(color);

      if ( colorTaken == -1 ) {
        freeColors.push(color);
      }
    });

    console.log('freeColors', freeColors);

    return freeColors[0];
  }

  showHideDuplicate() {
    if ( this.routes.length < 8 ) {
      this.dropdownActions[3].disabled = false;
    } else {
      this.dropdownActions[3].disabled = true;
    }
  }

  findNextStopIndex() {
    if ( this.focusedRouteIndex != null ) {
      this.focusedStopIndex = this.routes[this.focusedRouteIndex].stops.findIndex(
        (stop) => stop.isSelected
      );

      if ( this.focusedStopIndex == -1 ) this.focusedStopIndex = null;

      console.log('focusedStopIndex', this.focusedStopIndex);
    }
  }

  markerZoom(e, item) {
    if(e.wheelDeltaY > 0) {
      // The user scrolled up.
      this.zoomChange(this.mapZoom+1);

      if ( this.mapLatitude == item.lat && this.mapLongitude == item.long ) {
        this.mapLatitude = item.lat+0.000001;
        this.mapLongitude = item.long+0.000001;
      } else {
        this.mapLatitude = item.lat;
        this.mapLongitude = item.long;
      }
      
      console.log('markerZoom item', item);
      console.log('markerZoom mapLatitude', this.mapLatitude);
      console.log('markerZoom mapLongitude', this.mapLongitude);
    } else {
      // The user scrolled down.
      this.zoomChange(this.mapZoom-1);
    }
  }

  stopDropdownClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  switchRouteFocus(previousRoute?) {
    console.log('switchRouteFocus', previousRoute);

    if ( this.routes.length ) {
      if ( this.focusedRouteIndex != null ) {
        var nextRoute = this.focusedRouteIndex+1 < this.routes.length ? this.focusedRouteIndex+1 : 0;

        if ( previousRoute ) {
          nextRoute = this.focusedRouteIndex-1 >= 0 ? this.focusedRouteIndex-1 : this.routes.length-1;
        }

        this.focusRoute(nextRoute);
      } else {
        var focusIndex = previousRoute ? this.routes.length-1 : 0;

        this.focusRoute(focusIndex);
      }
    }
  }

  /* Up And Down Arrow Method */
  onUpAndDownArrow(event) {
    var key = event.keyCode;
    
    var currentlyFocusedStop = this.findFocusedStop(this.focusedRouteIndex);
    var nextFocusedStop = -1;
    console.log('currentlyFocusedStop', currentlyFocusedStop);

    if (key === 38) {
      /* Up Arrow */
      if (currentlyFocusedStop === -1) {
        nextFocusedStop = this.routes[this.focusedRouteIndex].stops.length - 1;
      } else {
        nextFocusedStop = currentlyFocusedStop-1 >= 0 ? currentlyFocusedStop-1 : this.routes[this.focusedRouteIndex].stops.length - 1;
      }
    } else if (key === 40) {
      /* Down Arrow */
      if (currentlyFocusedStop === -1) {
        nextFocusedStop = 0;
      } else {
        nextFocusedStop = currentlyFocusedStop+1 < this.routes[this.focusedRouteIndex].stops.length ? currentlyFocusedStop+1 : 0;
      }
    }

    this.focusStop(event, this.focusedRouteIndex, nextFocusedStop);
  }

  findFocusedStop(routeIndex) {
    const stopIndex = this.routes[routeIndex].stops.findIndex(stop => {
      return stop.isSelected;
    });

    return stopIndex;
  }

  hoverDropdownAction(mod) {
    this.actionDisabledTooltip = mod;

    setTimeout(() => {
      this.actionDisabledTooltipFinished = mod;
    }, 250);

    this.ref.detectChanges();
  }
}
