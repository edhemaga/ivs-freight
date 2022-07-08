import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import moment from 'moment';
import { DISPATCH_BOARD_STATUS } from 'src/app/const';
import { AppLoadService } from 'src/app/core/services/load/app-load.service';

@Component({
  selector: 'app-dispatcher-history',
  templateUrl: './dispatcher-history.component.html',
  styleUrls: ['./dispatcher-history.component.scss'],
})
export class DispatcherHistoryComponent implements OnInit {
  @ViewChild('t2') t2: any;
  @Input() inputData: any;
  selectTruck: number;
  selectBoard: number;
  selectTrailer: number;
  selectedDriver: number;
  selectTime: any = 'Today';
  historyBoardList: any = [];
  dispatchersList: any = [];
  mainTruckList: any = [];
  driversList: any = [];
  trailersList: any = [];
  loadingDateFilter: boolean = true;
  dispatcBoardStatuses = DISPATCH_BOARD_STATUS;
  timeList: any = [];
  selectedPicker: any = {
    type: '',
    index: -1,
  };
  showDateRange: boolean;
  public range = {
    start: new Date(2020, 10, 10),
    end: new Date(2020, 10, 20),
  };
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  periodList: any = {
    Today: 'today',
    Yesterday: 'last_24_hours',
    'This Week': 'last_7_days',
    'Last week': 'week_ago',
    '1 week': 'two_week_ago',
    'This month': 'thismonth',
    'Last month': 'lastmonth',
    January: 'jan',
    February: 'feb',
    March: 'mar',
    April: 'apr',
    May: 'may',
    June: 'jun',
    July: 'jul',
    August: 'aug',
    September: 'sep',
    October: 'oct',
    November: 'nov',
    December: 'dec',
  };
  lastFourMonth: any[] = [];
  customDateSelect: any = {};
  pickupChangeDate: any;

  constructor(
    private activeModal: NgbActiveModal,
    private loadService: AppLoadService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getDispatchBoardHistoryData();
    this.findLastFourMonth();
  }

  public findLastFourMonth() {
    const d = new Date();
    let currentMonth = d.getMonth() - 2;
    let lastMonthsCount = 4;

    while (lastMonthsCount > 0) {
      this.lastFourMonth.push(this.monthNames[currentMonth]);
      currentMonth--;
      lastMonthsCount--;
    }
  }

  handleSelectionRange(range: SelectionRange) {
    this.selectTime = 'Custom';
    this.customDateSelect = {
      startDate: moment(range.start).toDate(),
      endDate: moment(range.end).toDate(),
    };
    this.t2.close();
    this.boardChanged();
    this.showDateRange = false;
  }

  getDispatchBoardHistoryData(params?): void {
    this.loadService.getDispatchboardHistoryUsed(params).subscribe((res) => {
      this.dispatchersList = res['dispatchers'];
      this.driversList = res['drivers'];
      this.trailersList = res['trailers'];
      this.mainTruckList = res['trucks'];
    });
  }

  setPickerEdit(data: any, type: string): void {
    this.selectedPicker = data;
    this.pickupChangeDate = new Date(
      parseInt(this.historyBoardList[type][data.index].date)
    );
  }

  boardChanged(board?: any): void {
    this.createHistoryList();
    let params = this.createHistorySelectParams();
    this.getDispatchBoardHistoryData(params ? `?${params}` : '');
    params && this.getDispatchBoardHistoryMainData(params ? `?${params}` : '');
  }

