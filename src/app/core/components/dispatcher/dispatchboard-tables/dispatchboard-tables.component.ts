import { animate, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-dispatchboard-tables',
  templateUrl: './dispatchboard-tables.component.html',
  styleUrls: ['./dispatchboard-tables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
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
          zIndex: '100',
          opacity: 0.2,
          fontWeight: '600',
          transform: 'scale(1.1)',
        }),
        animate('100ms', style({ opacity: 1 })),
        animate(
          '300ms',
          style({ zIndex: 10, fontWeight: 'normal', transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        style({
          zIndex: '100',
          opacity: 0.2,
          fontWeight: '600',
          transform: 'scale(1.1)',
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
  @Input() gridData: any[] = [];
  @Input() isBoardLocked: boolean;
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
  ];

  loadTrailers: any[] = [
    {
      id: 1,
      trailerNumber: "534534"
    },
    {
      id: 2,
      trailerNumber: "675475"
    }
  ];

  loadDrivers: any[] = [
    {
      id: 1,
      driverName: "Marko Markovic"
    },
    {
      id: 2,
      driverName: "Milos Milosevic"
    }
  ];

  data: any[] = new Array(500).fill({}).map((result, indx) => {
    result = indx % 2 == 0 ? {
      id: 1,
      truckNumber: "7532",
      truckColor: "5ba160",
      trailerNumber: null,
      trailerColor: null,
      driverId: 1,
      driverName: "Marko Markovic",
      driverPhone: "55543234567",
      driverEmail: "em@em.com",
      location: null
    } : 
    {
      id: 2,
      truckNumber: null,
      truckColor: null,
      trailerNumber: "C638123",
      trailerColor: "e94c4c",
      driverId: null,
      driverName: null,
      location: null
    }


    return result;
  });

  constructor() { }

  ngOnInit(): void {
  }


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

  dropList(event){
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  public hoverPhoneEmailMain(indx: number) {
    this.data[indx].isPhone = !this.data[indx].isPhone;
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
