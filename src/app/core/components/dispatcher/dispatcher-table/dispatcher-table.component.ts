import { DispatcherQuery } from './../state/dispatcher.query';
import {takeUntil} from 'rxjs/operators';
/// <reference types="@types/googlemaps" />
import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation,} from '@angular/core';
import {Subject} from 'rxjs';
//import {ManageLoadComponent} from 'src/app/load/manage-load/manage-load.component';
import * as AppConst from 'src/app/const';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
// import { AppSignalRService } from './../../../core/services/app-signalr.service';
import {environment} from 'src/environments/environment.prod';
import { AppDispatchSignalrService } from 'src/app/core/services/dispatchboard/app-dispatchSignalr.service';
import { SignalRService } from 'src/app/core/services/dispatchboard/app-signalr.service';
import { AppLoadService } from 'src/app/core/services/load/app-load.service';
import { getDataFromGpsResponse } from 'src/assets/utils/methods-global';
import { Enums } from 'src/app/core/model/enums';
import { AppIdleService } from 'src/app/core/services/dispatchboard/app-idle.service';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { DispatchSortService } from 'src/app/core/services/dispatchboard/dispatchsort.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { AppDispatcherTableNewComponent } from '../app-dispatcher-table-new/app-dispatcher-table-new.component';
import { AppAddLoadTableComponent } from '../app-add-load-table/app-add-load-table.component';
import { DispatcherHistoryComponent } from '../dispatcher-history/dispatcher-history.component';
import { DispatcherStoreService } from '../state/dispatcher.service';

declare var google: any;

