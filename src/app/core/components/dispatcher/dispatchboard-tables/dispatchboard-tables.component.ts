import { FormControl } from '@angular/forms';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DispatchBoardLocalResponse } from '../state/dispatcher.model';
import { DispatcherStoreService } from '../state/dispatcher.service';
import {
  CreateDispatchCommand,
  DispatchResponse,
  UpdateDispatchCommand,
} from 'appcoretruckassist';
import { DispatchStatus } from '../../../../../../appcoretruckassist/model/dispatchStatus';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dispatchboard-tables',
  templateUrl: './dispatchboard-tables.component.html',
  styleUrls: ['./dispatchboard-tables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('boxAnimation', [
      state(
        'filled',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'empty',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'void',
        style({
          transform: 'scale(0)',
        })
      ),
      transition('void => filled', [animate('0.3s 0s ease-out')]),
      transition('empty => filled', [animate('0.3s 0s ease-out')]),
      transition('filled => empty', [animate('0.3s 0s ease-out')]),
      transition('empty => void', [animate('0.3s 0s ease-out')]),
      transition('filled => void', [animate('0.3s 0s ease-out')]),
    ]),
    trigger('pickupAnimation', [
      transition(':enter', [
        style({ height: 100 }),
        animate('200ms', style({ height: '*' })),
      ]),
      transition(':leave', [animate('200ms', style({ height: 0 }))]),
    ]),
    trigger('iconAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: '*' })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
    trigger('userTextAnimations', [
      transition(':enter', [
        style({
          transform: 'scale(0)',
        }),
        animate('100ms', style({ opacity: 1 })),
        animate(
          '300ms',
          style({ zIndex: 10, fontWeight: 'normal', transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'scale(0)',
        }),
        animate('50ms', style({ opacity: 1 })),
        animate(
          '100ms',
          style({ zIndex: 10, fontWeight: 'normal', transform: 'scale(1)' })
        ),
      ]),
    ]),
    trigger('statusAnimation', [
      transition('* => status', [
        style({ zIndex: '100', opacity: 0.2, transform: 'scale(1.2)' }),
        animate('100ms', style({ opacity: 1 })),
        animate('300ms', style({ zIndex: 10, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class DispatchboardTablesComponent implements OnInit {
  dData: DispatchBoardLocalResponse = {};

  checkForEmpty: string = '';

  @Input() set _dData(value) {
    value.dispatches = value.dispatches.map((item) => {
      // if( !item.hoursOfService ){
      //   item.hoursOfService = {
      //     hos: []
      //   }
      // }

      return item;
    });
    this.dData = value;
  }

  @Input() dDataIndx: number;

  truckAddress: FormControl = new FormControl(null);

  truckList: any[];
  trailerList: any[];
  driverList: any[];

  @Input() set smallList(value) {
    this.truckList = value.trucks.map((item) => {
      item.name = item.truckNumber;
      return item;
    });

    this.trailerList = value.trailers.map((item) => {
      item.name = item.trailerNumber;
      return item;
    });

    this.driverList = value.drivers.map((item) => {
      item.name = `${item.firstName} ${item.lastName}`;
      return item;
    });
  }

  hosHelper = {
    hos: [],
  };

  __isBoardLocked: boolean = true;

  selectTruck: FormControl = new FormControl(null);

  @Input() set isBoardLocked(isLocked: boolean) {
    this.__isBoardLocked = isLocked;
    if (!isLocked) {
      // this.dData.dispatches.push({
      //   id: null,
      //   order: null,
      //   dispatchBoardId: null,
      //   dispatcher: null,
      //   truck: null,
      //   trailer: null,
      //   driver: null,
      //   coDriver: null,
      //   phone: null,
      //   email: null,
      //   location: null,
      //   status: null,
      //   pickup: null,
      //   delivery: null,
      //   hoursOfService: null,
      //   note: null,
      //   activeLoad: null,
      //   assignedLoads: null,
      //   isPhone: false
      // });
    }
  }

  @Input() gridData: any[] = [];
  @ViewChild('truckDropdown', { static: false })
  public truckDropdown: NgSelectComponent;
  @ViewChild('trailerDropdown', { static: false })
  public trailerDropdown: NgSelectComponent;
  @ViewChild('driverDropdown', { static: false })
  public driverDropdown: NgSelectComponent;

  truckSelectOpened: number = -1;
  trailerSelectOpened: number = -1;
  driverSelectOpened: number = -1;

  statusOpenedIndex: number = -1;

  showAddAddressField: number = -1;
  pickDeliveryHovered: any = {};

  savedTruckId: any;

  constructor(
    private dss: DispatcherStoreService,
    private chd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('WHat is date', this.dData);
  }

  addTruck(e) {
    if (e) {
      if (this.truckSelectOpened == -2) this.savedTruckId = e;
      else this.dData.dispatches[this.truckSelectOpened].truck = e;
      this.showAddAddressField = this.truckSelectOpened;
    }

    this.selectTruck.reset();
    this.truckSelectOpened = -1;
  }

  handleInputSelect(e: any) {
    if (e.valid) {
      this.updateOrAddDispatchBoardAndSend(
        'location',
        e.address,
        this.showAddAddressField
      );

      this.selectTruck.reset();
      this.showAddAddressField = -1;
    }
  }

  addDriver(e) {
    if (e) {
      const driverOrCoDriver = !this.dData.dispatches[this.driverSelectOpened]?.driver ? "driverId" : "coDriverId";
      this.updateOrAddDispatchBoardAndSend(
        driverOrCoDriver,
        e.id,
        this.driverSelectOpened
      );
    }

    this.driverSelectOpened = -1;
  }

  addStatus(e){
    if (e) {
      this.updateOrAddDispatchBoardAndSend(
        'status',
        e.name,
        this.statusOpenedIndex
      );
    }

    this.statusOpenedIndex = -1;
  }

  openIndex(indx: number) { 
    console.log("INDEX ON OPEN", indx);
    this.statusOpenedIndex = indx;
  }

  saveNoteValue(item: any) {
    this.updateOrAddDispatchBoardAndSend('note', item.note, item.dispatchIndex);
  }

  addTrailer(e) {
    console.log(e);

    if (e) {
      this.updateOrAddDispatchBoardAndSend(
        'trailerId',
        e.id,
        this.trailerSelectOpened
      );
    }

    this.selectTruck.reset();
    this.trailerSelectOpened = -1;
  }

  showNextDropdown(indx: number): void {
    this.truckSelectOpened = this.truckSelectOpened != indx ? indx : -1;
    this.trailerSelectOpened = -1;
    this.driverSelectOpened = -1;
  }

  showNextTrailerDropdown(indx: number): void {
    this.trailerSelectOpened = this.trailerSelectOpened != indx ? indx : -1;
    this.driverSelectOpened = -1;
    this.truckSelectOpened = -1;
  }

  showNextDriverDropdown(indx: number): void {
    this.driverSelectOpened = this.driverSelectOpened != indx ? indx : -1;
    this.trailerSelectOpened = -1;
    this.truckSelectOpened = -1;
  }

  dropList(event) {
    console.log(event);
    moveItemInArray(
      this.dData.dispatches,
      event.previousIndex,
      event.currentIndex
    );

    this.dss
      .reorderDispatchboard({
        dispatchBoardId: this.dData.id,
        dispatches: [
          {
            id: this.dData.dispatches[event.currentIndex].id,
            order: this.dData.dispatches[event.previousIndex].order,
          },
          {
            id: this.dData.dispatches[event.previousIndex].id,
            order: this.dData.dispatches[event.currentIndex].order,
          },
        ],
      })
      .subscribe((res) => {});
  }

  public hoverPhoneEmailMain(indx: number) {
    this.dData.dispatches[indx].isPhone = !this.dData.dispatches[indx].isPhone;
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

  removeTruck(indx) {
    this.updateOrAddDispatchBoardAndSend('truckId', null, indx);
  }

  removeTrailer(indx) {
    this.updateOrAddDispatchBoardAndSend('trailerId', null, indx);
  }

  removeDriver(indx) {
    this.updateOrAddDispatchBoardAndSend('driverId', null, indx);
  }

  updateOrAddDispatchBoardAndSend(key, value, index) {
    const oldData = this.dData.dispatches[index]
      ? JSON.parse(JSON.stringify(this.dData.dispatches[index]))
      : {};

    const dataId = oldData.id;
    let oldUpdateData: CreateDispatchCommand | UpdateDispatchCommand = {
      status: oldData.status ? (oldData.status?.name as DispatchStatus) : 'Off',
      order: oldData.order,
      truckId: oldData.truck ? oldData.truck?.id : null,
      trailerId: oldData.trailer ? oldData.trailer?.id : null,
      driverId: oldData.driver ? oldData.driver?.id : null,
      coDriverId: oldData.coDriver ? oldData.coDriver?.id : null,
      location: oldData.location?.address ? oldData.location : null,
      hourOfService: 0,
      note: oldData.note,
      loadIds: []
    };

    let newData: any = {
      ...oldUpdateData,
      [key]: value,
    };

    this.selectTruck.reset();

    console.log(key);
    console.log(value);
    console.log(newData);

    this.checkForEmpty = key;

    if (oldData.id) {
      newData = {
        id: oldData.id,
        ...newData,
      };

      if (!value && key == 'truckId') newData.location = null;

      this.dss
        .updateDispatchBoard(newData, this.dData.id)
        .pipe(
          catchError((error) => {
            this.checkEmptySet = '';
            return of([]);
          })
        )
        .subscribe((data) => {
          this.dss.updateCountList(this.dData.id, key, value);
          this.dss.updateModalList();
          this.checkEmptySet = '';
        });
    } else {
      newData.dispatchBoardId = this.dData.id;

      if (key == 'location') newData.truckId = this.savedTruckId.id;

      this.dss
        .createDispatchBoard(newData, this.dData.id)
        .pipe(
          catchError((error) => {
            this.checkEmptySet = '';
            return of([]);
          })
        )
        .subscribe((data) => {
          this.checkEmptySet = '';
          this.dss.updateCountList(this.dData.id, key, value);
          this.dss.updateModalList();
        });
    }
    // console.log("HELOOOOO", newData);
  }

  set checkEmptySet(value) {
    setTimeout(() => {
      this.checkForEmpty = value;
      this.chd.detectChanges();
    }, 300);
  }

  toggleHos(tooltip: any, data: any, id: number) {
    this.hosHelper.hos = [];
    if (data === null || data.hos.length === 0) {
      data = {
        hos: [
          {
            start: 0,
            end: new Date().getHours() * 60 + new Date().getMinutes(),
            flag: 'off',
          },
        ],
      };
      // this.gridData.forEach((element) => {
      //   if (element.id === id) {
      //     element.hosJson = data;
      //   }
      // });
    }
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ value: { data, id } });
      setTimeout(() => {
        data.hos.forEach((element, index) => {
          const span = document.getElementById('valueSpan_' + index);
          const cssStyle =
            span.nextElementSibling.children[3].attributes[3].ownerElement;
          const button = document.getElementById('buttonId_' + index);
          button.style.marginLeft = data.hos[index].end / 3.8 + 'px';
          span.style.width = cssStyle.clientWidth + 'px';
          span.style.left = element.start / 3.8 + 'px';
        });
      });
    }
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
          const cssStyle =
            span.nextElementSibling?.children[3].attributes[3].ownerElement;
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
            const cssStyle =
              span.nextElementSibling?.children[3].attributes[3].ownerElement;
            span.style.width = cssStyle.clientWidth + 'px';
            button.style.marginLeft = data[0].end / 3.8 + 'px';
          });
        }
        break;
      case 3:
        if (event.previousContainer.id !== event.container.id) {
          if (
            event.previousIndex === 0 &&
            event.previousContainer.data.length === 1
          ) {
            let tempObj = {};
            if (
              event.previousContainer.data[event.previousIndex].flag === 'off'
            ) {
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
              const cssStyle =
                span.nextElementSibling?.children[3].attributes[3].ownerElement;
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
                const cssStyle =
                  span.nextElementSibling?.children[3].attributes[3]
                    .ownerElement;
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
                const cssStyle =
                  span.nextElementSibling.children[3].attributes[3]
                    .ownerElement;
                span.style.width = cssStyle.clientWidth + 'px';
                button.style.marginLeft = data[1].end / 3.8 + 'px';
                span.style.left = data[1].start / 3.8 + 'px';
              });
            }
          }
        }
    }
    // this.gridData.forEach((element) => {
    //   if (element.id === id) {
    //     element.hosJson.hos = data;
    //   }
    // });
  }

  returnValueId(i) {
    console.log('HOS RETURN VALUE ID');
    return 'valueSpan_' + i;
  }

  formatTime(minValue, maxValue) {
    console.log('HOS RETURN VALUE formatTime');
    const minutes = maxValue - minValue;
    const m = minutes % 60;
    const h = (minutes - m) / 60;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formatedH = h > 12 ? h - 12 : h;
    return h.toString() + ':' + (m < 10 ? '0' : '') + m.toString();
  }

  returnButtonId(i) {
    return 'buttonId_' + i;
  }
}
