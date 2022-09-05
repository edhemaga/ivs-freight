import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
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
import { CreateDispatchCommand, DispatchResponse, UpdateDispatchCommand } from 'appcoretruckassist';
import { DispatchStatus } from '../../../../../../appcoretruckassist/model/dispatchStatus';

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

  showAddAddressField: number = -1;

  constructor(private dss: DispatcherStoreService) {}

  ngOnInit(): void {
    console.log('WHat is date', this.dData);
  }

  addTruck(e) {
    console.log(e);

    this.dData.dispatches[this.truckSelectOpened].truck = e;
    this.showAddAddressField = this.truckSelectOpened;

    this.truckSelectOpened = -1;
  }

  handleInputSelect(e: any){
    if(e.valid){
      this.updateOrAddDispatchBoardAndSend("location", e.address, this.showAddAddressField);

      this.showAddAddressField = -1;
    }
  }

  addDriver() {

    this.driverSelectOpened = -1;
  }

  addTrailer(e) {
    console.log(e);
    this.updateOrAddDispatchBoardAndSend("trailerId", e.id, this.trailerSelectOpened);
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
    moveItemInArray(
      this.dData.dispatches,
      event.previousIndex,
      event.currentIndex
    );
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


  updateOrAddDispatchBoardAndSend(key, value, index){
    const oldData = this.dData.dispatches[index] ? this.dData.dispatches[index] : {};

    const dataId = oldData.id;
    let oldUpdateData: CreateDispatchCommand | UpdateDispatchCommand  = {
      status: oldData.status?.name as DispatchStatus,
      order: oldData.order, 
      truckId: oldData.truck?.id,
      trailerId: oldData.trailer?.id,
      driverId: oldData.driver?.id,
      location: oldData.location,
      hourOfService: oldData.hoursOfService,
      note: oldData.note
    }
     
      let newData: CreateDispatchCommand = {
        ...oldUpdateData,
        [key]: value
      }


      if(oldData.id){
        newData = {
          id: oldData.id,
          ...oldUpdateData
        }

        this.dss.updateDispatchBoard(newData);
      }else{

        newData.dispatchBoardId = this.dData.id;

        this.dss.createDispatchBoard(newData);

      }
     // console.log("HELOOOOO", newData);

  }
}
