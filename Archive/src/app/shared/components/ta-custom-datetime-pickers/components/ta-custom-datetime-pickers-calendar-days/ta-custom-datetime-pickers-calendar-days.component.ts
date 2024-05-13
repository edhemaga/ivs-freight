import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ta-custom-datetime-picker-calendar-days',
    templateUrl: './ta-custom-datetime-pickers-calendar-days.component.html',
    styleUrls: ['./ta-custom-datetime-pickers-calendar-days.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class TaCustomDateTimePickersCalendarDaysComponent implements OnInit {
    @Input() dateTime: Date;
    @Input() year: string;
    @Input() selectedMonth: string;
    @Input() index: number;
    @Input() activeMonth: boolean;
    @Output() selectDay = new EventEmitter();
    public currentYear: number = new Date().getFullYear();
    public currentMonth: number = new Date().getMonth();
    public currentDay: number = new Date().getDate();
    public selectedMonthFromInput: number;
    public selectedYearFromInput: number;
    public days: ReadonlyArray<string | number> = [];
    public selectedDay: number = -1;
    public selMonth: number = -1;
    public selectedYear: number = -1;

    @Input()
    set month(month: Date) {
        this.selectedMonthFromInput = parseInt(
            ('0' + month.getMonth() + 1).slice(-2)
        );
        this.selectedYearFromInput = month.getFullYear();
        const fillerCount = month.getDay();
        const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const daysCount = lastDay.getDate();

        this.days = [
            ...Array.from({ length: fillerCount }).map(() => ''),
            ...Array.from({ length: daysCount }).map((_, i) => i + 1),
        ];
    }

    constructor() {}

    ngOnInit(): void {
        this.setSelectedDate();
    }

    chooseDay(day): void {
        this.selectDay.emit({ index: this.index, day });
    }

    private setSelectedDate(): void {
        this.selectedDay = parseInt(('0' + this.dateTime.getDate()).slice(-2));
        this.selMonth = parseInt(
            ('0' + this.dateTime.getMonth() + 1).slice(-2)
        );
        this.selectedYear = this.dateTime.getFullYear();
    }
}
