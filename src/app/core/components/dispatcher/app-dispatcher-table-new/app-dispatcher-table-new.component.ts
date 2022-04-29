import { CustomModalService } from './../../../services/modals/custom-modal.service';
import { SpinnerService } from './../../../services/spinner/spinner.service';
import { SearchDataService } from './../../../services/shared/search-data.service';
import { SearchFilterEvent } from './../../../model/searchFilter';
import { DeleteDialogComponent } from './../../shared/delete-dialog/delete-dialog.component';
import { DispatchSortService } from './../../../services/dispatchboard/dispatchsort.service';
import { SignalRService } from './../../../services/dispatchboard/app-signalr.service';
import {catchError, takeUntil} from 'rxjs/operators';
/// <reference types="@types/googlemaps" />
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Options} from 'ng5-slider';
import {forkJoin, of, Subject} from 'rxjs';
import * as AppConst from 'src/app/const';
import {CdkDrag, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {RowClassArgs} from '@progress/kendo-angular-grid';
import {AppAddLoadTableComponent} from './../app-add-load-table/app-add-load-table.component';
//import {ManageLoadComponent} from 'src/app/load/manage-load/manage-load.component';
import {SortDescriptor} from '@progress/kendo-data-query';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {NgSelectComponent} from '@ng-select/ng-select';
import { SharedService } from '../../../services/shared/shared.service';
import { AppLoadService } from '../../../services/load/app-load.service';
import { DispatcherStoreService } from '../state/dispatcher.service';

declare var google: any;

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

@Component({
  selector: 'app-app-dispatcher-table-new',
  templateUrl: './app-dispatcher-table-new.component.html',
  styleUrls: ['./app-dispatcher-table-new.component.scss'],
  animations: [
    trigger('pickupAnimation', [
      transition(':enter', [
        style({height: 100}),
        animate('200ms', style({height: '*'})),
      ]),
      transition(':leave', [
        animate('200ms', style({height: 0})),
      ]),
    ]),
    trigger('iconAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('100ms', style({opacity: '*'})),
      ]),
      transition(':leave', [
        animate('100ms', style({opacity: 0})),
      ]),
    ]),
    trigger('userTextAnimations', [
      transition(':enter', [
        style({zIndex: '100', opacity: 0.2, fontWeight: '600', transform: 'scale(1.1)'}),
        animate('100ms', style({opacity: 1})),
        animate('300ms', style({zIndex: 10, fontWeight: 'normal', transform: 'scale(1)'})),
      ]),
      transition(':leave', [
        style({zIndex: '100', opacity: 0.2, fontWeight: '600', transform: 'scale(1.1)'}),
        animate('50ms', style({opacity: 1})),
        animate('100ms', style({zIndex: 10, fontWeight: 'normal', transform: 'scale(1)'})),
      ]),
    ]),
    trigger(('statusAnimation'), [
      transition('* => status', [
        style({zIndex: '100', opacity: 0.2, transform: 'scale(1.2)'}),
        animate('100ms', style({opacity: 1})),
        animate('300ms', style({zIndex: 10, transform: 'scale(1)'})),
      ])
    ])
  ],
})
export class AppDispatcherTableNewComponent implements OnInit, OnChanges {

