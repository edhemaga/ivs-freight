import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-ta-time-period',
  templateUrl: './ta-time-period.component.html',
  styleUrls: ['./ta-time-period.component.scss'],
})
export class TaTimePeriodComponent implements OnInit {
  @ViewChild('t2') t2: any;
  @Output() selectTimePeriod = new EventEmitter<any>();
  periodTitle: string = 'Monthly';
  periodSwitchItems: any[] = [];
  todayPeriodSwitchItems: any = [
    {
      name: 'Hourly',
      active: true,
    },
    {
      name: '3 Hours',
    },
    {
      name: '6 Hours',
    },
  ];

  weekPeriodSwitchItems: any = [
    {
      name: '6 Hours',
    },
    {
      name: 'Semi-Daily',
    },
    {
      name: 'Daily',
      active: true,
    },
  ];

  monthPeriodSwitchItems: any = [
    {
      name: 'Daily',
      active: true,
    },
    {
      name: 'Weekly',
    },
    {
      name: 'Semi-Weekly',
    },
  ];

  yearPeriodSwitchItems: any = [
    {
      name: 'Weekly',
    },
    {
      name: 'Semi-Monthly',
    },
    {
      name: 'Monthly',
      active: true,
    },
  ];

  allTimePeriodSwitchItems: any = [
    {
      name: 'Weekly',
    },
    {
      name: 'Semi-Monthly',
    },
    {
      name: 'Monthly',
      active: true,
    },
  ];

  monthHalfPeriodSwitchItems: any = [
    {
      name: 'Daily',
      active: true,
    },
    {
      name: 'Semi-Weekly',
    },
    {
      name: 'Weekly',
    },
  ];

  oneYearPeriodSwitchItems: any = [
    {
      name: 'Weekly',
    },
    {
      name: 'Monthly',
      active: true,
    },
    {
      name: 'Quarterly',
    },
  ];

  moreYearPeriodSwitchItems: any = [
    {
      name: 'Monthly',
      active: true,
    },
    {
      name: 'Quarterly',
    },
    {
      name: 'Yearly',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.periodSwitchItems = this.todayPeriodSwitchItems;
  }

  changePeriod(item) {
    this.periodTitle = item.name;
    this.periodSwitchItems.map((item) => {
      item.active = false;
      return item;
    });
    item.active = true;
    this.selectTimePeriod.emit(this.periodTitle);
    this.t2.close();
  }

  changeTimePeriod(period) {
    switch (period) {
      case 'All Time':
        this.periodSwitchItems = this.allTimePeriodSwitchItems;
        break;
      case 'WTD':
        this.periodSwitchItems = this.weekPeriodSwitchItems;
        break;
      case 'MTD':
        this.periodSwitchItems = this.monthPeriodSwitchItems;
        break;
      case 'YTD':
        this.periodSwitchItems = this.yearPeriodSwitchItems;
        break;
      case 'Today':
        this.periodSwitchItems = this.todayPeriodSwitchItems;
        break;
    }

    this.periodSwitchItems.map((item) => {
      if (item.active) {
        this.periodTitle = item.name;
      }
    });
  }

  changeCustomTime(period) {
    const fromDate = moment(period[0]);
    const toDate = moment(period[1]);
    const diff = toDate.diff(fromDate, 'days') + 1;

    if (diff <= 2) {
      this.periodSwitchItems = this.todayPeriodSwitchItems;
    } else if (diff > 2 && diff <= 14) {
      this.periodSwitchItems = this.weekPeriodSwitchItems;
    } else if (diff > 14 && diff <= 60) {
      this.periodSwitchItems = this.monthHalfPeriodSwitchItems;
    } else if (diff > 60 && diff <= 366) {
      this.periodSwitchItems = this.yearPeriodSwitchItems;
    } else if (diff > 366 && diff <= 732) {
      this.periodSwitchItems = this.oneYearPeriodSwitchItems;
    } else if (diff > 732) {
      this.periodSwitchItems = this.moreYearPeriodSwitchItems;
    }

    this.periodSwitchItems.map((item) => {
      if (item.active) {
        this.periodTitle = item.name;
      }
    });
  }
}
