import {CalendarScrollService} from './../calendar-scroll.service';
import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {CalendarLeftStrategy, FULL_SIZE} from './calendar_left_strategy';
import {CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY} from "@angular/cdk/scrolling";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

@Component({
  selector: 'app-calendar-left',
  templateUrl: './calendar-left.component.html',
  styleUrls: ['./calendar-left.component.scss'],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: CalendarLeftStrategy
    }
  ]
})
export class CalendarLeftComponent implements OnInit {
  @Input() months: any;
  @Input() currentIndex: any;
  @Input() listPreview: any;
  @ViewChild("leftSideRef", {static: true})
  public virtualScrollViewport: CdkVirtualScrollViewport;
  isHovered: boolean;

  constructor(private calendarService: CalendarScrollService) {
  }

  ngOnInit(): void {
    this.calendarService.scrollToAutoIndex.subscribe(indx => {
      this.virtualScrollViewport.scrollToIndex(indx, "auto");
    });

    this.calendarService.scrolledIndexChange.subscribe(res => {
      if (res.type != "left" && this.calendarService.selectedScroll != 'left') {
        const sizeTimes = FULL_SIZE / res.cycleSize;
        const newScrollSize = sizeTimes * res.scrollOffset;
        this.virtualScrollViewport.scrollToOffset(newScrollSize, "auto");
      }
    });

    this.calendarService.scrollToDate.subscribe(res => {
      setTimeout(() => {
        if (res) {
          const indx = this.findIndexInMonth(res);
          this.virtualScrollViewport.scrollToIndex(indx);
        } else this.virtualScrollViewport.scrollToIndex(this.currentIndex);
      });
    });
  }

  findIndexInMonth(date: string): number {
    const selectedDate = new Date(date);
    const indexMonth = (selectedDate.getFullYear() - 1905) * 12;
    const indx = indexMonth + selectedDate.getMonth();
    return indx;
  }

  getMonth(index: any): any {
    if (MONTHS[index.getMonth()] == "January" || this.listPreview == "month_list") {
      return index.getFullYear();
    }
    return MONTHS[index.getMonth()].slice(0, 3);
  }

  public onScrollChanged(data): void {
    this.calendarService.index$.next(data);
  }

  public selectMonth(indx): void {
    this.virtualScrollViewport.scrollToIndex(indx);
  }

  mouseOverSetItem(){
    this.calendarService.scrolledScrollItem = 'left';
  }

}