@Component({
  selector: 'app-dispatcher-table',
  templateUrl: './dispatcher-table.component.html',
  styleUrls: ["../dispatcher.global.scss", './dispatcher-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AppIdleService],
  
})
export class DispatcherTableComponent implements OnInit, OnDestroy {
  @ViewChild(AppDispatcherTableNewComponent, {static: false})
  dispatcherTableNew: AppDispatcherTableNewComponent;
  @ViewChild('accordion') public accordion: any;
  dispatcherItems: any[];
  isBoardLocked = true;
  panelOpenState = false;
  truckList = AppConst.TRUCK_LIST.filter(
    (x) =>
      x.class != 'personalvehicle-icon' && x.class != 'motorcycle-icon' && x.class != 'bus-icon'
  );
  trailerList = AppConst.TRAILER_LIST;
  legendActive = false;
  trailerTab = false;
  truckTab = false;
  openAllNoteses = false;
  tempImgObj: any;
  dispatcher: any = 0;
  selectedDispatcher: any;
  sliderValue = [];
  gridData: any = [];
  mainGridData: any = {};
  mainGridDataSort: any = [];
  loadTrailers: Enums[];
  loadTrucks: Enums[];
  loadDrivers: Enums[];
  manualLock: boolean;
  public highlightingWords = [];
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
    isEmpty: true,
  };
  user: any;
  idleSubscription: any;
  lottieConfig: any = {
    path: '/assets/img/svg-json/icon-live-def.json',
    // path: '/assets/img/svg-json/live-board.json',
  };
  phoneEmailToggle = 'Email';
  trucksPositionOnMap = [];
  selectedDispatchers: any[] = [];
  savedMainGridData: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private loadService: AppLoadService,
    private customModalService: CustomModalService,
    private idleService: AppIdleService,
    private toastr: ToastrService,
    private sortService: DispatchSortService,
    private shared: SharedService,
    private http: HttpClient,
    private signalrService: SignalRService,
    private gpsDataService: AppDispatchSignalrService,
    private dispatcherQuery: DispatcherQuery,
    public dispatcherStoreService: DispatcherStoreService
  ) {
  }

  openParking(){
    this.dispatcherStoreService.parkingOpened = !this.dispatcherStoreService.parkingOpened;
  }

  loteEnter(): void {
    this.lottieConfig = {
      ...this.lottieConfig,
      path: '/assets/img/svg-json/icon-live-hov.json',
    };
  }

  loteLeave(): void {
    this.lottieConfig = {
      ...this.lottieConfig,
      path: '/assets/img/svg-json/icon-live-def.json',
    };
  }

  ngOnInit(): void {
    this.startSignalRConnetction();

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.setUserInactivityListener();

    this.dispatcherQuery.dispatchersList$
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      this.getDispatcherData(result);
    });

    this.loadService.editDispatchBoard.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // this.getDispatcherData();
    });

    this.shared.emitAllNoteOpened.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.openAllNoteses = res;
    });

    // this.signalrService.signalReceived
    // .pipe(takeUntil(this.destroy$))
    // .subscribe((resp: any) =>{
    //   this.handleSignalMessage(resp);
    // });

    this.loadService.load.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      // this.signalrService.sendMessage({type: "loadAdded", data: [res.dispatchBoardId]});
      this.getDispatcherData();
    });

    this.shared.emitCloseNote.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      ($('#collapseOne') as any).collapse('hide');
      ($('#collapseTwo') as any).collapse('hide');
      this.truckTab = false;
      this.trailerTab = false;
    });

    if (this.sliderValue.length === 0) {
      const d = new Date();
      this.sliderValue = [
        {minValue: 0, maxValue: d.getHours() * 60 + d.getMinutes(), type: 'inactive'},
      ];
    }
  }

  startSignalRConnetction() {
    this.signalrService.startConnection();
    this.signalrService.addTransferGpsDataListener();
    this.startHttpRequest();

    this.signalrService.currentGpsData.pipe(takeUntil(this.destroy$)).subscribe((gpsData: any) => {
      if (this.trucksPositionOnMap.length) {
        console.log('Desila se promena');
        for (let i = 0; i < gpsData.length; i++) {
          if (
            gpsData[i].latitude !== this.trucksPositionOnMap[i]?.lat ||
            gpsData[i].longitude !== this.trucksPositionOnMap[i]?.long ||
            (gpsData[i].motion !== this.trucksPositionOnMap[i].motion && this.trucksPositionOnMap)
          ) {
            this.trucksPositionOnMap[i] = getDataFromGpsResponse(gpsData, i);
            this.gpsDataService.sendGpsDataSingleItem(this.trucksPositionOnMap[i]);
          }
        }
      }

      if (!this.trucksPositionOnMap.length) {
        console.log('Prvi podaci');
        for (let i = 0; i < gpsData.length; i++) {
          this.trucksPositionOnMap.push(getDataFromGpsResponse(gpsData, i));
        }

        console.log('Salju se podaci');
        console.log(this.trucksPositionOnMap);
        this.gpsDataService.sendGpsData(this.trucksPositionOnMap);
      }
    });
  }

  lockUnlockBoardAndStartTimer() {
    this.isBoardLocked = !this.isBoardLocked;
    this.formatGridData();
    this.initInactiveTimer();
  }

  initInactiveTimer() {
    if (!this.isBoardLocked) {
      this.idleService.initilizeSessionTimeout();
      if (!this.idleSubscription) {
        this.setUserInactivityListener();
      }

      // if( this.dispatcher == -1 ) this.signalrService.sendMessage({"type": "unclock", "user_id": this.user.id});
    } else {
      if (this.idleSubscription) {
        this.sortService.sortItem = [{field: 'status'}];
        this.idleSubscription.unsubscribe();
        this.idleSubscription = undefined;
      }
      this.idleService.stopIdleListen();
      // if( this.dispatcher == -1 ) this.signalrService.sendMessage({"type": "lockBoard", "user_id": this.user.id});
    }
  }

  setUserInactivityListener() {
    this.idleSubscription = this.idleService.userIdlenessChecker
      .pipe(takeUntil(this.destroy$))
      .subscribe((status: string) => {
        if (status === 'STOPPED_TIMER') {
          this.isBoardLocked = !this.isBoardLocked;
          this.toastr.error('Board is locked due to inactivity');
          // this.signalrService.sendMessage({"type": "lockBoard", "user_id": this.user.id});
          this.formatGridData();
        }
        // console.log(Math.floor((new Date().getTime()/ 1000) % 60));
      });
  }

  getDispatcherItemsData() {
    this.setTruckData();
    this.setTrailerData();
    this.setDriverData();
  }

  setTruckData() {
    this.loadService
      .getDispatchTuckList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        // TODO Model set
        this.loadTrucks = result;
      });
  }

  setTrailerData() {
    this.loadService
      .getLoadTrailers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        // TODO Model set
        this.loadTrailers = result;
      });
  }

  setDriverData() {
    this.loadService
      .getLoadDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.loadDrivers = result;
      });
  }

  getDispatcherData(result?) {
        this.dispatcherItems = [...result];
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.dispatcherItems.unshift({
          id: -1,
          dispatcherFirstName: 'Team',
          dispatcherLastName: 'Board',
        });
        this.dispatcherItems.unshift({
          id: 0,
          dispatcherFirstName: 'All',
          dispatcherLastName: 'Boards',
        });

        const previous_selected = localStorage.getItem('dispatchUserSelect');
        if (!previous_selected) {
          const itemIndex = this.dispatcherItems.findIndex((item) => item.id === this.user.id);
          if (itemIndex > -1) {
            this.dispatcher = this.dispatcherItems[itemIndex].id;
            this.selectedDispatcher = JSON.parse(JSON.stringify(this.dispatcherItems[itemIndex]));
          }
        } else {
          this.selectedDispatcher = JSON.parse(
            JSON.stringify(this.dispatcherItems.find((item) => item.id == previous_selected))
          );
          this.dispatcher = parseInt(previous_selected);
          this.signalrService.startConnection();
          if (this.dispatcher == -1) {
            // if( !this.isBoardLocked ){
            //   this.signalrService.sendMessage({"type": "unclock", "user_id": this.user.id});
            // }
          }
        }

        this.refreshDispatchBoard(null);
  }

  openAddLoad(id: any) {
    this.customModalService.openModal(AppAddLoadTableComponent, {id}, null);
  }

  addLoad() {
    const data = {
      type: 'new',
      id: null,
    };
    //this.customModalService.openModal(ManageLoadComponent, {data}, null, {size: 'xxl'});
  }

  innactiveLock(status: boolean) {
    this.isBoardLocked = status;
  }

  changeDisparcher(event: any) {
    this.dispatcher = event.id;
    if (this.dispatcher != -1) {
      // this.signalrService.sendMessage({"type": "lockBoard", "user_id": this.user.id});
      // setTimeout(() =>{
      //   this.signalrService.stopConnection();
      // }, 200);
    } else if (this.dispatcher == -1) {
      this.signalrService.startConnection();
      // if( !this.isBoardLocked ){
      //   this.signalrService.sendMessage({"type": "unclock", "user_id": this.user.id});
      // }
    }

    localStorage.setItem('dispatchUserSelect', event.id);

    this.refreshDispatchBoard();
  }

  public ngOnDestroy(): void {
    // this.signalrService.sendMessage({"type": "lockBoard", "user_id": this.user.id});
    // setTimeout(() => {
    //   this.signalrService.stopConnection();
    // }, 500);
    this.signalrService.stopConnection();
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSideNav() {
    if (this.accordion.nativeElement.clientWidth === 0) {
      this.accordion.nativeElement.style.opacity = '1';
      this.accordion.nativeElement.style.width = '190px';
      this.accordion.nativeElement.style.transition = 'all 0.5s ease';
    } else {
      this.accordion.nativeElement.style.opacity = '0';
      this.accordion.nativeElement.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        this.accordion.nativeElement.style.width = '0px';
      }, 300);
    }
    this.legendActive = !this.legendActive;
    // this.truckTab = false;
    // this.trailerTab = false;
  }

  trailerTruck() {
    this.truckTab = false;
    setTimeout(() => {
      this.trailerTab = !this.trailerTab;
    }, 0);
  }

  truckTrailer() {
    this.trailerTab = false;
    setTimeout(() => {
      this.truckTab = !this.truckTab;
    }, 0);
  }

  mouseEnterTruck(event, truck) {
    this.tempImgObj = truck;
    event.target.style.backgroundColor = '#' + truck.legendcolor;
    event.target.children[1].style.backgroundColor = '#' + truck.legendcolor;
    event.target.children[1].style.backgroundImage = `url(../../../../assets/img/svgs/${truck.type}/${truck.whiteFile})`;
  }

  mouseLeaveTruck(event) {
    event.target.style.backgroundColor = 'unset';
    event.target.children[1].style.backgroundColor = 'white';
    event.target.children[1].style.backgroundImage = `url(../../../../assets/img/svgs/${this.tempImgObj.type}/${this.tempImgObj.file})`;
  }

  refreshDispatchBoard(item?: any, id?: number) {
    if (this.dispatcher) {
      id = this.dispatcher;
    }

    this.loadService
      .getDispatchData(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          this.gridData = result;
          // TODO: Remove when filed dynamically
          this.gridData.forEach((el) => {
            if (el.statusId > 0 && el.route) {
              const routesInfo = el.route ? el.route.reduce(
                (routesNumb, item) => {
                  if (item.PointType == 'pickup') {
                    routesNumb.pickupNumber = routesNumb.pickupNumber + 1;
                  } else {
                    routesNumb.deliveryNumber = routesNumb.deliveryNumber + 1;
                  }
                  return routesNumb;
                },
                {pickupNumber: 0, deliveryNumber: 0}
              ) : {pickupNumber: 0, deliveryNumber: 0};
              Object.assign(el, routesInfo);
            }
            // el.color = this.returnRandomColor();
          });
          this.getDispatcherItemsData();
          this.formatGridData(this.gridData);
        },
        (error) => {
        }
      );
  }

  updateUsersData() {
    this.getDispatcherItemsData();
  }

  returnRandomColor() {
    const colorArr = [
      'e94949',
      'ffaf47',
      'eec860',
      '47b5ff',
      '26406c',
      'af88ea',
      '822c97',
      '48b857',
      '44bec2',
      '508181',
      '4c83e2',
      '5ba160',
    ];
    const offset = 0;
    // Can be simplified to const range = colorArr.length + 1 - Nikola
    const range = colorArr.length - 0 + 1;
    const randomNumber = Math.floor(Math.random() * range) + offset;
    return colorArr[randomNumber];
  }

  openAllNotes() {
    this.openAllNoteses = !this.openAllNoteses;
    this.shared.emitAllNoteOpened.emit(this.openAllNoteses);
  }

  formatGridData(data?: any) {
    this.selectedDispatchers = [];
    if (this.dispatcher != 0) {
      this.selectedDispatchers.push(
        this.dispatcherItems.find((item) => item.id == this.dispatcher)
      );
    } else {
      this.selectedDispatchers = this.dispatcherItems
        .filter((item) => item.id != 0) 
        .sort((a, b) => {
          return a['id'] < b['id'] ? 1 : -1;
        });
    }
  }

  public userUnlockedBoard(data: any): void {
    this.manualLock = true;
  }

  public handleSignalMessage(resp) {
    switch (resp.type) {
      case 'unclock':
        if (resp.user_id != this.user.id) {
          this.userUnlockedBoard(resp.data);
        }
        break;
      case 'lockBoard':
        if (resp.user_id != this.user.id) {
          this.manualLock = false;
        }
        break;
      case 'checkLock':
        // if( !this.isBoardLocked && this.dispatcher == -1 ){
        //   this.signalrService.sendMessage({"type": "unclock", "user_id": this.user.id});
        // }
        break;
    }
  }

  public hoverPhoneEmail() {
    this.phoneEmailToggle = this.phoneEmailToggle == 'Email' ? 'Phone' : 'Email';
  }

  openDispatchHistory() {
    this.customModalService.openModal(DispatcherHistoryComponent, {dispatchersList: this.dispatcherItems}, null);
  }

  private startHttpRequest = () => {
    this.http
      .get(environment.API_ENDPOINT + 'signalr/gps')
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  };
}
