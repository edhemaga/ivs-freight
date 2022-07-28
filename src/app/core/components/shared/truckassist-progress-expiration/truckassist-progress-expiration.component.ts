import {
  ChangeDetectionStrategy, 
  Component, 
  Input, 
  OnInit, 
  SimpleChanges
} from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-truckassist-progress-expiration',
  templateUrl: './truckassist-progress-expiration.component.html',
  styleUrls: ['./truckassist-progress-expiration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckassistProgressExpirationComponent implements OnInit {
  @Input() expireDate: any;
  @Input() status: any;
  @Input() expiresSettings: string = null;
  @Input() customText: string = 'Expires';
  @Input() bigProgressBar: boolean = true;
  hasStartDate: boolean = false;
  _startDate: any= null;
  @Input('startDate') set startDate(value: any) {
      this.hasStartDate = !!value;
      this._startDate= value ? value : new Date();
  }
  totalDays: any;
  expire: any;
  negative = false;
  year: number;
  days: number;
  showProgress = true;
  progresDay: any;
  currentD = new Date();
  timeDifference;
  timeDifferenceAgo;
  diffD;
  progressbarColor: string;
  calculatedProgress: number;
  daysDiff: any;
  progressBarLength: string;
  endingDate: any;

  constructor() {}

  public returnIsEndBefore(start, end) {
    if (moment(end).isBefore(moment(start))) {
      this.timeDifferenceAgo = true;
    }
    return moment(end).isBefore(start);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('driver onChanges progress', changes);
    if (!changes?.expireDate?.firstChange && changes?.expireDate) {
      this.expireDate = changes.expireDate.currentValue;
    }

    if (!changes?.startDate?.firstChange && changes?.startDate) {
      this._startDate = changes.startDate.currentValue;
    }
    
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.expireDate === null || this.expireDate === '') {
      this.negative = true;
    }
    if (this._startDate !== undefined) {
      this.totalDays = moment
        .utc(this.expireDate)
        .diff(moment.utc(this._startDate), 'days');
    }

    if (!this.expireDate && !this._startDate) {
      this.showProgress = false;
    }

    const currentDate = moment();
    const endDate = moment(this.expireDate);
    this.endingDate = endDate.format('MM/DD/YYYY');
    const diffDays = endDate.diff(currentDate, 'd');
    this.diffD = diffDays;
    if (diffDays < 0) {
      this.negative = true;
      this.expire = Math.abs(diffDays);
      if (this.expire > 365) {
        this.year = Math.floor(this.expire / 365);
        this.days = this.expire % 365;
      }
    } else if (diffDays === 0) {
      this.expire = 0;

      this.calculateDiffHours(this.currentD, this.expireDate);
    } else {
      this.negative = false;
      this.expire = diffDays;
      if (this.expire > 365) {
        this.year = Math.floor(this.expire / 365);
        this.days = this.expire % 365;
      }
    }

    this.daysDiff = this.expire;
    if ( this.expire >= 1000 ) {
      this.daysDiff = this.expire.toLocaleString('en-US');
    }

    this.progressbarColor = this.setProgressbarColor();
    this.calculatedProgress = this.calculateProgress();

    if ( this.expiresSettings == 'todo-list' ) {
      this.progressBarLength = this.setProgressbarColorToDo();
    }

    this.progresDay = new Intl.NumberFormat('en-us', {minimumFractionDigits: 0}).format(this.expire);
  }

  calculateProgress() {
    if (this.negative) {
      return 100;
    } else {
      if (this.diffD !== 0) {
        return this.totalDays !== undefined
          ? (this.expire / this.totalDays) * 100
          : (this.expire / 365) * 100;
      } else {
        if ( this.timeDifference > 0 ) {
          var daysProgress = this.totalDays !== undefined
          ? (1 / this.totalDays) * 100
          : (1 / 365) * 100;
          console.log('daysProgress', daysProgress);

          return daysProgress / (24 / this.timeDifference);
        } else {
          return 0;
        }
      }
    }
  }

  setProgressbarColor() {
    if (this.negative) {
      return 'progress-danger';
    } else {
      const progress = this.calculateProgress();
      /* 50% - 100% */
      if (progress > 50 && progress <= 100) {
        return 'progress-muted';
      }
      /* 25% - 50% */
      if (progress > 25 && progress <= 50) {
        return 'progress-sliver';
      }
      /* 5% - 25% */
      if (progress > 5 && progress <= 25) {
        return 'progress-orange';
      }
      /* 0% - 5% */
      if (progress > 0 && progress <= 5) {
        return 'progress-danger';
      }
    }
  }
  
  setProgressbarColorToDo() {
    if (this.negative) {
      return 'progress-short';
    } else {
      const progress = this.calculateProgress();
      /* 66% - 100% */
      if (progress > 66 && progress <= 100) {
        return 'progress-long';
      }
      /* 33% - 66% */
      if (progress > 33 && progress <= 66) {
        return 'progress-medium';
      }
      /* 0% - 33% */
      if (progress > 0 && progress <= 33) {
        return 'progress-short';
      }
    }
  }

  calculateDiffHours(start, end) {
    const result = moment(end).diff(moment(start), 'h');
    // negative time
    if (result < 0) {
      this.negative = true;
      this.timeDifferenceAgo = true;
      this.timeDifference = Math.abs(result);
    } else {
      this.timeDifference = result;
    }
  }
}
