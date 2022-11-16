export class CalendarStats {
  allTimeObject: any[];
  mtdObject: any[];
  ytdObject: any[];
  todayObject: any[];
}

export interface ICalendar {
  statistic: CalendarStats[];
}
