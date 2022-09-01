import { HttpClient } from '@angular/common/http';
import { map, takeUntil, takeWhile } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, interval, merge, combineLatest } from 'rxjs';

import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { SharedService } from '../../../services/shared/shared.service';
import { DashboardStats } from '../state/dashboard.model';
import { DashboardStoreService } from '../state/dashboard.service';
import { DashboardQuery } from '../state/dashboard.query';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  public inputDate: FormControl = new FormControl();
  dashboardStats: Observable<DashboardStats[]>;

  color: string = '#eee';
  dispatchStatuses: any = [
    {
      id: 40,
      name: 'OFF',
      status: 58,
      statusPercentage: 10.0,
      color: '#202020',
    },
    {
      id: 40,
      status: 58,
      name: 'ACTIVE',
      statusPercentage: 15.0,
      color: '#5AE99D',
    },
    {
      id: 40,
      status: 58,
      name: 'DISPATCHED',
      color: '#497BDC',
      statusPercentage: 25.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CHECKED IN',
      color: '#24C1A1',
      statusPercentage: 98.0,
    },
    {
      id: 40,
      status: 58,
      name: 'LOADED',
      color: '#207E4C',
      statusPercentage: 35.0,
    },
    {
      id: 40,
      status: 58,
      name: 'REPAIR',
      color: '#AE3232',
      statusPercentage: 80.0,
    },
    {
      id: 40,
      status: 58,
      name: 'EMPTY',
      color: '#F99E00',
      statusPercentage: 76.0,
    },
  ];
  pendingStatuses: any = [
    {
      id: 40,
      name: 'BOOKED',
      status: 58,
      statusPercentage: 25.0,
      color: '#959595',
    },
    {
      id: 40,
      status: 58,
      name: 'ASSIGNED',
      statusPercentage: 10.0,
      color: '#202020',
    },
    {
      id: 40,
      status: 58,
      name: 'DISPATCHED',
      color: '#497BDC',
      statusPercentage: 14.0,
    },
    {
      id: 40,
      status: 58,
      name: 'LOADED',
      color: '#207E4C',
      statusPercentage: 90.0,
    },
  ];
  closedStatuses: any = [
    {
      id: 40,
      name: 'CANCELED',
      status: 58,
      statusPercentage: 20.0,
      color: '#AE3232',
    },
    {
      id: 40,
      status: 58,
      name: 'TONU',
      statusPercentage: 55.0,
      color: '#FF5D5D',
    },
    {
      id: 40,
      status: 58,
      name: 'INVOICED',
      color: '#BFB580',
      statusPercentage: 30.0,
    },
    {
      id: 40,
      status: 58,
      name: 'In HOLD / REVISED',
      color: '#B7B7B7',
      statusPercentage: 100.0,
    },
    {
      id: 40,
      name: 'PAID',
      status: 58,
      statusPercentage: 40.0,
      color: '#9F9A7B',
    },
    {
      id: 40,
      status: 58,
      name: 'SHORT-PAID',
      statusPercentage: 70.0,
      color: '#807B65',
    },
    {
      id: 40,
      status: 58,
      name: 'UNPAID',
      color: '#65614D',
      statusPercentage: 10.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CLAIM',
      color: '#514E40',
      statusPercentage: 90.0,
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardStoreService: DashboardStoreService,
    private dashboardQuery: DashboardQuery,
    private dashboardService: DashboardService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    //this.dashboardStoreService.addStats();
    this.dashboardStats = this.route.snapshot.data['dashboard'];

    // this.dashboardQuery.selectDashboardStatistic$
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(result => {
    //   this.dashboardStats = result;
    // });

    //this.getStats();

    this.startStream();
  }

  streamOutput$: Observable<number[]>;
  outputStreamData = [];
  isComponentActiveAlive: boolean = true;

  startStream(){
    const streamSource = interval(1000);
    const secondStreamSource = interval(2000);
    const fasterStreamSource = interval(3000);

    // this.streamOutput$ = merge(
    //   streamSource,
    //   secondStreamSource,
    //   fasterStreamSource
    // ).pipe( takeWhile( () => !!this.isComponentActiveAlive ),
    //   map(output => {
    //     console.log(output);
    //     this.outputStreamData = [...this.outputStreamData, output]
    //     return this.outputStreamData;
    //   })
    // )

    // combineLatest([
    //   streamSource,
    //   secondStreamSource,
    //   fasterStreamSource
    // ]).subscribe((value) => {
    //   console.log(value);
    // });
  }

  getStats() {
    this.dashboardService
      .getDasboardMainTotals()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.dashboardStats = response;
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseNum(x) {
    return parseFloat(x);
  }

  dataTest = {
    disabledMutedStyle: null,
    toolbarActions: {
      hideViewMode: false,
    },
    config: {
      showSort: true,
      sortBy: '',
      sortDirection: '',
      disabledColumns: [0],
      minWidth: 60,
    },
    actions: [
      {
        title: 'Edit',
        name: 'edit',
        class: 'regular-text',
        contentType: 'edit',
      },

      {
        title: 'Delete',
        name: 'delete-item',
        type: 'driver',
        text: 'Are you sure you want to delete driver(s)?',
        class: 'delete-text',
        contentType: 'delete',
      },
    ],
    export: true,
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sharedService.emitUpdateScrollHeight.emit(true);
    }, 200);
  }
}
