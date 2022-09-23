import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import * as AppConst from '../../../../const';
import { MapsService } from '../../../services/shared/maps.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AddressEntity } from 'appcoretruckassist';
import { addressValidation } from '../../shared/ta-input/ta-input.regex-validations';
import { imageMapType } from 'src/assets/utils/methods-global';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { ModalService } from './../../shared/ta-modal/modal.service';
import { distinctUntilChanged, Subject, takeUntil, filter } from 'rxjs';

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
export class RoutingMapComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;

    if (key === 9) {
      /* Tab switch routes */
      event.preventDefault();
      this.switchRouteFocus(event.shiftKey);
    } else if (key === 27) {
      if (this.focusedRouteIndex != null) {
        /* Remove focus from all routes */
        this.focusRoute(this.focusedRouteIndex);
      }
    } else if (key === 46) {
      if (this.focusedRouteIndex != null) {
        /* Delete focused route */
        this.dropDownActive =
          this.tableData[this.selectedMapIndex].routes[
            this.focusedRouteIndex
          ].id;
        this.callDropDownAction(event, this.dropdownActions[6]);
      }
    } else if (key === 40 || key === 38) {
      /* Up and Down arrow */
      event.preventDefault();
      if (this.focusedRouteIndex != null) {
        this.onUpAndDownArrow(event);
      }
    } else if (key === 119) {
      if (this.focusedRouteIndex != null) {
        var currentlyFocusedStop = this.findFocusedStop(this.focusedRouteIndex);

        if (currentlyFocusedStop > -1) {
          this.deleteRouteStop(
            event,
            this.tableData[this.selectedMapIndex].routes[
              this.focusedRouteIndex
            ],
            currentlyFocusedStop
          );
        }
      }
    } else if (key === 107) {
      var addRoutePopover = this.mapToolbar.addRoutePopup;
      if (!addRoutePopover.isOpen()) {
        /* Open Add Route popover on Plus key press */
        this.mapToolbar.onShowRoutePopover(addRoutePopover);
      }
    } else if (key === 13) {
      var addRoutePopover = this.mapToolbar.addRoutePopup;
      if (addRoutePopover.isOpen()) {
        event.preventDefault();
        event.stopPropagation();

        this.mapToolbar.onToolBarAction(
          this.mapToolbar.routeToEdit?.id ? 'edit-route' : 'add-route'
        );
      }
    }

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

  freeRangeRoutesArray: any[] = [];
  _pointerPosition;
  off: any;
  scaleX = 100 / 200; //relation aspect between items.width in dropZone and items.width in List
  scaleY = 1; //relation aspect between items.height in dropZone and items.height in List
  posInside: { source: any; x: number; y: number } = {
    source: null,
    x: 0,
    y: 0,
  };

  @ViewChild('routeFreeDrag', { read: ElementRef, static: true })
  dropZone: ElementRef;

  filtercond1 = true;
  filtercond2 = false;
  changedFreeMoveTime: any;

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

    this.tableData[this.selectedMapIndex].routes.map((item, index) => {
      this.calculateDistanceBetweenStops(index);
      this.calculateRouteWidth(item);
    });

    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initAddressFields() {
    new Array(this.tableData[this.selectedMapIndex].routes.length)
      .fill(1)
      .map((item, index) => {
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

  dropRoutes(event: CdkDragDrop<string[]>) {
    if (
      event.previousContainer === event.container &&
      event.previousIndex !== event.currentIndex &&
      event.container.id == 'cdk-drop-list-0'
    ) {
      var orderPosition = this.findReorderPosition(
        event.previousIndex,
        event.currentIndex
      );
      const previousIndex = orderPosition[0];
      const nextIndex = orderPosition[1];
      moveItemInArray(event.container.data, previousIndex, nextIndex);
    } else if (event.previousContainer !== event.container) {
      var currentTime = new Date().getTime();

      if (
        !this.changedFreeMoveTime ||
        currentTime - this.changedFreeMoveTime > 100
      ) {
        event.item.data.freeMove = !event.item.data.freeMove;

        if (event.container.id == 'cdk-drop-list-0') {
          var orderPosition = this.findReorderPositionById(
            event.item.data.id,
            event.currentIndex
          );
          const previousIndex = orderPosition[0];
          const nextIndex = orderPosition[1];

          moveItemInArray(event.container.data, previousIndex, nextIndex);
        }
      }

      const rectZone = this.dropZone.nativeElement.getBoundingClientRect();
      const rectElement =
        event.item.element.nativeElement.getBoundingClientRect();

      var dropX =
        this._pointerPosition.x - this.off.x * this.scaleX - rectZone.left;
      var dropY =
        this._pointerPosition.y - this.off.y * this.scaleY - rectZone.top;

      var routePosition = this.calculateRouteGridPosition(dropX, dropY);

      event.item.data.y = routePosition.y;
      event.item.data.x = routePosition.x;

      const out =
        event.item.data.y < 0 ||
        event.item.data.x < 0 ||
        event.item.data.y > rectZone.height - rectElement.height ||
        event.item.data.x > rectZone.width - rectElement.width;

      var overlap = this.checkOverlap(
        event.item.data,
        event.item.data.x,
        event.item.data.y,
        event.item.data.x + rectElement.width,
        event.item.data.y + rectElement.height
      );

      if (event.container.id == 'cdk-drop-list-1' && (overlap || out)) {
        if (out && event.item.data.x > rectZone.width - rectElement.width) {
          var routePosition = this.calculateRouteGridPosition(
            rectZone.width - rectElement.width,
            event.item.data.y
          );
          console.log('routePosition', routePosition);

          var fieldY = routePosition.y;
          var fieldX = routePosition.x;

          if (event.item.data.y == routePosition.y) {
            fieldY = routePosition.y + 0.0001;
          }
          if (event.item.data.x == routePosition.x) {
            fieldX = routePosition.x + 0.0001;
          }

          event.item.data.y = fieldY;
          event.item.data.x = fieldX;
        } else {
          event.item.data.freeMove = false;
        }
      }
    }

    this.posInside = { source: null, x: 0, y: 0 };
  }

  checkOverlap(movedCard, left, top, right, bottom) {
    var overlap = false;

    document
      .querySelectorAll('.route-info-card')
      .forEach((cardElement: HTMLElement, i) => {
        var cardId = parseInt(cardElement.getAttribute('data-id'));
        var cardData = this.tableData[this.selectedMapIndex].routes.filter(
          (item) => item.id === cardId
        )[0];

        var rect = cardElement.getBoundingClientRect();

        var cardLeft = cardElement.offsetLeft;
        var cardTop = cardElement.offsetTop;
        var cardRight = cardElement.offsetLeft + rect.width;
        var cardBottom = cardElement.offsetTop + rect.height;

        if (cardId != movedCard.id && cardData.freeMove) {
          var overlapCurrent = !(
            right < cardLeft ||
            left > cardRight ||
            bottom < cardTop ||
            top > cardBottom
          );

          if (overlapCurrent) overlap = true;
        }
      });

    return overlap;
  }

  moved(event: CdkDragMove) {
    this._pointerPosition = event.pointerPosition;
  }

  changePosition(event: CdkDragDrop<any>, field) {
    const rectZone = this.dropZone.nativeElement.getBoundingClientRect();
    const rectElement =
      event.item.element.nativeElement.getBoundingClientRect();

    let y = +field.y + event.distance.y;
    let x = +field.x + event.distance.x;
    const out =
      y < 0 ||
      x < 0 ||
      y > rectZone.height - rectElement.height ||
      x > rectZone.width - rectElement.width;

    var overlap = this.checkOverlap(
      field,
      x,
      y,
      x + rectElement.width,
      y + rectElement.height
    );

    if (!out && !overlap) {
      var routePosition = this.calculateRouteGridPosition(x, y);
      console.log('routePosition', routePosition);

      var fieldY = routePosition.y;
      var fieldX = routePosition.x;

      if (field.y == routePosition.y) {
        fieldY = routePosition.y + 0.0001;
      }
      if (field.x == routePosition.x) {
        fieldX = routePosition.x + 0.0001;
      }

      field.y = fieldY;
      field.x = fieldX;
    } else if (!overlap) {
      if (event.previousContainer === event.container) {
        if (x > rectZone.width - rectElement.width) {
          var routePosition = this.calculateRouteGridPosition(
            rectZone.width - rectElement.width,
            y
          );
          console.log('routePosition', routePosition);

          var fieldY = routePosition.y;
          var fieldX = routePosition.x;

          if (field.y == routePosition.y) {
            fieldY = routePosition.y + 0.0001;
          }
          if (field.x == routePosition.x) {
            fieldX = routePosition.x + 0.0001;
          }

          field.y = fieldY;
          field.x = fieldX;
        } else {
          field.freeMove = false;
          this.changedFreeMoveTime = new Date().getTime();

          var orderPosition = this.findReorderPositionById(
            event.item.data.id,
            event.currentIndex
          );
          const previousIndex = orderPosition[0];
          const nextIndex = orderPosition[1];

          moveItemInArray(
            event.container.data,
            previousIndex,
            event.container.data.length - 1
          );
        }
      }
    }

    if (overlap) {
      field.y = field.y + 0.0001;
      field.x = field.x + 0.0001;
    }
  }

  changeZIndex(item: any) {
    this.tableData[this.selectedMapIndex].routes.forEach(
      (x) => (x['z-index'] = x == item ? 100 : 0)
    );
  }

  dropStops(event: CdkDragDrop<string[]>, dropArray, index) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);

    this.calculateDistanceBetweenStops(index);
    this.calculateRouteWidth(
      this.tableData[this.selectedMapIndex].routes[index]
    );
  }

  showHideRoute(event, route) {
    event.stopPropagation();
    event.preventDefault();

    route.hidden = !route.hidden;
    if (route.hidden) {
      if (route.isFocused) {
        route.isFocused = false;
        this.focusedRouteIndex = null;
        this.focusedStopIndex = null;
      }
      if (route.expanded) {
        route.expanded = false;
        route.expandFinished = false;
      }
    } else {
      const routeIndex = this.tableData[this.selectedMapIndex].routes.findIndex(
        (item) => {
          return item.id === route.id;
        }
      );

      this.focusRoute(routeIndex);
    }
  }

  resizeCard(event, route) {
    event.stopPropagation();
    event.preventDefault();

    route.expanded = !route.expanded;
    this.calculateRouteWidth(route);
    setTimeout(() => {
      if (route.freeMove && route.expanded) {
        const rectZone = this.dropZone.nativeElement.getBoundingClientRect();
        const routeElement: HTMLElement = document.querySelector(
          '[data-id="' + route.id + '"]'
        );
        const rectElement = routeElement.getBoundingClientRect();

        const out =
          route.y < 0 ||
          route.x < 0 ||
          route.y > rectZone.height - rectElement.height ||
          route.x > rectZone.width - rectElement.width;

        if (rectElement.right > rectZone.right - 20) {
          route.x -= rectElement.right - rectZone.right + 20;

          routeElement.style.transition = 'all 0.2s';
          setTimeout(() => {
            routeElement.style.transition = '';
          }, 100);
        }
        if (rectElement.bottom > rectZone.bottom - 10) {
          route.y -= rectElement.bottom - rectZone.bottom + 10;

          routeElement.style.transition = 'all 0.2s';
          setTimeout(() => {
            routeElement.style.transition = '';
          }, 100);
        }
      }

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

      if (mainthis.stopPickerLocation.editIndex != null) {
        mainthis.stopPickerLocation = {};
        mainthis.ref.detectChanges();
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

                  mainthis.stopPickerAnimation();

                  mainthis.ref.detectChanges();
                }
              }
            }
          }
        );
      }
    });
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
    for (
      let j = 0;
      j < this.tableData[this.selectedMapIndex].routes[i].stops.length;
      j++
    ) {
      this.tableData[this.selectedMapIndex].routes[i].stops[j].leg = 0;
      this.tableData[this.selectedMapIndex].routes[i].stops[j].total = 0;

      this.tableData[this.selectedMapIndex].routes[i].stops[
        j
      ].emptyDistance = 0;
      this.tableData[this.selectedMapIndex].routes[i].stops[
        j
      ].loadedDistance = 0;

      this.tableData[this.selectedMapIndex].routes[i].hasEmptyMiles = false;

      if (
        this.tableData[this.selectedMapIndex].routes[i].fuelPrice &&
        this.tableData[this.selectedMapIndex].routes[i].mpg
      ) {
        this.tableData[this.selectedMapIndex].routes[i].stops[j].legPrice = 0;
        this.tableData[this.selectedMapIndex].routes[i].stops[j].totalPrice = 0;
      } else {
        this.tableData[this.selectedMapIndex].routes[i].stops[j].legPrice =
          null;
        this.tableData[this.selectedMapIndex].routes[i].stops[j].totalPrice =
          null;
      }
    }
    /* For  Calculate Distance*/
    for (
      let j = 1;
      j < this.tableData[this.selectedMapIndex].routes[i].stops.length;
      j++
    ) {
      if (
        this.tableData[this.selectedMapIndex].routes[i].stops[j].lat !==
          undefined &&
        this.tableData[this.selectedMapIndex].routes[i].stops[j].long !==
          undefined
      ) {
        const firstAddress = new google.maps.LatLng(
          this.tableData[this.selectedMapIndex].routes[i].stops[j - 1].lat,
          this.tableData[this.selectedMapIndex].routes[i].stops[j - 1].long
        );
        const secondAddress = new google.maps.LatLng(
          this.tableData[this.selectedMapIndex].routes[i].stops[j].lat,
          this.tableData[this.selectedMapIndex].routes[i].stops[j].long
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

        this.tableData[this.selectedMapIndex].routes[i].stops[j].leg = distance;
        this.tableData[this.selectedMapIndex].routes[i].stops[j].total =
          parseFloat(
            this.tableData[this.selectedMapIndex].routes[i].stops[j - 1].total
          ) +
          parseFloat(
            this.tableData[this.selectedMapIndex].routes[i].stops[j].leg
          );

        this.tableData[this.selectedMapIndex].routes[i].stops[j].emptyDistance =
          parseFloat(
            this.tableData[this.selectedMapIndex].routes[i].stops[j - 1]
              .emptyDistance
          ) +
          (this.tableData[this.selectedMapIndex].routes[i].stops[j].empty
            ? distance
            : 0);
        this.tableData[this.selectedMapIndex].routes[i].stops[
          j
        ].loadedDistance =
          parseFloat(
            this.tableData[this.selectedMapIndex].routes[i].stops[j - 1]
              .loadedDistance
          ) +
          (!this.tableData[this.selectedMapIndex].routes[i].stops[j].empty
            ? distance
            : 0);

        if (
          this.tableData[this.selectedMapIndex].routes[i].fuelPrice &&
          this.tableData[this.selectedMapIndex].routes[i].mpg
        ) {
          let distanceInMiles =
            this.tableData[this.selectedMapIndex].distanceUnit == 'mi'
              ? distance
              : distance / 1.609344;

          let fuel =
            distanceInMiles /
            this.tableData[this.selectedMapIndex].routes[i].mpg;
          let tripCost =
            fuel * this.tableData[this.selectedMapIndex].routes[i].fuelPrice;

          let fuelShort = fuel.toFixed(1);
          let tripCostShort = tripCost.toFixed(1);

          this.tableData[this.selectedMapIndex].routes[i].stops[j].legPrice =
            tripCostShort;
          this.tableData[this.selectedMapIndex].routes[i].stops[j].totalPrice =
            parseFloat(
              this.tableData[this.selectedMapIndex].routes[i].stops[j - 1]
                .legPrice
            ) +
            parseFloat(
              this.tableData[this.selectedMapIndex].routes[i].stops[j].legPrice
            );
        }
      }
    }
    for (
      let j = 1;
      j < this.tableData[this.selectedMapIndex].routes[i].stops.length;
      j++
    ) {
      var stopLeg = parseFloat(
        this.tableData[this.selectedMapIndex].routes[i].stops[j].leg
      );
      var stopTotal = parseFloat(
        this.tableData[this.selectedMapIndex].routes[i].stops[j].total
      );
      this.tableData[this.selectedMapIndex].routes[i].stops[j].leg =
        stopLeg.toFixed(1);
      this.tableData[this.selectedMapIndex].routes[i].stops[j].total =
        stopTotal.toFixed(1);

      var emptyLeg = parseFloat(
        this.tableData[this.selectedMapIndex].routes[i].stops[j].emptyDistance
      );
      var loadedLeg = parseFloat(
        this.tableData[this.selectedMapIndex].routes[i].stops[j].loadedDistance
      );
      this.tableData[this.selectedMapIndex].routes[i].stops[j].emptyDistance =
        emptyLeg.toFixed(1);
      this.tableData[this.selectedMapIndex].routes[i].stops[j].loadedDistance =
        loadedLeg.toFixed(1);

      if (
        this.tableData[this.selectedMapIndex].routes[i].stops[j].emptyDistance >
        0
      ) {
        this.tableData[this.selectedMapIndex].routes[i].hasEmptyMiles = true;
      }

      if (
        this.tableData[this.selectedMapIndex].routes[i].fuelPrice &&
        this.tableData[this.selectedMapIndex].routes[i].mpg
      ) {
        var legCost = parseFloat(
          this.tableData[this.selectedMapIndex].routes[i].stops[j].legPrice
        );
        var totalCost = parseFloat(
          this.tableData[this.selectedMapIndex].routes[i].stops[j].totalPrice
        );

        this.tableData[this.selectedMapIndex].routes[i].stops[j].legPrice =
          legCost.toFixed(1);
        this.tableData[this.selectedMapIndex].routes[i].stops[j].totalPrice =
          totalCost.toFixed(1);
      }
    }
  }

  callDropDownAction(event, action: any) {
    event.stopPropagation();
    event.preventDefault();

    // Edit Call
    if (action.name === 'duplicate-route') {
      this.duplicateRoute(this.dropDownActive);
    } else if (action.name === 'reverse-route-stops') {
      this.reverseRouteStops(this.dropDownActive);
    } else if (action.name === 'clear-route-stops') {
      this.clearRouteStops(this.dropDownActive);
    } else if (action.name === 'delete') {
      var routeObj = {
        id: this.dropDownActive,
        type: 'delete-item',
      };

      this.modalService.openModal(
        ConfirmationModalComponent,
        { size: 'small' },
        {
          ...routeObj,
          template: 'route',
          type: 'delete',
        }
      );
    } else if (action.name === 'open-settings') {
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

      const lastId = Math.max(
        ...this.tableData[this.selectedMapIndex].routes.map((item) => item.id)
      );

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

      newRoute.color = this.findRouteColor();

      if (this.tableData[this.selectedMapIndex].routes.length < 8) {
        this.tableData[this.selectedMapIndex].routes.push(newRoute);
      }

      this.showHideDuplicate();

      this.tableData[this.selectedMapIndex].length =
        this.tableData[this.selectedMapIndex].routes.length;

      this.calculateDistanceBetweenStops(
        this.tableData[this.selectedMapIndex].routes.length - 1
      );
      this.calculateRouteWidth(
        this.tableData[this.selectedMapIndex].routes[
          this.tableData[this.selectedMapIndex].routes.length - 1
        ]
      );
    }
  }

  reverseRouteStops(id) {
    let route = this.getRouteById(id);

    const routeIndex = this.getRouteIndexById(id);

    if (route && route.stops && route.stops.length) {
      const routeElement: HTMLElement = document.querySelector(
        '[data-id="' + id + '"]'
      );

      var stopAddressElements =
        routeElement.querySelectorAll('.route-card-row');

      var addressRects = [];
      stopAddressElements.forEach((item: HTMLElement, index) => {
        addressRects.push(item.getBoundingClientRect());
      });

      stopAddressElements.forEach((item: HTMLElement, index) => {
        if (item.classList.contains('cdk-drag')) {
          var y =
            addressRects[stopAddressElements.length - index - 2].y -
            addressRects[index].y;

          item.style.transition = 'top 0.2s ease-in-out';
          item.style.top = y + 'px';

          setTimeout(() => {
            item.style.transition = '';
            item.style.top = '0px';
          }, 200);
        }
      });

      setTimeout(() => {
        route.stops = route.stops.reverse();

        this.calculateDistanceBetweenStops(routeIndex);
        this.calculateRouteWidth(route);
        this.ref.detectChanges();
      }, 200);
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
      this.tableData[this.selectedMapIndex].routes.splice(routeIndex, 1);
    }

    this.tableData[this.selectedMapIndex].length =
      this.tableData[this.selectedMapIndex].routes.length;
    this.showHideDuplicate();
  }

  getRouteById(id) {
    let route = this.tableData[this.selectedMapIndex].routes.filter(
      (item) => item.id === id
    )[0];

    return route ? route : false;
  }

  getRouteIndexById(id) {
    const routeIndex = this.tableData[this.selectedMapIndex].routes.findIndex(
      (route) => {
        return route.id === id;
      }
    );

    return routeIndex;
  }

  focusRoute(i) {
    this.stopPickerLocation = {};

    this.tableData[this.selectedMapIndex].routes.map((route, index) => {
      if (index == i) {
        if (!route.hidden) {
          route.isFocused = !route.isFocused;

          if (route.isFocused) {
            this.focusedRouteIndex = i;
          } else {
            this.focusedRouteIndex = null;

            route.stops.map((stop) => {
              if (stop.isSelected) {
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

      let lastId = Math.max(
        ...this.tableData[this.selectedMapIndex].routes.map((item) => item.id)
      );
      if (!lastId || lastId < 1) {
        lastId = 1;
      }

      this.addressInputs.push(
        this.formBuilder.group({
          address: [],
        })
      );

      var newRoute = {
        id: lastId + 1,
        name: routeForm.get('routeName').value,
        hidden: false,
        expanded: false,
        routeType: routeForm.get('routeType').value,
        truckId: routeForm.get('truckId').value
          ? routeForm.get('truckId').value
          : '',
        stopTime: routeForm.get('durationTime').value
          ? routeForm.get('durationTime').value
          : '',
        mpg: routeForm.get('fuelMpg').value
          ? routeForm.get('fuelMpg').value
          : '',
        fuelPrice: routeForm.get('fuelPrice').value
          ? routeForm.get('fuelPrice').value
          : '',
        stops: [],
        color: this.findRouteColor(),
      };

      if (this.tableData[this.selectedMapIndex].routes.length < 8) {
        this.tableData[this.selectedMapIndex].routes.push(newRoute);
      }

      this.showHideDuplicate();

      this.calculateRouteWidth(
        this.tableData[this.selectedMapIndex].routes[
          this.tableData[this.selectedMapIndex].routes.length - 1
        ]
      );

      this.tableData[this.selectedMapIndex].length =
        this.tableData[this.selectedMapIndex].routes.length;
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
        this.tableData[this.selectedMapIndex].routes.map((item, index) => {
          this.calculateDistanceBetweenStops(index);
          this.calculateRouteWidth(item);
        });
      }
    } else if (
      event.action == 'open-stop-picker' &&
      this.tableData[this.selectedMapIndex].routes.length
    ) {
      this.stopPickerActive = !this.stopPickerActive;
      this.stopPickerLocation = {};
      if (this.stopPickerActive) {
        this.agmMap.setOptions({ draggableCursor: 'pointer' });
        this.findNextStopIndex();
      } else {
        this.agmMap.setOptions({ draggableCursor: '' });
      }
    } else if (
      event.action == 'open-route-compare' &&
      this.tableData[this.selectedMapIndex].routes.length > 1
    ) {
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
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.tableData[this.selectedMapIndex].routes.map((route, routeIndex) => {
        if (route.isFocused) {
          this.focusRoute(routeIndex);
        }

        route.stops.map((stop) => {
          if (stop.isSelected) {
            stop.isSelected = false;
          }
        });
      });

      this.selectedMapIndex =
        event.tabData.field == 'map1'
          ? 0
          : event.tabData.field == 'map2'
          ? 1
          : event.tabData.field == 'map3'
          ? 2
          : 3;

      this.focusedStopIndex = null;
      this.focusedRouteIndex = null;
      this.disableStopPicker();
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
        length: 0,
        gridNameTitle: 'Routing',
        distanceUnit: 'mi', // mi or km
        borderType: 'open', // open or closed
        addressType: 'city', // city or address,
        routes: [],
      },
      {
        title: 'Map 2',
        field: 'map2',
        length: 0,
        gridNameTitle: 'Routing',
        distanceUnit: 'mi', // mi or km
        borderType: 'open', // open or closed
        addressType: 'city', // city or address,
        routes: [],
      },
      {
        title: 'Map 3',
        field: 'map3',
        length: 0,
        gridNameTitle: 'Routing',
        distanceUnit: 'mi', // mi or km
        borderType: 'open', // open or closed
        addressType: 'city', // city or address,
        routes: [],
      },
      {
        title: 'Map 4',
        field: 'map4',
        length: 0,
        gridNameTitle: 'Routing',
        distanceUnit: 'mi', // mi or km
        borderType: 'open', // open or closed
        addressType: 'city', // city or address,
        routes: [],
      },
    ];
  }

  zoomMap(zoom) {
    if (zoom == 'minus' && this.mapZoom > 0) {
      this.mapZoom--;
    } else if (this.mapZoom < 21) {
      this.mapZoom++;
    }
  }

  addNewStop(event, loadType) {
    this.stopPickerLocation.empty = loadType == 'empty' ? true : false;
    this.addressFlag = loadType == 'empty' ? 'Empty' : 'Loaded';

    if (this.stopPickerLocation.editIndex != null) {
      this.tableData[this.selectedMapIndex].routes[
        this.focusedRouteIndex
      ].stops[this.stopPickerLocation.editIndex].empty =
        this.stopPickerLocation.empty;

      this.stopJustAdded = true;
    } else {
      var insertIndex =
        this.focusedStopIndex != null
          ? this.focusedStopIndex + 1
          : this.tableData[this.selectedMapIndex].routes[this.focusedRouteIndex]
              .stops.length;

      this.tableData[this.selectedMapIndex].routes[
        this.focusedRouteIndex
      ].stops.splice(insertIndex, 0, {
        address: this.stopPickerLocation.address,
        cityAddress: this.stopPickerLocation.cityAddress,
        leg: '0',
        total: '0',
        time: '0',
        totalTime: '0',
        empty: this.stopPickerLocation.empty,
        lat: this.stopPickerLocation.lat,
        long: this.stopPickerLocation.long,
      });

      this.focusStop(
        event,
        this.focusedRouteIndex,
        this.tableData[this.selectedMapIndex].routes[this.focusedRouteIndex]
          .stops.length - 1
      );

      this.calculateDistanceBetweenStops(this.focusedRouteIndex);
      this.calculateRouteWidth(
        this.tableData[this.selectedMapIndex].routes[this.focusedRouteIndex]
      );
    }

    this.stopPickerLocation = {};
    //this.stopJustAdded = true;

    this.ref.detectChanges();
  }

  stopMarkerClick(event, routeIndex, stopIndex) {
    if (this.focusedRouteIndex != routeIndex) {
      this.focusRoute(routeIndex);
    }

    this.focusStop(event, routeIndex, stopIndex);

    this.stopPickerLocation =
      this.tableData[this.selectedMapIndex].routes[routeIndex].stops[stopIndex];
    this.stopPickerLocation.editIndex = stopIndex;

    this.stopPickerAnimation();

    this.ref.detectChanges();
  }

  focusStop(event, routeIndex, stopIndex) {
    event.stopPropagation();
    event.preventDefault();

    var route = this.tableData[this.selectedMapIndex].routes[routeIndex];

    if (!route.isFocused) {
      this.focusRoute(routeIndex);
    }

    route.stops.map((item, index) => {
      if (index == stopIndex) {
        item.isSelected = !item.isSelected;

        if (item.isSelected) {
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

    this.dropdownActions.map((action, index) => {
      if (
        [
          'open-report',
          'print-route',
          'duplicate-route',
          'reverse-route-stops',
          'clear-route-stops',
        ].includes(action.name)
      ) {
        if (route.stops.length) {
          action.disabled = false;
        } else {
          action.disabled = true;
        }
      }
    });

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
      } else {
        this.trafficLayer.setMap(null);
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
        clearInterval(interval);
      }, 200);
    }
  }

  deleteStopPickerLocation(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.stopPickerLocation.editIndex != null) {
      this.tableData[this.selectedMapIndex].routes[
        this.focusedRouteIndex
      ].stops.splice(this.stopPickerLocation.editIndex, 1);
    }

    this.stopPickerLocation = {};

    this.ref.detectChanges();
  }

  findRouteColor() {
    var allColors = this.routeFocusColors;
    var takenColors = [];
    var freeColors = [];

    this.tableData[this.selectedMapIndex].routes.map((route) => {
      takenColors.push(route.color);
    });

    allColors.map((color) => {
      var colorTaken = takenColors.indexOf(color);

      if (colorTaken == -1) {
        freeColors.push(color);
      }
    });

    return freeColors[0];
  }

  showHideDuplicate() {
    if (this.tableData[this.selectedMapIndex].routes.length < 8) {
      this.dropdownActions[3].disabled = false;
      this.dropdownActions[3].disabledTooltip = '';
    } else {
      this.dropdownActions[3].disabled = true;
      this.dropdownActions[3].disabledTooltip = '8 Route Limit';
    }
  }

  findNextStopIndex() {
    if (this.focusedRouteIndex != null) {
      this.focusedStopIndex = this.tableData[this.selectedMapIndex].routes[
        this.focusedRouteIndex
      ].stops.findIndex((stop) => stop.isSelected);

      if (this.focusedStopIndex == -1) this.focusedStopIndex = null;
    }
  }

  markerZoom(e, item) {
    if (e.wheelDeltaY > 0) {
      // The user scrolled up.
      this.zoomChange(this.mapZoom + 1);

      if (this.mapLatitude == item.lat && this.mapLongitude == item.long) {
        this.mapLatitude = item.lat + 0.000001;
        this.mapLongitude = item.long + 0.000001;
      } else {
        this.mapLatitude = item.lat;
        this.mapLongitude = item.long;
      }
    } else {
      // The user scrolled down.
      this.zoomChange(this.mapZoom - 1);
    }
  }

  stopDropdownClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  switchRouteFocus(previousRoute?) {
    if (this.tableData[this.selectedMapIndex].routes.length) {
      if (this.focusedRouteIndex != null) {
        var nextRoute =
          this.focusedRouteIndex + 1 <
          this.tableData[this.selectedMapIndex].routes.length
            ? this.focusedRouteIndex + 1
            : 0;

        if (previousRoute) {
          nextRoute =
            this.focusedRouteIndex - 1 >= 0
              ? this.focusedRouteIndex - 1
              : this.tableData[this.selectedMapIndex].routes.length - 1;
        }

        this.focusRoute(nextRoute);
      } else {
        var focusIndex = previousRoute
          ? this.tableData[this.selectedMapIndex].routes.length - 1
          : 0;

        this.focusRoute(focusIndex);
      }
    }
  }

  /* Up And Down Arrow Method */
  onUpAndDownArrow(event) {
    var key = event.keyCode;

    var currentlyFocusedStop = this.findFocusedStop(this.focusedRouteIndex);
    var nextFocusedStop = -1;

    if (key === 38) {
      /* Up Arrow */
      if (currentlyFocusedStop === -1) {
        nextFocusedStop =
          this.tableData[this.selectedMapIndex].routes[this.focusedRouteIndex]
            .stops.length - 1;
      } else {
        nextFocusedStop =
          currentlyFocusedStop - 1 >= 0
            ? currentlyFocusedStop - 1
            : this.tableData[this.selectedMapIndex].routes[
                this.focusedRouteIndex
              ].stops.length - 1;
      }
    } else if (key === 40) {
      /* Down Arrow */
      if (currentlyFocusedStop === -1) {
        nextFocusedStop = 0;
      } else {
        nextFocusedStop =
          currentlyFocusedStop + 1 <
          this.tableData[this.selectedMapIndex].routes[this.focusedRouteIndex]
            .stops.length
            ? currentlyFocusedStop + 1
            : 0;
      }
    }

    this.focusStop(event, this.focusedRouteIndex, nextFocusedStop);
  }

  findFocusedStop(routeIndex) {
    const stopIndex = this.tableData[this.selectedMapIndex].routes[
      routeIndex
    ].stops.findIndex((stop) => {
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

  findReorderPosition(previousElementIndex, nextElementIndex) {
    var cardElements = document.querySelectorAll(
      '.route-card-scroll .route-info-card'
    );

    var previousId = parseInt(
      cardElements[previousElementIndex].getAttribute('data-id')
    );
    var nextId = parseInt(
      cardElements[nextElementIndex].getAttribute('data-id')
    );

    const previousIndex = this.tableData[
      this.selectedMapIndex
    ].routes.findIndex((route) => {
      return route.id === previousId;
    });

    const nextIndex = this.tableData[this.selectedMapIndex].routes.findIndex(
      (route) => {
        return route.id === nextId;
      }
    );

    return [previousIndex, nextIndex];
  }

  findReorderPositionById(cardId, elementIndex) {
    var cardElements = document.querySelectorAll(
      '.route-card-scroll .route-info-card'
    );

    const previousIndex = this.tableData[
      this.selectedMapIndex
    ].routes.findIndex((route) => {
      return route.id === cardId;
    });

    var nextId = 0;
    var nextIndex = elementIndex;

    if (elementIndex > cardElements.length - 1) {
      nextIndex = this.tableData[this.selectedMapIndex].routes.length;
    } else {
      nextId = parseInt(cardElements[elementIndex].getAttribute('data-id'));

      nextIndex = this.tableData[this.selectedMapIndex].routes.findIndex(
        (route) => {
          return route.id === nextId;
        }
      );
    }

    if (previousIndex > nextIndex) nextIndex++;
    if (nextIndex < 1) nextIndex = 1;

    return [previousIndex, nextIndex - 1];
  }

  calculateRouteGridPosition(x, y) {
    console.log('calculateRouteGridPosition x, y', x, y);
    return { x: Math.floor(x / 12) * 12, y: y }; // will render the element every 12 pixels horizontally
  }

  stopPickerAnimation() {
    let stopPickerElement: HTMLElement =
      document.querySelector('.stop-picker-icon');

    if (stopPickerElement) {
      stopPickerElement.classList.add('stop-picker-marker-animation');

      setTimeout(() => {
        stopPickerElement.classList.remove('stop-picker-marker-animation');
      }, 200);
    }
  }

  disableStopPicker() {
    this.stopPickerActive = false;
    this.stopPickerLocation = {};
    this.agmMap.setOptions({ draggableCursor: '' });
  }
}
