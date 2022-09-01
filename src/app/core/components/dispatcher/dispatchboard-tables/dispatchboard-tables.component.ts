import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DispatchBoardLocalResponse } from '../state/dispatcher.model';

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
  @Input() dData: DispatchBoardLocalResponse = {};
  @Input() dDataIndx: number;

  __isBoardLocked: boolean = true;

  selectTruck: FormControl = new FormControl(null);

  @Input() set isBoardLocked(isLocked: boolean){
    this.__isBoardLocked = isLocked;
    if(!isLocked){
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

  loadTrucks: any[] = [
    {
      id: 1,
      name: "534534"
    },
    {
      id: 2,
      name: "675475"
    }
  ];

  loadTrailers: any[] = [
    {
      id: 1,
      name: "534534"
    },
    {
      id: 2,
      name: "675475"
    }
  ];

  loadDrivers: any[] = [
    {
      id: 1,
      name: "Marko Markovic"
    },
    {
      id: 2,
      name: "Milos Milosevic"
    }
  ];

  // data: any[] = new Array(500).fill({}).map((result, indx) => {
  //   result = indx % 2 == 0 ? {
  //     id: 1,
  //     truckNumber: "7532",
  //     truckColor: "5ba160",
  //     trailerNumber: null,
  //     trailerColor: null,
  //     driverId: 1,
  //     driverName: "Marko Markovic",
  //     driverPhone: "55543234567",
  //     driverEmail: "em@em.com",
  //     location: null
  //   } : 
  //   {
  //     id: 2,
  //     truckNumber: null,
  //     truckColor: null,
  //     trailerNumber: "C638123",
  //     trailerColor: "e94c4c",
  //     driverId: null,
  //     driverName: null,
  //     location: null
  //   }


  //   return result;
  // });

  constructor() { }

  ngOnInit(): void {
    console.log("WHat is date", this.dData);
  }


  addTruck(e){
    console.log(e);
    this.truckSelectOpened = -1;
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
    moveItemInArray(this.dData.dispatches, event.previousIndex, event.currentIndex);
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
}
