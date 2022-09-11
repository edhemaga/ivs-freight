import { Subject, takeUntil } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import moment from 'moment-timezone';
import { StatusPipePipe } from '../../../pipes/status-pipe.pipe';
import { DispatcherStoreService } from '../../dispatcher/state/dispatcher.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ta-status-switch',
  templateUrl: './ta-status-switch.component.html',
  styleUrls: ['./ta-status-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StatusPipePipe],
  animations: [
    trigger('shadowAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: '*' })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class TaStatusSwitchComponent implements OnInit {
  @Input() status: { id: number, name: string };
  @Input() dispatchboardId: number;
  @Input() statusDate: Date = new Date();
  private destroy$ = new Subject<void>();
  @Input() statusLoadCount: number = 0;
  @Input() statusMainIndex: number;
  @Input() openedStatus: number;
  @Input() statusHeight: number;
  @Input() withStatusAgo: boolean;
  @Input() possibleNextStatuses: any;

  statusAgo: string = '';
  changeIndex: any;
  changedStatusLoadCount: any;
  items: any = [];
  statusMainSignal = 0;

  @Output() openIndex: EventEmitter<any> = new EventEmitter();
  @Output() changeStatus: EventEmitter<any> = new EventEmitter();

  // @Input() statusLoadCount: number;
  // @Input() statusMainIndex: number;
  // @Input() newStatusId: number;
  // @Input() itemId: number;
  // @Input() openedStatus: number;
  // @Input() statusHeight: number;
  // @Input() dataItems: any;
  // @Input() statusTypes: string;
  // @Input() statusDate: string;
  // @Input() withStatusAgo: boolean;
  // @Output() changeVal: EventEmitter<any> = new EventEmitter();
  // @Output() openIndex: EventEmitter<any> = new EventEmitter();
  // dispatchStatuses = JSON.parse(JSON.stringify(AppConst.DISPATCH_BOARD_STATUS));
  // loadStatuses = JSON.parse(JSON.stringify(AppConst.LOAD_STATUS));
  // items: any = [];
  // tooltip: any;
  // changeIndex: any;
  // changedStatusLoadCount: any;
  // statusMainSignal = 0;
  // hoverItem = -1;
  // statusAgo: string = '';
  // private destroy$ = new Subject<void>();

  constructor(
    private statusPipe: StatusPipePipe,
    private cdr: ChangeDetectorRef,
    private dss: DispatcherStoreService,
  ) {}

  ngOnInit(): void {

    let mytimezoneOffset = moment(new Date()).utcOffset();
    let status_time = moment(new Date(this.statusDate).getTime()).format(
      'YYYY-MM-DD HH:mm'
    );
    //.add(mytimezoneOffset, "minutes") -- ADDING TIMEZONE

    this.statusAgo = this.timeSince(new Date(status_time));


    this.changeIndex = this.status.id;
    this.changedStatusLoadCount = this.statusLoadCount;
   // this.updateStatusFilter();

    // this.sharedService.emitStatusUpdate
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     if (res.id == this.dataItems.id) {
    //       setTimeout(() => {
    //         this.updateStatusFilter();
    //       });
    //     }
    //   });

    // this.sharedService.emitSortStatusUpdate
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     setTimeout(() => {
    //       this.updateStatusFilter();
    //     });
    //   });
  }

  public openMainIndex(): void {
   this.openIndex.emit(this.statusMainIndex);
  }

  // ngOnChanges() {
  //   if (this.changeIndex != this.statusId) {
  //     this.changeIndex = this.statusId;
  //     this.updateStatusFilter();
  //   }
  // }

  public setStatus(status, indx): void {

    console.log("STATUS", status, indx);
    this.changeStatus.emit(status);
    // if (status_id != this.statusId) {
    //   this.statusMainSignal = indx;
    //   this.changeIndex = status_id;
    //   setTimeout(() => {
    //     this.changeVal.emit(this.items[indx]);
    //   }, 400);
    // } else {
    //   this.changeVal.emit('error');
    // }
  }

  public updateStatusFilter() {
    // this.items = this.statusPipe.transform(
    //   this.statusTypes == 'dispatch'
    //     ? this.dispatchStatuses
    //     : this.loadStatuses,
    //   this.statusId,
    //   this.statusTypes,
    //   this.dataItems
    // );
    // this.statusMainSignal = this.items.findIndex(
    //   (item) => item.id == this.statusId
    // );
  }

  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEventKey(event: KeyboardEvent) {
  //   if( this.openedStatus != this.statusMainIndex ) return;
  //   if( event.key == "Enter" ){
  //     if( this.changeIndex != this.statusId ){
  //       this.changeVal.emit(this.items[this.statusMainSignal]);
  //     }else{
  //       this.changeVal.emit("error");
  //     }
  //   }
  // }

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   console.log('dddd');
  //   if( this.openedStatus != this.statusMainIndex ) return;
  //   if( event.key == "ArrowUp" ){
  //     const next_indx = this.statusMainSignal+1;
  //     if( next_indx < this.items.length ){
  //       this.statusMainSignal = next_indx;
  //       this.changeIndex = this.items[next_indx].id;
  //     }
  //   }else if(event.key == "ArrowDown"){
  //     const next_indx = this.statusMainSignal-1;
  //     if( next_indx > -1 ){
  //       this.statusMainSignal = next_indx;
  //       this.changeIndex = this.items[next_indx].id;
  //     }
  //   }
  // }

  // @HostListener('mousewheel', ['$event']) onMousewheel(event) {
  //   console.log(event.wheelDelta);
  // }


  public openPopover(t2){
    t2.open({data: this.possibleNextStatuses});
    this.openMainIndex();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  timeSince(date: any) {
    var new_date: any = new Date();

    var seconds = Math.floor((new_date - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + 'y. ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + 'm. ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + 'd. ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + 'h. ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + 'm. ago';
    }
    return Math.floor(seconds) + 's. ago';
  }
}
