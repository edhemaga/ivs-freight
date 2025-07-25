import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    AfterContentInit,
    AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// moment
import moment from 'moment';

// services
import { CalendarDateTimePickerService } from '@shared/services/calendar-datetime-picker.service';

// components
import { TaCustomDateTimePickersDateCalendarsComponent } from '@shared/components/ta-custom-datetime-pickers/components/ta-custom-datetime-pickers-date-calendars/ta-custom-datetime-pickers-date-calendars.component';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// constants
import { CustomDatetimePickersConstants } from '@shared/components/ta-custom-datetime-pickers/constants/custom-datetime-pickers.constants';

@Component({
    selector: 'app-ta-custom-datetime-pickers',
    templateUrl: './ta-custom-datetime-pickers.component.html',
    styleUrls: ['./ta-custom-datetime-pickers.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaCustomDateTimePickersDateCalendarsComponent,
    ],
})
export class TaCustomDatetimePickersComponent
    implements OnInit, OnDestroy, AfterContentInit, AfterViewInit
{
    @Input() dateTime: Date;
    @ViewChild('ref', { read: ViewContainerRef }) ref: ViewContainerRef;
    public _inputConfig: ITaInput = null;
    @Input() set inputConfig(config: ITaInput) {
        this._inputConfig = config;
        if (this._inputConfig.name === 'datepickerBankCard')
            this.listPreview = 'month_list';

        if (this._inputConfig.minutesGapFive)
            this.timeMinutes =
                CustomDatetimePickersConstants.timeMinutesGapFive;
        else this.timeMinutes = CustomDatetimePickersConstants.timeMinutes;
    }

    @Output() closePopover: EventEmitter<any> = new EventEmitter();

    selectedDateTime: any;
    calendarMainType: string;
    outputType: any;
    @ViewChild(TaCustomDateTimePickersDateCalendarsComponent)
    dateCalendar: TaCustomDateTimePickersDateCalendarsComponent;
    @ViewChild('pmAmScroll') pmAmScroll: ElementRef;
    @ViewChild('minutesScroll') minutesScroll: ElementRef;
    @ViewChild('hourScroll') hourScroll: ElementRef;
    currentYear: any = new Date().getFullYear();
    currentMonth: any = new Date().getMonth();
    currentDay: any = new Date().getDate();
    listPreview: any = 'full_list';
    timeMinutes: any;
    monthArray: any = new Array(12).fill(0).map((_, indx) => indx + 1);
    monthDayList: any = new Array(31).fill(0).map((_, indx) => indx + 1);
    yearsList: any = new Array(100)
        .fill(0)
        .map((_, idx) => (idx < 10 ? '0' + idx : idx));
    scrollTimer: any;
    hoveredItem: string;
    isInputFocus: boolean;
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
    hourTimes: any[] = [
        12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11,
    ];
    scrollTypes: any = {
        pmAmScroll: 0,
        minutesScroll: 0,
        hourScroll: 8,
        monthScroll: 0,
        dayScroll: 0,
        yearScroll: 0,
    };
    selectedTime: string = '12:00 AM';
    timeOfDay: any[] = ['AM', 'PM'];

    focusedElementInput: any;
    previousRangeSide: boolean;

    constructor(private calendarService: CalendarDateTimePickerService) {}

    @Input()
    set calendarType(calendarType: string) {
        this.calendarMainType = calendarType;
        if (calendarType == 'time') {
            this.outputType = ['hh', ':', 'mm', ' ', 'AM'];
        } else {
            this.outputType = ['MM', '/', 'DD', '/', 'YY'];
        }
    }

    @Input()
    set placeholder(placeholder: string) {
        this.selectedDateTime = placeholder;
    }

    ngOnInit(): void {
        this.calendarService.dateChanged.subscribe((date) => {
            if (this.calendarMainType == 'time') {
            } else {
                this.outputType[0] = date[0];
                this.outputType[2] = date[1];
                this.outputType[4] = date[2];
                this.selectedDateTime = this.createStringFromOutput();
            }
        });
    }

    ngAfterContentInit() {}

    ngAfterViewInit(): void {
        this.setTimeValue();
        this.changeOpened();
    }

    public setTimeValue() {
        const dateInputArray = moment(this.dateTime)
            .format('H/mm/A')
            .split('/');
        setTimeout(() => {
            this.scrollTypes.hourScroll = this.hourTimes.indexOf(
                parseInt(dateInputArray[0])
            );
            this.scrollTypes.minutesScroll = this.timeMinutes.indexOf(
                dateInputArray[1]
            );

            this.scrollTypes.pmAmScroll = dateInputArray[2] === 'AM' ? 0 : 1;
        });
    }

    public setListPreview(value: string): void {
        this.listPreview = value;
    }

    public inputInFocus(): void {
        this.isInputFocus = true;
    }

    public inputBlur(): void {
        this.isInputFocus = false;
    }

    public changeOpened(): void {
        // this.isInputFocus = e;
        // if (e) {
        if (this.calendarMainType == 'time') {
            setTimeout(() => {
                this.hourScroll.nativeElement.scrollTop =
                    this.scrollTypes.hourScroll * 22;
                this.minutesScroll.nativeElement.scrollTop =
                    this.scrollTypes.minutesScroll * 22;
                this.pmAmScroll.nativeElement.scrollTop =
                    this.scrollTypes.pmAmScroll * 22;
            }, 0);
        } else {
            this.calendarService.scrollToDate.next(
                `${
                    this.dateTime.getMonth() + 1
                }/${this.dateTime.getDate()}/${this.dateTime.getFullYear()}`
            );
        }
    }

    setTime() {
        this.outputType[0] = this.hourTimes[this.scrollTypes.hourScroll];

        this.outputType[2] = this.timeMinutes[this.scrollTypes.minutesScroll];
        this.outputType[4] = this.timeOfDay[this.scrollTypes.pmAmScroll];

        this.selectedDateTime = this.createStringFromOutput();

        let currentDate = moment().format('MM/DD/YYYY');

        this.calendarService.dateChanged.next(
            new Date(currentDate + ' ' + this.selectedDateTime)
        );

        this.closePopover.emit();
    }

    setDefaultTime() {
        let currentDate = moment().format('MM/DD/YYYY');
        this.calendarService.dateChanged.next(new Date(currentDate + ' 08:00'));

        this.closePopover.emit();
    }

    closePopup() {
        this.closePopover.emit();
    }

    public createStringFromOutput(): string {
        return this.outputType.join('');
    }

    ngOnDestroy() {
        this.listPreview = 'full_list';
    }

    onScroll(e, type, index: number = null): void {
        const scrolFromTop = Math.floor(e.target.scrollTop);
        const scrollIndex =
            index == null ? Math.floor(scrolFromTop / 22) : index;
        const scrollRemaining = scrolFromTop % 22;
        clearInterval(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
            if (scrollRemaining < 11 && index == null) {
                e.target.scrollTop = scrollIndex * 22;
                this.scrollTypes[type] = scrollIndex;
            } else if (index != null) {
                e.target.parentNode.scrollTop = scrollIndex * 22;
                this.scrollTypes[type] = scrollIndex;
            } else {
                e.target.scrollTop = (scrollIndex + 1) * 22;
                this.scrollTypes[type] = scrollIndex + 1;
            }

            this.checkForScrolledType(type);
        }, 200);
    }

    public checkForScrolledType(type): void {
        if (type == 'hourScroll') {
            if (this.scrollTypes[type] >= 12) {
                this.pmAmScroll.nativeElement.scrollTop = 22;
                this.scrollTypes.pmAmScroll = 1;
            } else {
                this.pmAmScroll.nativeElement.scrollTop = 0;
                this.scrollTypes.pmAmScroll = 0;
            }
        }

        if (type == 'pmAmScroll') {
            if (this.scrollTypes[type] == 0) {
                if (this.scrollTypes.hourScroll >= 12) {
                    this.hourScroll.nativeElement.scrollTop =
                        (this.scrollTypes.hourScroll - 12) * 22;
                    this.scrollTypes.hourScroll = Math.floor(
                        this.scrollTypes.hourScroll - 12
                    );
                }
            } else {
                if (this.scrollTypes.hourScroll < 12) {
                    this.hourScroll.nativeElement.scrollTop =
                        (this.scrollTypes.hourScroll + 12) * 22;
                    this.scrollTypes.hourScroll = Math.floor(
                        this.scrollTypes.hourScroll + 12
                    );
                }
            }
        }

        this.selectedTime = `${this.hourTimes[this.scrollTypes.hourScroll]}:${
            this.timeMinutes[this.scrollTypes.minutesScroll]
        } ${this.timeOfDay[this.scrollTypes.pmAmScroll]}`;
    }
}
