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
  @Input() status: { statusValue: { id: number, name: string }, statusString: string } ;
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

  constructor(
    private statusPipe: StatusPipePipe,
    private cdr: ChangeDetectorRef,
    private dss: DispatcherStoreService,
  ) {}

  ngOnInit(): void {

    console.log("WHAT IS STATUS");
    console.log(this.status);
    let status_time = moment(new Date(this.statusDate).getTime()).format(
      'YYYY-MM-DD HH:mm'
    );

    this.statusAgo = this.timeSince(new Date(status_time));

    this.changeIndex = this.status.statusValue.id;
    this.changedStatusLoadCount = this.statusLoadCount;
  }



  public openMainIndex(): void {
   this.openIndex.emit(this.statusMainIndex);
  }

  onClose(){
    this.openIndex.emit(-1);
  }

  public setStatus(status, indx): void {

    console.log("STATUS", status, indx);
    this.changeStatus.emit(status);
  }

  public updateStatusFilter() {
  }

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