  getDispatchBoardHistoryMainData(params?): void {
    this.loadService
      .getDispatchboardHistoryData(params, this.selectedDriver)
      .subscribe((res: any) => {
        this.historyBoardList = res.reduce(
          (data, item, indx) => {
            if (
              res[indx - 1] &&
              res[indx - 1]['trailerNumber'] == item.trailerNumber
            )
              data.trailerList[data.trailerList.length - 1]['heightCount'] += 1;
            else
              data.trailerList.push({
                trailerNumber: item.trailerNumber,
                heightCount: 1,
              });

            if (res[indx - 1] && res[indx - 1]['driverId'] == item.driverId)
              data.driversList[data.driversList.length - 1]['heightCount'] += 1;
            else
              data.driversList.push({
                driverFullName: item.driverFullName,
                heightCount: 1,
              });

            data.pickupDates.push({
              date: new Date(item.startDateTime).getTime(),
              dispatchBoardId: item.dispatchBoardId,
              truckloadId: item.truckloadId,
            });

            data.pickupTimes.push({
              date: new Date(item.startDateTime).getTime(),
              dispatchBoardId: item.dispatchBoardId,
              truckloadId: item.truckloadId,
            });

            data.deliveryDates.push({
              date: new Date(item.endDateTime).getTime(),
              dispatchBoardId: item.dispatchBoardId,
              truckloadId: item.truckloadId,
            });

            data.deliveryTimes.push({
              date: new Date(item.endDateTime).getTime(),
              dispatchBoardId: item.dispatchBoardId,
              truckloadId: item.truckloadId,
            });

            data.statusList.push(
              this.dispatcBoardStatuses.find((it) => it.id == item.statusId)
            );

            const item_duration = item.duration.data;
            data.durationList.push(
              `${item_duration.days}d ${item_duration.hours}h ${item_duration.minutes}m`
            );

            return data;
          },
          {
            trailerList: [],
            driversList: [],
            pickupDates: [],
            pickupTimes: [],
            deliveryDates: [],
            deliveryTimes: [],
            durationList: [],
            statusList: [],
          }
        );
      });
  }

  public createHistorySelectParams(): string {
    let params = [];

    if (this.selectBoard) params.push(`dispatcherId=${this.selectBoard}`);
    if (this.selectTruck) params.push(`truckId=${this.selectTruck}`);
    if (this.selectTrailer) params.push(`trailerId=${this.selectTrailer}`);
    if (this.selectedDriver) params.push(`driverId=${this.selectedDriver}`);

    // FOR LATER
    //if( this.selectTime && params.length > 0) params.push(`period=${this.periodList[this.selectTime]}`);
    return params.join('&');
  }

  truckChange(e: any): void {}

  closeModal() {
    this.activeModal.close();
  }

  getTrailersList(): void {}

  createHistoryList(): void {
    this.historyBoardList = {
      trailerList: [],
      driversList: [],
      pickupDates: [],
      pickupTimes: [],
      deliveryDates: [],
      deliveryTimes: [],
      durationList: [],
      statusList: [],
    };
  }

  closeEditInput(): void {
    this.selectedPicker = { type: '', index: -1 };
  }

  saveDate(): void {
    if (this.pickupChangeDate) {
      const selectedDate = new Date(this.pickupChangeDate).getTime();

      const type = this.selectedDriver
        ? this.historyBoardList['pickupDates'][this.selectedPicker.index]
            .dispatchBoardId
        : this.historyBoardList['pickupDates'][this.selectedPicker.index]
            .truckloadId;
      switch (this.selectedPicker.type) {
        case 'pickupDate':
          this.historyBoardList['pickupDates'][this.selectedPicker.index].date =
            selectedDate;
          this.sendStatusChangeData({ startDate: this.pickupChangeDate }, type);
          break;
        case 'pickupTime':
          this.historyBoardList['pickupTimes'][this.selectedPicker.index].date =
            selectedDate;
          this.sendStatusChangeData(
            { startTime: moment(this.pickupChangeDate).format('HH:mm:ss') },
            type
          );
          break;
        case 'deliveryDate':
          this.historyBoardList['deliveryDates'][
            this.selectedPicker.index
          ].date = selectedDate;
          this.sendStatusChangeData({ endDate: this.pickupChangeDate }, type);
          break;
        default:
          this.historyBoardList['deliveryTimes'][
            this.selectedPicker.index
          ].date = selectedDate;
          this.sendStatusChangeData(
            { endTime: moment(this.pickupChangeDate).format('HH:mm:ss') },
            type
          );
          break;
      }
    }

    this.closeEditInput();
  }

  sendStatusChangeData(data: any, statusType): void {
    this.loadService
      .setDispatchboardStatus(data, statusType, this.selectedDriver)
      .subscribe((res) => {});
  }

  pickupDateTimeChange(e): void {
    //this.pickupChangeDate = e;
  }

  changeSelectedTime(time: string): void {
    this.selectTime = time;
    this.t2.close();
    this.boardChanged();
  }

  openSelect(t2: any): void {
    setTimeout(() => {
      t2.open();
    });
  }
}