  @ViewChild('truckDropdown', {static: false}) public truckDropdown: NgSelectComponent;
  @ViewChild('trailerDropdown', {static: false}) public trailerDropdown: NgSelectComponent;
  @ViewChild('driverDropdown', {static: false}) public driverDropdown: NgSelectComponent;
  @ViewChild('accordion') public accordion: any;
  @ViewChild('t2') t2: any;
  @ViewChild('newLocationField') public newLocationField: any;
  @Output() innactiveLock: EventEmitter<any> = new EventEmitter();
  @Output() formatGridData: EventEmitter<any> = new EventEmitter();
  @Output() openAllNoteses: EventEmitter<any> = new EventEmitter();
  @Output() formatUniqGridData: EventEmitter<any> = new EventEmitter();
  @Input() mainGridData: any;
  @Input() headerTitle: string;
  @Input() openAllNotesText: boolean;
  @Input() manualLock: any;
  // @Input() infoCount: any;
  // NEW ITEMS
  @Output() hoverPhoneEmail: EventEmitter<any> = new EventEmitter();
  @Output() updateUsersData: EventEmitter<any> = new EventEmitter();
  @Input() dispatcher: any;
  @Input() gridIndex = -1;
  @Input() phoneEmailToggle: any;
  @Input() dispatcherInfo: any;
  @Input() isBoardLocked: boolean;
  @Input() loadTrailers: any;
  @Input() loadTrucks: any;
  @Input() loadDrivers: any;
  infoCount: any = {
    truckNumber: 0,
    trailerNumber: 0,
    driverNumber: 0
  }
  highlightingWords: any[] = [];
  phoneEmailToggleHovered = false;
  startTruckDispachId: number;
  origin = {lat: 0, lng: 0};
  destination = {lat: 0, lng: 0};
  distance = '0 miles';
  waypoints = [];
  dispatchStatuses = AppConst.DISPATCH_BOARD_STATUS;
  startIndexDriver: any;
  startIndexTrailer: any;
  truckList = AppConst.TRUCK_LIST;
  trailerList = AppConst.TRAILER_LIST;
  dispatch_data_loaded: boolean;
  truck_hover: boolean;
  stopLocationAddress: any;
  statusAfterAddingLocation: any;
  showAvatar: any = {};
  waitForResponse = false;
  errorBtn = false;
  // manualLock: boolean = false;
  pickDeliveryHovered: any = {};
  selectedDispatchDataWaypoints: any;
  dispatch_pickup_data: any;
  sortGridData: any = {};
  gridData: any = [];
  emptyRow: any = {
    id: null,
    loadId: null,
    total: null,
    truckNumber: null,
    status: null,
    trailerNumber: null,
    driverName: null,
    dispatcher: null,
    pickup: null,
    delivery: null,
    note: null,
    customer: null,
    sort: null,
    color: null,
    driverId: null,
    truckId: null,
    hosJson: null,
    isEmpty: true
  };
  scrollConfig = {
    suppressScrollX: true,
    suppressScrollY: false,
  };
  dispatcherItems: any[];
  panelOpenState = false;
  tooltip: any;
  inactiveValue = '00:00';
  addressOption = {
    types: ['(cities)'],
    componentRestrictions: {country: ['US', 'CA']},
  };
  options: Options = {
    floor: 0,
    ceil: 1440,
    showSelectionBar: false,
    noSwitching: true,
    hideLimitLabels: true,
    animate: false,
    maxLimit: new Date().getHours() * 60 + new Date().getMinutes(),
    translate: (value: number): string => {
      const minutes = value;
      const m = minutes % 60;
      const h = (minutes - m) / 60;
      const suffix = h >= 12 ? 'PM' : 'AM';
      const formatedH = h > 12 ? h - 12 : h;
      return formatedH.toString() + ':' + (m < 10 ? '0' : '') + m.toString() + ' ' + suffix;
    },
  };
  sliderValue = [];
  showMap = -1;
  hosHelper = {
    hos: []
  };
  user: any;
  statusOpenedIndex = -1;
  changedStatus = false;
  truckLocationPosition: any;
  signalMessageType: any;
  signalMessageId: any;
  filteringData: boolean;
  truckSelectOpened: number;
  trailerSelectOpened: number;
  driverSelectOpened: number;
  savedMainGridData: any;
  showSortItem: boolean;
  sortDest: any = "";
  loadOpenedIndx: number = -1;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private loadService: AppLoadService,
    private spinner: SpinnerService,
    private customModalService: CustomModalService,
    private shared: SharedService,
    private signalRService: SignalRService,
    public sortService: DispatchSortService,
    private toastr: ToastrService,
    private zone: NgZone,
    private changes: ChangeDetectorRef,
    private searchDateService: SearchDataService,
    public dispatcherStoreService: DispatcherStoreService
  ) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.sortService.sortUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.sortItems(false);
      });

    this.searchDateService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: SearchFilterEvent) => {
        this.highlightingWords = [];
        if (event && event.check) {
          this.highlightingWords =
            event.searchFilter && event.searchFilter.chipsFilter
              ? event.searchFilter.chipsFilter.words
              : [];
        }

        if (this.highlightingWords.length) {
          this.filteringData = true;
        }

        this.filterItemData();
      });

    if (this.dispatcher == -1 && !this.headerTitle) {
      this.signalRService.startConnection().then(res => {
        this.signalRService.addBroadcastDbStatusDataListener();
        this.signalRService.statusChange
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            data.map(item => {
              if (item.hosJson) {
                item.hosJson = JSON.parse(item.hosJson);
              }
              if (item.deliveryJson) {
                item.deliveryJson = JSON.parse(item.deliveryJson);
              }
              if (item.pickupJson) {
                item.pickupJson = JSON.parse(item.pickupJson);
              }
              if (item.driverAddress) {
                item.driverAddress = JSON.parse(item.driverAddress);
              }
              if (item.route) {
                item.route = JSON.parse(item.route);
              }
              if (item.truckloadJson) {
                item.truckloadJson = JSON.parse(item.truckloadJson);
              }

              if (item.route) {
                const routesInfo = this.findRoutesCounts(item);
                Object.assign(item, routesInfo);
              }
              return item;
            });
            this.formatUniqGridData.emit({data, title: this.headerTitle});
          });
      });
    }

    this.loadService.getDispatchData(this.dispatcherInfo.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.gridData = result;
        this.savedMainGridData = JSON.parse(JSON.stringify(result));
        this.infoCount = {
          truckNumber: 0,
          trailerNumber: 0,
          driverNumber: 0
        }
        // TODO: Remove when filed dynamically
        this.gridData.forEach((el) => {
          if (el.truckId) {
            this.infoCount.truckNumber += 1;
          }
          if (el.trailerId) {
            this.infoCount.trailerNumber += 1;
          }
          if (el.driverId) {
            this.infoCount.driverNumber += 1;
          }

          if (el.statusId > 0 && el.route) {
            const routesInfo = this.findRoutesCounts(el);
            console.log(routesInfo);
            Object.assign(el, routesInfo);
          }
          // el.color = this.returnRandomColor();
        });

        // this.gridData = new Array(500).fill({}).map((item) => {
        //   item = result[0];
        //   return item;
        // });

        //this.gridData = result;

        if (!this.isBoardLocked && this.gridData.length == 0) this.gridData.push(JSON.parse(JSON.stringify(this.emptyRow)));
        else if (!this.isBoardLocked && (this.gridData[this.gridData.length - 1].id)) this.gridData.push(JSON.parse(JSON.stringify(this.emptyRow)));
      });

    //   this.signalrService.signalReceived
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((resp: any) =>{
    //     this.handleSignalMessage(resp);
    //   });

    if (this.sliderValue.length === 0) {
      const d = new Date();
      this.sliderValue = [
        {minValue: 0, maxValue: d.getHours() * 60 + d.getMinutes(), type: 'inactive'},
      ];
    }

    this.shared.emitDeleteAction
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if (resp.data.type == 'remove-item' && resp.data.index == this.gridIndex) {
            this.waitForResponse = true;
            this.loadService.removeDispatchTuckList(resp.data.id).subscribe(() => {
              this.retreveDispatchChanges([resp.data.id]);
              // this.sendSignalMessage("tableChange",[resp.data.id], "all");
            }, (error) => this.handleDispatchError(error));
          }
        }
      );
  }

  ngOnChanges() {
    if (!this.isBoardLocked && !this.highlightingWords.length) {
      if (this.gridData.length == 0) this.gridData.push(JSON.parse(JSON.stringify(this.emptyRow)));
      else if (this.gridData[this.gridData.length - 1].id) this.gridData.push(JSON.parse(JSON.stringify(this.emptyRow)));
    } else {
      if (!this.gridData[this.gridData.length - 1]?.id) {
        this.gridData.pop();
      }
    }
  }

  onTabChanged(event?: any) {
    this.showMap = -1;
  }

  openAllNotes() {
    this.openAllNoteses.emit();
  }

  showPacContainer(e) {
    setTimeout(() => {
      this.t2.open();
      setTimeout(() => {
        const pac = $('.pac-container').detach();
        $('#pac_main_cont').append(pac);
      }, 1000);
    }, 2000);
  }

  public getDistance(origins: string, destinations: string, waypoint: any[]) {
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origins,
      destination: destinations,
      waypoints: waypoint,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        let totalDistance = 0.0;
        for (const element of response.routes[0].legs) {
          totalDistance += element.distance.value;
        }
        this.distance = (totalDistance * 0.00062137).toFixed(0).toString() + 'miles';
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTruck(event, id, elem, rowInd?, itemType?) {
    if (elem) {
      elem.blur();
    }
    const svg_placeholder_image = document.querySelector('.svg-placeholder');
    if (svg_placeholder_image) {
      svg_placeholder_image.classList.add('hidden');
    }
    if (rowInd !== null) {
      this.statusAfterAddingLocation = {truckId: event, dispatchId: id, changedRow: rowInd, type: 'truck'};
      this.gridData[rowInd].enterNewAddress = true;
      this.gridData[rowInd].truckNumber = event.truckNumber;
      setTimeout(() => {
        if (this.newLocationField) {
          this.newLocationField.nativeElement.focus();
        }
      }, 50);

      this.truckSelectOpened = -1;

      return;
    }
  }

  updateDispatchBoard(event, item, id) {
    let data: any = {};
    if (item === 'truck') {
      data = {truckId: event !== undefined ? event.id : 0};
      if (event && event.location.city) {
        // FOR LATER
        // data['pointCity'] = event.location.city;
        // data['pointState'] = event.location.stateShortName;
        data.location = event.location.city + ', ' + event.location.stateShortName;
      }
    } else if (item === 'trailer') {
      data = {trailerId: event !== undefined ? event.id : 0};
    } else if (item === 'driver') {
      data = {driverId: event !== undefined ? event.id : 0};
    } else if (item === 'note') {
      data = {note: event};
    }

    this.waitForResponse = true;
    this.loadService.editDispatchBoardData(JSON.stringify(data), id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
          // this.sendSignalMessage("tableChange",[id], "all");
          this.retreveDispatchChanges([id]);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
          this.handleDispatchError(error);
        });
  }

  openIndex(indx: number) {
    this.statusOpenedIndex = indx;
  }

  updateTruck(event: any, dataItem: any) {
    if (dataItem.driverName === null && dataItem.trailerNumber === null) {
      this.removeItem(dataItem.id, 'truck', event);
    } else {
      this.updateDispatchBoard(event, 'truck', dataItem.id);
    }
  }

  addTrailer(event, id, isTrue?, dispatchId?, elem?, rowIndx?) {
    if (elem) {
      elem.blur();
    }
    const svg_placeholder_image = document.querySelector('.svg-placeholder');
    if (svg_placeholder_image) {
      svg_placeholder_image.classList.add('hidden');
    }


    console.log(rowIndx);
    if (rowIndx) this.gridData[rowIndx].trailerNumber = event.trailerNumber;
    if (id === null) {
      this.addDispatchItem(event, 'trailer', isTrue, dispatchId);
    } else {
      this.updateDispatchBoard(event, 'trailer', id);
    }

    this.trailerSelectOpened = -1;
  }

  updateTrailer(event: any, dataItem: any) {
    if (dataItem.truckNumber === null && dataItem.driverName === null) {
      this.removeItem(dataItem.id, 'trailer', event);
    } else {
      this.updateDispatchBoard(event, 'trailer', dataItem.id);
    }
  }

  addDriver(event, id, isTrue?, dispatchId?, elem?, rowIndx?) {

    if (elem) {
      elem.blur();
    }
    const svg_placeholder_image = document.querySelector('.svg-placeholder');
    if (svg_placeholder_image) {
      svg_placeholder_image.classList.add('hidden');
    }
    if (rowIndx) {
      this.gridData[rowIndx]['driverName'] = `${event.driverFirstName} ${event.driverLastName}`;
    }
    if (id === null) {
      this.addDispatchItem(event, 'driver', isTrue, dispatchId);
    } else {
      this.updateDispatchBoard(event, 'driver', id);
    }

    this.driverSelectOpened = -1;
  }

  updateDriver(event: any, dataItem: any) {
    if (dataItem.truckNumber === null && dataItem.trailerNumber === null) {
      this.removeItem(dataItem.id, 'driver', event);
    } else {
      this.updateDispatchBoard(event, 'driver', dataItem.id);
    }
  }

  findRoutesCounts(el) {
    const routesInfo = el.route?.reduce((routesNumb, item) => {
      if (item.pointType == 'pickup') {
        routesNumb.pickupNumber = routesNumb.pickupNumber + 1;
      } else {
        routesNumb.deliveryNumber = routesNumb.deliveryNumber + 1;
      }
      return routesNumb;
    }, {pickupNumber: 0, deliveryNumber: 0});
    return routesInfo;
  }

  retreveDispatchChanges(dispatch_ids: any, fromSignal?: any) {
    const retreiveItems = [];
    if (dispatch_ids) {
      dispatch_ids.forEach(id => {
        retreiveItems.push(this.loadService.getDispatchAffectedRow(id).pipe(
          catchError(err => of(err))
        ));
      });


      forkJoin(retreiveItems)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          res => {
            this.waitForResponse = false;
            res.forEach((elem: any, index: any) => {
              if (!elem.error) {
                let exists = false;
                if (elem.route) {
                  const routesInfo = this.findRoutesCounts(elem);
                  Object.assign(elem, routesInfo);
                }

                this.savedMainGridData.map((item: any, index: number) => {
                  if (elem.id == item.id) {
                    const trcol = elem.truckColor?.toString();
                    elem.truckColor = trcol?.toLocaleLowerCase();
                    this.savedMainGridData[index] = elem;
                    exists = true;
                  }
                });
                if (!exists) {
                  const trcol = elem.truckColor?.toString();
                  elem.truckColor = trcol?.toLocaleLowerCase();
                  this.savedMainGridData.push(elem);
                }
              } else {
                this.handleDispatchError(null, true);
                const url = elem.url.split('/');
                const final_id = url[url.length - 2];
                this.savedMainGridData = this.savedMainGridData.filter(item => item.id != final_id);
              }
              this.shared.emitStatusUpdate.next(elem);
            });

            this.updateUsersData.emit();
            this.filterItemData();
            this.signalRService.broadcastDbStatusData(this.savedMainGridData.filter(item => item.id));
            if (fromSignal) {
              this.signalMessageType = fromSignal;
              this.signalMessageId = dispatch_ids[0];
              setTimeout(() => {
                this.signalMessageType = null;
                this.signalMessageId = null;
              }, 2000);
            }
          }
        );
    }
  }

  public copy(event: any): void {
    const copyText = event.target.textContent;
    const colorText = event.target.parentElement.parentElement;
    const copy = event.target.parentElement.nextSibling;
    colorText.style.opacity = '1';
    copy.style.opacity = '1';
    copy.style.width = colorText.clientWidth + 'px';
    copy.style.display = 'block';
    copy.style.transition = 'all 0.2s ease';
    setTimeout(() => {
      copy.style.opacity = '0';
      colorText.style.opacity = '0.9';
      setTimeout(() => {
        copy.style.width = '0px';
      });
    }, 1000);
    const el = document.createElement('textarea');
    el.value = copyText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    if (item.truckNumber) {
      return item.truckNumber.toLocaleLowerCase().indexOf(term) > -1;
    } else if (item.trailerNumber) {
      return item.trailerNumber.toLocaleLowerCase().indexOf(term) > -1;
    } else if (item.driverFirstName) {
      const full_name = item.driverFirstName + ' ' + item.driverLastName;
      return full_name.toLocaleLowerCase().indexOf(term) > -1;
    }
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging
    };
  }

  public findLocationInRoutes(rowIndx: number, type: string, indx: number = 1) {
    if (!this.gridData[rowIndx].route) {
      return;
    }
    const findedItem = this.gridData[rowIndx].route.find(item => {
      return item.pointType == type && item.pointOrder == indx;
    });

    if (findedItem) {
      return JSON.parse(JSON.stringify(findedItem));
    } else {
      return {
        pointCity: '',
        pointState: ''
      };
    }
  }

  addStatus(event: any, item: any, rowInd: number) {
    if (event === 'error') {
      this.statusOpenedIndex = -1;
      return;
    }

    this.gridData[this.statusOpenedIndex].statusId = event.id;
    this.statusOpenedIndex = -1;
    const data: any = {statusId: event.id, statusCounter: event.load_count};
    if ([3000, 3100, 3200, 4000].includes(event.id)) {
      const load_count = event.id == 4000 ? item.pickupNumber : event.load_count;

      if ([3000, 3100].includes(event.id)) {
        const finded_route = JSON.parse(JSON.stringify(this.findLocationInRoutes(rowInd, 'pickup', load_count)));
        data.inDateTime = new Date();
        data.pointCity = finded_route.pointCity;
        data.pointState = finded_route.pointState;
        data.routeId = finded_route.pointId;
      }

      this.waitForResponse = true;
      this.loadService.updateDispatchStatus(JSON.stringify(data), item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          // this.sendSignalMessage("tableChange",[item.id], "status");
          // this.signalRService.broadcastDbStatusData(this.gridData);
          this.retreveDispatchChanges([item.id]);
        }, (error) => this.handleDispatchError(error));
      return;
    }

    if ([5000, 5100, 5200, 6000].includes(event.id)) {
      const load_count = event.id == 6000 ? item.deliveryNumber : event.load_count;
      // const deliveryLocation = finded_route?.pointCity + ', ' + finded_route?.pointState;

      if (event.id == 5200) {
        data.outDateTime = new Date();
      } else if ([5000, 5100].includes(event.id)) {
        const finded_route = JSON.parse(JSON.stringify(this.findLocationInRoutes(rowInd, 'delivery', load_count)));
        data.inDateTime = new Date();
        data.pointCity = finded_route.pointCity;
        data.pointState = finded_route.pointState;
        data.routeId = finded_route.pointId;
      } else {
        data.pointCity = item.deliveryJson?.address.city;
        data.pointState = item.deliveryJson?.address.stateShortName;
      }

      this.waitForResponse = true;
      this.loadService.updateDispatchStatus(JSON.stringify(data), item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          // this.sendSignalMessage("tableChange",[item.id], "status");
          // this.signalRService.broadcastDbStatusData(this.gridData);
          this.retreveDispatchChanges([item.id]);
        }, (error) => this.handleDispatchError(error));
      return;
    }

    if ((event.id === 4070 || event.id === 7000 || event.id == 8000) && rowInd !== null) {
      this.statusAfterAddingLocation = {statusId: event.id, dispatchId: item.id, changedRow: rowInd, type: 'status'};
      this.gridData[rowInd].enterNewAddress = true;
      setTimeout(() => {
        if (this.newLocationField) {
          this.newLocationField.nativeElement.focus();
        }
      }, 50);
      return;
    }

    this.waitForResponse = true;
    this.loadService.updateDispatchStatus(JSON.stringify(data), item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        // this.sendSignalMessage("tableChange",[item.id], "status");
        // this.signalRService.broadcastDbStatusData(this.gridData);
        this.retreveDispatchChanges([item.id]);
      }, (error) => this.handleDispatchError(error));
  }

  public startingPointDeadHeadingDistance(location, destination) {
    return new Promise((resolve, reject) => {
      new google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins: [location],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING
        }, (results: any) => {
          if (results.rows[0].elements[0].status == 'NOT_FOUND' || results.rows[0].elements[0].status == 'ZERO_RESULTS') {
            resolve(0);
          } else {
            resolve(parseInt((results.rows[0].elements[0].distance.value * 0.00062137).toFixed(0)));
          }
        });
    });
  }

  public blurDriver(e) {
    console.log(e);
    console.log('bluric');
  }

  addStatusWithLocation(location: any) {
    if (this.statusAfterAddingLocation) {
      if (this.statusAfterAddingLocation.type == 'truck') {
        this.statusAfterAddingLocation.truckId.location = location;
        this.addTruckWithLocation(this.statusAfterAddingLocation.dispatchId, this.statusAfterAddingLocation.truckId);
        delete this.stopLocationAddress;
        return;
      }
      const data: any = {
        statusId: this.statusAfterAddingLocation.statusId,
        pointCity: location.city,
        pointState: location.stateShortName
      };
      delete this.stopLocationAddress;
      this.waitForResponse = true;
      this.startingPointDeadHeadingDistance(this.truckLocationPosition, this.gridData[this.statusAfterAddingLocation.changedRow].location).then(res => {
        data.distanceMiles = res;
        data.pointDateTime = new Date();
        this.loadService.updateDispatchStatus(JSON.stringify(data), this.statusAfterAddingLocation.dispatchId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((result: any) => {
            // this.sendSignalMessage("tableChange",[this.statusAfterAddingLocation.dispatchId], "status");
            this.retreveDispatchChanges([this.statusAfterAddingLocation.dispatchId]);
          }, (error) => this.handleDispatchError(error));
      });
    }
  }

  handleDispatchError(err?, showMsg?) {
    // this.errorBtn = true;
    const errorMessage = (err && err.error) ? err.error : 'Something went wrong.';
    if (!showMsg) {
      this.toastr.error(errorMessage);
    }
    setTimeout(() => {
      this.waitForResponse = false;
      this.errorBtn = false;
    }, 500);
  }

  addTruckWithLocation(id, event) {
    this.waitForResponse = true;
    if (id === null) {
      this.addDispatchItem(event, 'truck');
    } else {
      this.updateDispatchBoard(event, 'truck', id);
    }
  }

  locationChangeBlur(rowInd: number) {
    setTimeout(() => {
      delete this.gridData[rowInd].enterNewAddress;
      this.gridData[rowInd].statusId = this.statusAfterAddingLocation.statusId;
      if (this.gridData[rowInd].id) {
        this.retreveDispatchChanges([this.gridData[rowInd].id]);
      } else this.gridData[rowInd] = JSON.parse(JSON.stringify(this.emptyRow));
      this.stopLocationAddress = undefined;
    }, 700);
  }

  public handleAddressChange(address: any, key?: any) {
    if (address.address_components) {
      const filtered_address = this.shared.selectAddress(null, address);
      // var full_address = filtered_address.city + ", " + filtered_address.stateShortName;
      let full_address = filtered_address;
      if (!full_address) {
        full_address = this.stopLocationAddress;
      }
      this.stopLocationAddress = full_address;
      this.updateLocationChanges(full_address);
      this.addStatusWithLocation(full_address);
    }
  }

  updateLocationChanges(address: any) {
    if (this.statusAfterAddingLocation) {
      delete this.gridData[this.statusAfterAddingLocation.changedRow].enterNewAddress;
      this.truckLocationPosition = this.gridData[this.statusAfterAddingLocation.changedRow].location;
      this.gridData[this.statusAfterAddingLocation.changedRow].location = address.city + ', ' + address.stateShortName;
    }
  }

  toggle(tooltip: any, data: any) {
    this.origin = {lat: 0, lng: 0};
    this.destination = {lat: 0, lng: 0};
    this.distance = '0 miles';
    this.waypoints = [];
    const waypointRoutes = [];
    data.activeLoadData.routes.forEach((element) => {
      waypointRoutes.push({
        location: element.street,
        stopover: true,
      });
    });
    this.origin = data.activeLoadData.pickup.street;
    this.destination = data.activeLoadData.destination.street;
    this.waypoints = waypointRoutes;
    this.getDistance(
      data.activeLoadData.pickup.street,
      data.activeLoadData.destination.street,
      this.waypoints
    );
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({data});
    }
  }

  toggleLoadPopup(tooltip: any, data: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open();
      this.dispatch_data_loaded = false;
      this.onTabChanged();
      this.loadService.getByDispatchboardData(data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.dispatch_data_loaded = true;
          this.dispatch_pickup_data = res;
        });
    }
  }

  toggleNote(tooltip: any, data: any) {
    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({data});
    }
  }

  toggleHos(tooltip: any, data: any, id: number) {
    this.hosHelper.hos = [];
    if (data === null || data.hos.length === 0) {
      data = {
        hos: [
          {
            start: 0,
            end: (new Date().getHours() * 60 + new Date().getMinutes()),
            flag: 'off',
          }
        ]
      };
      this.gridData.forEach(element => {
        if (element.id === id) {
          element.hosJson = data;
        }
      });
    }
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({value: {data, id}});
      setTimeout(() => {
        data.hos.forEach((element, index) => {
          const span = document.getElementById('valueSpan_' + index);
          const cssStyle = span.nextElementSibling.children[3].attributes[3].ownerElement;
          const button = document.getElementById('buttonId_' + index);
          button.style.marginLeft = data.hos[index].end / 3.8 + 'px';
          span.style.width = cssStyle.clientWidth + 'px';
          span.style.left = element.start / 3.8 + 'px';
        });
      });
    }
  }

  openAddLoad(item: any) {
    const data = {
      truckNumber: item.truckNumber,
      dispatchBoardId: item.id
    };
    this.customModalService.openModal(AppAddLoadTableComponent, {data}, null);
  }

  addDispatchItem(event, item, isTrue?, dispatchId?) {
    let data: any = {};
    if (item === 'truck') {
      data = {truckId: event.id};
      if (event.location.city) {
        // FOR LATER
        // data['pointCity'] = event.location.city;
        // data['pointState'] = event.location.stateShortName;
        data.location = event.location.city + ', ' + event.location.stateShortName;
      }

    } else if (item === 'trailer') {
      data = {trailerId: event.id};
    } else if (item === 'driver') {
      data = {driverId: event.id};
    }
    if (this.dispatcher !== 0 && this.dispatcher !== undefined) {
      if (this.dispatcher < 0) {
        data.teamBoard = 1;
      } else {
        data.dispatcherId = this.dispatcher;
      }
    }

    this.loadService.addDispatchItem(JSON.stringify(data))
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
          this.retreveDispatchChanges([result.id]);
          // this.sendSignalMessage("tableChange",[result.id], "all");
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        });
  }

  addLoad() {
    const data = {
      type: 'new',
      id: null,
    };
    //this.customModalService.openModal(ManageLoadComponent, {data}, null, {size: 'xxl'});
  }

  removeItem(id: number, item: any, ev?: any) {
    const data = {
      name: 'delete',
      type: 'remove-item',
      item,
      text: null,
      category: 'remove item',
      id,
      index: this.gridIndex
    };
    this.customModalService.openModal(DeleteDialogComponent, {data}, null, {size: 'small'});
  }

  dropDriver(event: CdkDragDrop<string[]>, rowIndex) {
    let removeItem = false;
    const dispatchItemId = this.gridData[this.startIndexDriver].id;
    if (
      this.gridData[this.startIndexDriver].trailerNumber === null &&
      this.gridData[this.startIndexDriver].truckNumber === null &&
      this.gridData[rowIndex].driverName === null
    ) {
      removeItem = true;
    }

    const firstEl: any = this.gridData[this.startIndexDriver].driverId;
    let secondEl: any = this.gridData[rowIndex].driverId;
    const firstDriverName: any = this.gridData[this.startIndexDriver].driverName;
    const secondDriverName: any = this.gridData[rowIndex].driverName;
    this.gridData[rowIndex].driverName = firstDriverName;
    this.gridData[this.startIndexDriver].driverName = secondDriverName;

    if (this.gridData[rowIndex].id === null) {
      this.addDriver({id: firstEl}, null, true, dispatchItemId);
      if (removeItem) {
        this.waitForResponse = true;
        this.loadService.removeDispatchTuckList(dispatchItemId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            // this.retreveDispatchChanges(dispatchItemId, "delete");
            this.retreveDispatchChanges([dispatchItemId]);
            // this.sendSignalMessage("tableChange", [dispatchItemId], "all");
            this.waitForResponse = false;
          }, (error) => this.handleDispatchError(error));
      } else {
        this.updateDispatchBoard(undefined, 'driver', dispatchItemId);
        // this.sendSignalMessage("tableChange", [dispatchItemId], "all");
      }
      return;
    }
    if (secondEl === null) {
      secondEl = 0;
    }

    if (firstEl === secondEl || this.isBoardLocked) {
      return;
    }
    const data = JSON.stringify({
      dispatchIdFirst: dispatchItemId,
      driverIdFirst: firstEl,
      dispatchIdSecond: this.gridData[rowIndex].id,
      driverIdSecond: secondEl,
    });

    this.waitForResponse = true;
    this.loadService.switchDrivers(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (removeItem) {
          this.loadService.removeDispatchTuckList(dispatchItemId).subscribe(() => {
            this.retreveDispatchChanges([this.gridData[rowIndex].id, dispatchItemId]);
          }, (error) => this.handleDispatchError(error));
        } else {
          this.retreveDispatchChanges([this.gridData[rowIndex].id, dispatchItemId]);
        }
        // this.sendSignalMessage("tableChange", [this.gridData[rowIndex].id, dispatchItemId], "all");
      }, (error) => this.handleDispatchError(error));
  }

  cdkDragStartedDriver(event, rowIndex) {
    this.startIndexDriver = rowIndex;
  }

  cdkDropListEnteredDriver(event, rowIndex) {
    event.container.element.nativeElement.style.height = '0px';
  }

  dropTrailer(event: CdkDragDrop<string[]>, rowIndex) {
    let removeItem = false;
    const dispatchItemId = this.gridData[this.startIndexTrailer].id;
    if (
      this.gridData[this.startIndexTrailer].driverName === null &&
      this.gridData[this.startIndexTrailer].truckNumber === null &&
      this.gridData[rowIndex].trailerNumber === null
    ) {
      removeItem = true;
    }
    const firstEl: any = this.gridData[this.startIndexTrailer].trailerId;
    let secondEl: any = this.gridData[rowIndex].trailerId;
    const firstTrailerNumber: any = this.gridData[this.startIndexTrailer].trailerNumber;
    const trailerColor: any = this.gridData[this.startIndexTrailer].trailerColor;
    const secondTrailerNumbere: any = this.gridData[rowIndex].trailerNumber;
    this.gridData[rowIndex].trailerNumber = firstTrailerNumber;
    this.gridData[rowIndex].trailerColor = trailerColor;
    this.gridData[this.startIndexTrailer].trailerNumber = secondTrailerNumbere;

    if (this.gridData[rowIndex].id === null) {
      this.addTrailer({id: firstEl}, null, true, dispatchItemId);
      if (removeItem) {
        this.waitForResponse = true;
        this.loadService.removeDispatchTuckList(dispatchItemId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.retreveDispatchChanges([dispatchItemId]);
            // this.sendSignalMessage("tableChange", [dispatchItemId], "all");
          }, (error) => this.handleDispatchError(error))
      } else {
        this.waitForResponse = true;
        this.updateDispatchBoard(undefined, 'trailer', dispatchItemId);
        // this.sendSignalMessage("tableChange", [dispatchItemId], "all");
      }
      return;
    }

    if (secondEl === null) {
      secondEl = 0;
    }

    if (firstEl === secondEl || this.isBoardLocked) {
      return;
    }
    const data = JSON.stringify({
      dispatchIdFirst: dispatchItemId,
      trailerIdFirst: firstEl,
      dispatchIdSecond: this.gridData[rowIndex].id,
      trailerIdSecond: secondEl,
    });

    this.waitForResponse = true;
    this.loadService.switchTrailers(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
          // this.retreveDispatchChanges(dispatchItemId);
          // this.retreveDispatchChanges(this.gridData[rowIndex].id);
          if (removeItem) {
            this.loadService.removeDispatchTuckList(dispatchItemId).subscribe(() => {
              this.retreveDispatchChanges([this.gridData[rowIndex].id, dispatchItemId]);
            }, (error) => this.handleDispatchError(error));
          } else {
            this.retreveDispatchChanges([this.gridData[rowIndex].id, dispatchItemId]);
          }

          // this.sendSignalMessage("tableChange", [this.gridData[rowIndex].id, dispatchItemId], "all");
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        });
  }

  cdkDragStartedTrailer(event, rowIndex) {
    this.startIndexTrailer = rowIndex;
  }

  // USE ARROW FUNCTION NOTATION TO ACCESS COMPONENT "THIS"
  containerPredictPosition = (index: number, item: CdkDrag<number>) => {
    if (this.gridData[index].isEmpty) {
      return false;
    }

    return true;
  }

  cdkDropListEnteredTrailer(event) {
    event.container.element.nativeElement.style.height = '0';
    event.container.element.nativeElement.style.transition = 'all 0.5s ease';
  }

  connectedLists(rowIndex) {
    if (rowIndex === this.gridData.length) {
      return '';
    }
    const data = [];
    for (let i = 0; i <= this.gridData.length; i++) {
      const ni = parseInt(i + '' + this.gridIndex);
      if (i !== rowIndex) {
        data.push('driver' + ni);
      }
    }
    return data;
  }

  connectedListsTrailer(rowIndex) {
    const data = [];
    for (let i = 0; i <= this.gridData.length; i++) {
      const ni = parseInt(i + '' + this.gridIndex);
      if (i !== rowIndex) {
        data.push('trailer' + ni);
      }
    }
    return data;
  }

  returnDriverId(rowIndex: number) {
    rowIndex = parseInt(rowIndex + '' + this.gridIndex);
    return 'driver' + rowIndex;
  }

  returnTrailerId(rowIndex: number) {
    rowIndex = parseInt(rowIndex + '' + this.gridIndex);
    return 'trailer' + rowIndex;
  }

  dropList(event) {
    this.sortService.sortItem = [{field: 'status'}];
    this.sortService.sortDirection = '';
    let data: any;
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    if (event.currentIndex === this.gridData.length - 1) {
      return;
    }
    if (event.currentIndex === 0) {
      data = JSON.stringify({
        movingId: this.gridData[event.previousIndex].id,
        beforeSort: null,
        afterSort: this.gridData[event.currentIndex].sort,
      });
    } else {
      if (event.currentIndex > event.previousIndex) {
        data = JSON.stringify({
          movingId: this.gridData[event.previousIndex].id,
          beforeSort: this.gridData[event.currentIndex].sort,
          afterSort: this.gridData[event.currentIndex + 1].sort,
        });
      } else if (event.currentIndex < event.previousIndex) {
        data = JSON.stringify({
          movingId: this.gridData[event.previousIndex].id,
          beforeSort: this.gridData[event.currentIndex].sort,
          afterSort: this.gridData[event.currentIndex - 1].sort,
        });
      }
    }

    moveItemInArray(this.gridData, event.previousIndex, event.currentIndex);
    this.waitForResponse = true;
    this.loadService.switchTrucks(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.retreveDispatchChanges([this.gridData[event.previousIndex].id, this.gridData[event.currentIndex].id]);
        // this.sendSignalMessage("reorder", [event.previousIndex, event.currentIndex]);
      }, (error) => {
        this.handleDispatchError(error);
        moveItemInArray(this.gridData, event.currentIndex, event.previousIndex);
      });
  }

  returnInitials(fullName: string) {
    console.log("INITIAL NAME");
    if (fullName !== null && fullName !== undefined) {
      const initials = fullName
        .split(' ')
        .map((x) => x.charAt(0))
        .join('')
        .substr(0, 2)
        .toUpperCase();
      return initials;
    } else {
      return '';
    }
  }

  preventClick(isTrue: boolean) {
    if (isTrue) {
      document.body.classList.add('no-click');
    } else {
      document.body.classList.remove('no-click');
    }
  }

  showDetails(dataItem) {
    return dataItem.routes.length > 0;
  }

  detailClick() {
    const masterRow = document.getElementsByClassName('k-master-row') as HTMLCollectionOf<HTMLElement>;
    masterRow[0].style.display = 'table-row';
    const detailRow = document.getElementsByClassName('k-detail-row') as HTMLCollectionOf<HTMLElement>;
    detailRow[0].style.display = 'none';
  }

  onCellClick() {
    const masterRow = document.getElementsByClassName('k-master-row') as HTMLCollectionOf<HTMLElement>;
    masterRow[0].style.display = 'none';
    setTimeout(() => {
      const detailRow = document.getElementsByClassName('k-detail-row') as HTMLCollectionOf<HTMLElement>;
      detailRow[0].style.display = 'table-row';
    });
  }

  formatTime(minValue, maxValue) {
    const minutes = maxValue - minValue;
    const m = minutes % 60;
    const h = (minutes - m) / 60;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formatedH = h > 12 ? h - 12 : h;
    return h.toString() + ':' + (m < 10 ? '0' : '') + m.toString();
  }

  userChangeEnd(event, index, data) {
    this.hosHelper.hos = [];
    const span = document.getElementById('valueSpan_' + index);
    const cssStyle = span.nextElementSibling?.children[3].attributes[3].ownerElement;
    span.style.width = cssStyle.clientWidth + 'px';
    span.style.left = event.value / 3.8 + 'px';
    const button = document.getElementById('buttonId_' + index);
    button.style.marginLeft = data[index].end / 3.8 + 'px';
    data[index].start = event.value;
    data[index].end = event.highValue;
    if (data[index + 1]) {
      data[index + 1].start = event.highValue;
      const span1 = document.getElementById('valueSpan_' + (index + 1));
      const cssStyle1 = span1.nextElementSibling?.children[3].attributes[3].ownerElement;
      const button1 = document.getElementById('buttonId_' + (index + 1));
      button1.style.marginLeft = data[index + 1].end / 3.8 + 'px';
      span1.style.width = cssStyle1.clientWidth + 'px';
      span1.style.left = data[index + 1].start / 3.8 + 'px';
    }
    if (data[index - 1] !== undefined) {
      data[index - 1].end = event.value;
      const span2 = document.getElementById('valueSpan_' + (index - 1));
      const cssStyle2 = span2.nextElementSibling?.children[3].attributes[3].ownerElement;
      const button2 = document.getElementById('buttonId_' + (index - 1));
      button2.style.marginLeft = data[index - 1].end / 3.8 + 'px';
      span2.style.width = cssStyle2.clientWidth + 'px';
      span2.style.left = data[index - 1].start / 3.8 + 'px';
    }
    data = [...data];
    this.hosHelper.hos = data;
  }

  addHOS(data, hosType) {
    data.push({
      start: data[data.length - 1].end,
      end: new Date().getHours() * 60 + new Date().getMinutes(),
      flag: hosType,
    });
    setTimeout(() => {
      const span = document.getElementById('valueSpan_' + (data.length - 1));
      const button = document.getElementById('buttonId_' + (data.length - 1));
      const cssStyle = span.nextElementSibling?.children[3].attributes[3].ownerElement;
      span.style.width = cssStyle.clientWidth + 'px';
      button.style.marginLeft = data[data.length - 1].end / 3.8 + 'px';
      span.style.left = data[data.length - 1].start / 3.8 + 'px';
    });
  }

  removeHOS(data, i) {
    // data.filter((item, index) => i !== index);
    data.splice(i, 1);
  }

  // sendSignalMessage(type, dataIds, mainType?){
  //   this.signalrService.sendMessage({type: type, index: this.gridIndex, user_id: this.user.id, data: dataIds, mainType: mainType});
  // }

  mouseEnterSlider(event) {
    event.originalTarget.style.zIndex = '99999999999';
  }

  mouseLeaveSlider(event) {
    event.originalTarget.style.zIndex = 'initial';
  }

  returnValueId(i) {
    return 'valueSpan_' + i;
  }

  returnButtonId(i) {
    return 'buttonId_' + i;
  }

  dropHosList(event: any, data: any, id: number) {
    const dragEl: any = event.previousContainer.data[event.previousIndex];
    switch (data.length) {
      case 1:
        if (dragEl.flag === 'off') {
          data[0].flag = 'on';
        } else {
          data[0].flag = 'off';
        }
        setTimeout(() => {
          const span = document.getElementById('valueSpan_0');
          const button = document.getElementById('buttonId_0');
          const cssStyle = span.nextElementSibling?.children[3].attributes[3].ownerElement;
          span.style.width = cssStyle.clientWidth + 'px';
          button.style.marginLeft = data[0].end / 3.8 + 'px';
        });
        break;
      case 2:
        if (event.previousContainer.id !== event.container.id) {
          if (dragEl.flag === 'off') {
            data = [
              {
                start: data[0].start,
                end: data[1].end,
                flag: 'on',
              },
            ];
          } else {
            data = [
              {
                start: data[0].start,
                end: data[1].end,
                flag: 'off',
              },
            ];
          }
          setTimeout(() => {
            const span = document.getElementById('valueSpan_0');
            const button = document.getElementById('buttonId_0');
            const cssStyle = span.nextElementSibling?.children[3].attributes[3].ownerElement;
            span.style.width = cssStyle.clientWidth + 'px';
            button.style.marginLeft = data[0].end / 3.8 + 'px';
          });
        }
        break;
      case 3:
        if (event.previousContainer.id !== event.container.id) {
          if (event.previousIndex === 0 && event.previousContainer.data.length === 1) {
            let tempObj = {};
            if (event.previousContainer.data[event.previousIndex].flag === 'off') {
              tempObj = {
                start: event.container.data[0].start,
                end: event.container.data[1].end,
                flag: 'on',
              };
            } else {
              tempObj = {
                start: event.container.data[0].start,
                end: event.container.data[1].end,
                flag: 'off',
              };
            }
            const tempArr = [];
            tempArr.push(tempObj);
            data = tempArr;
            setTimeout(() => {
              const span = document.getElementById('valueSpan_0');
              const button = document.getElementById('buttonId_0');
              const cssStyle = span.nextElementSibling?.children[3].attributes[3].ownerElement;
              span.style.width = cssStyle.clientWidth + 'px';
              button.style.marginLeft = data[0].end / 3.8 + 'px';
            });
          } else if (event.previousContainer.data.length === 2) {
            let tempObj = {};
            const tempArr = [];
            if (event.previousIndex === 0) {
              if (event.previousContainer.data[0].flag === 'off') {
                tempObj = {
                  start: event.previousContainer.data[0].start,
                  end: event.container.data[0].end,
                  flag: 'on',
                };
              } else {
                tempObj = {
                  start: event.previousContainer.data[0].start,
                  end: event.container.data[0].end,
                  flag: 'off',
                };
              }
              tempArr.push(tempObj);
              tempArr.push(event.previousContainer.data[1]);
              data = tempArr;
              setTimeout(() => {
                const span = document.getElementById('valueSpan_0');
                const button = document.getElementById('buttonId_0');
                const cssStyle = span.nextElementSibling?.children[3].attributes[3].ownerElement;
                span.style.width = cssStyle.clientWidth + 'px';
                button.style.marginLeft = data[0].end / 3.8 + 'px';
              });
            } else if (event.previousIndex === 1) {
              if (event.previousContainer.data[1].flag === 'off') {
                tempObj = {
                  start: event.container.data[0].start,
                  end: event.previousContainer.data[1].end,
                  flag: 'on',
                };
              } else {
                tempObj = {
                  start: event.container.data[0].start,
                  end: event.previousContainer.data[1].end,
                  flag: 'off',
                };
              }
              tempArr.push(event.previousContainer.data[0]);
              tempArr.push(tempObj);
              data = tempArr;
              setTimeout(() => {
                const span = document.getElementById('valueSpan_1');
                const button = document.getElementById('buttonId_1');
                const cssStyle = span.nextElementSibling.children[3].attributes[3].ownerElement;
                span.style.width = cssStyle.clientWidth + 'px';
                button.style.marginLeft = data[1].end / 3.8 + 'px';
                span.style.left = data[1].start / 3.8 + 'px';
              });
            }
          }
        }
    }
    this.gridData.forEach(element => {
      if (element.id === id) {
        element.hosJson.hos = data;
      }
    });
  }

  returnListData(data: any, flag: string) {
    const tempArr = [];
    data.forEach((element) => {
      if (element !== undefined && element.flag === flag) {
        tempArr.push(element);
      }
    });
    return tempArr;
  }

  saveHosData(data, driverId, dataId) {
    if (data === null) {
      data = this.hosHelper;
    }
    const saveData = {doc: data};

    this.waitForResponse = true;
    this.loadService.saveHos(JSON.stringify(saveData), driverId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.retreveDispatchChanges([dataId]);
        // this.sendSignalMessage("tableChange",[dataId], "all");
      }, (error) => this.handleDispatchError(error));
  }

  returnActiveHours(data) {
    if (data.length === 0) {
      return new Date().getHours();
    } else {
      let activeHours = 0;
      activeHours = data[data.length - 1].end - data[data.length - 1].start;
      return (activeHours / 60).toFixed(0);
    }
  }

  saveNote(event, id) {
    this.updateDispatchBoard(event, 'note', id);
  }

  public userUnlockedBoard(): void {
    this.manualLock = true;
  }

  public manualReorder(data: any) {
    moveItemInArray(this.gridData, data[0], data[1]);
  }

  public handleSignalMessage(resp) {
    switch (resp.type) {
      case 'reorder':
        if (resp.index == this.gridIndex) {
          this.manualReorder(resp.data);
        }
        break;
      case 'tableChange':
        if ((resp.user_id != this.user.id && resp.index == this.gridIndex)
          || (this.headerTitle == 'Team Board' && resp.index == -1)) {
          this.retreveDispatchChanges(resp.data, resp.mainType);
          if (resp.mainType) {
            this.signalMessageType = resp.mainType;
            this.signalMessageId = resp.data[0];
            setTimeout(() => {
              this.signalMessageType = null;
              this.signalMessageId = null;
            }, 500);
          }
        }
        break;
      // case "unclock":
      //   if( this.dispatcher == -1 && this.gridIndex > -1 ) this.userUnlockedBoard();
      // break;
      case 'loadAdded':
        const load_id = resp.data[0];
        if (this.gridData.find(item => item.id == load_id)) {
          this.retreveDispatchChanges(resp.data);
        }
        break;
      default:
        // this.manualLock = false;
        // This is when user lock his dispatchBoard
        break;
    }
  }

  public hoverPhoneEmailMain(indx: number) {
    this.gridData[indx].isPhone = !this.gridData[indx].isPhone;
    //this.hoverPhoneEmail.emit();
  }

  @HostListener('document:click', ['$event'])
  handleKeyboardEvent(event: any) {
    if (event.target && event.target.className) {
      if (typeof event.target.className.includes !== 'undefined' && event.target.parentNode) {
        if (!event.target.className.includes('switch_statuses')
          && !event.target.parentNode.className.includes('switch_statuses')) {
          setTimeout(() => {
            this.statusOpenedIndex = -1;
          }, 500);
        }

        if (!event.target.className.includes('btn-transparent')
          && !event.target.parentNode.className.includes('btn-transparent')) {
          setTimeout(() => {
            this.truckSelectOpened = -1;
            this.trailerSelectOpened = -1;
            this.driverSelectOpened = -1;
          }, 200);
        }
      }
    }
  }

  setResizeGps(ev): void {
    this.gridData[ev].gps_expanded = !this.gridData[ev].gps_expanded;
  }


  // FILTER ITEMS

  showNextDropdown(indx: number): void {
    this.truckSelectOpened = this.truckSelectOpened != indx ? indx : -1;
    this.trailerSelectOpened = -1;
    this.driverSelectOpened = -1;
    setTimeout(() => {
      this.truckDropdown.focus();
    }, 300);

  }

  showNextTrailerDropdown(indx: number): void {
    this.trailerSelectOpened = this.trailerSelectOpened != indx ? indx : -1;
    this.driverSelectOpened = -1;
    this.truckSelectOpened = -1;

    setTimeout(() => {
      this.trailerDropdown.focus();
    }, 300);
  }

  showNextDriverDropdown(indx: number): void {
    this.driverSelectOpened = this.driverSelectOpened != indx ? indx : -1;
    this.trailerSelectOpened = -1;
    this.truckSelectOpened = -1;

    setTimeout(() => {
      this.driverDropdown.focus();
    }, 300);
  }

  filterItems(data: any) {
    let founded = false;
    ["truckNumber", "trailerNumber", "driverName", "driverPhone", "driverEmail", "location"].map(res => {
      if (
        data[res]?.trim()
          .toLowerCase()
          .includes(this.highlightingWords[0]?.text.toLowerCase().trim())
      ) {
        founded = true;
      }
    });

    return founded;
  }

  filterItemData() {
    if (this.highlightingWords.length && this.highlightingWords[0].text) {
      this.gridData = [...this.savedMainGridData].filter(data => {
        return this.filterItems(data);
      });
    } else if (this.savedMainGridData) {
      this.savedMainGridData.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.gridData = JSON.parse(JSON.stringify(this.savedMainGridData));
      if (!this.isBoardLocked) this.gridData.push(JSON.parse(JSON.stringify(this.emptyRow)));
    }
  }

  public handleSortItems(): void {
    if (!this.showSortItem) {
      this.showSortItem = true;
    } else {
      if (!this.sortDest) this.sortDest = "asc";
      else if (this.sortDest == "asc") this.sortDest = "desc";
      else {
        this.sortDest = null;
        this.showSortItem = false;
      }

      this.sortChange([{dir: this.sortDest, field: "status"}]);
    }
  }

  public openedRoutes(data: any) {
    if (data.isShown) {
      this.loadOpenedIndx = data.indx;
    } else {
      this.loadOpenedIndx = -1;
    }

  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sortService.sortItem = sort;
    this.sortItems(true);
    this.sortService.sortUpdated.next(null);
  }

  private sortItems(do_rotate: boolean): void {
    if (do_rotate) {
      this.sortService.sortDirection = rotate[this.sortService.sortDirection];
    }
    if (!this.isBoardLocked) {
      if (this.gridData.length < 2) {
        return;
      }
    }
    this.gridData = this.sortService.sort(
      this.gridData,
      this.sortService.sortDirection,
      this.savedMainGridData
    );

    this.shared.emitSortStatusUpdate.next(this.gridData);
  }
}

