export class CreateEventScheduler {
    id?: string;
    dataItem: string;
    startDate: any;
    startDateNew?: Date;
    startTimezone: string;
    endDate: string;
    endTimezone: string;
    isAllDay: number;
    allDay?: boolean;
    title: string;
    description: string;
    recurrenceRule: string;
    recurrenceId: number;
    recurrenceExceptions: string;
    doc: any;
    meta?: any;
    startTime?: string;
    endTime?: string;
    repeat?: boolean;
}

export class GetEventScheduler {
    id: string;
    userId: any;
    companyId: number;
    dataItem: string;
    startDate: string;
    startTimezone: string;
    endDate: string;
    endTimezone: string;
    isAllDay: number;
    title: string;
    description: string;
    recurrenceRule: string;
    recurrenceId: number;
    recurrenceExceptions: string;
    createdAt: string;
    updatedAt: string;
    doc: any;
}

export class Events {
    public id?: string;
    public description?: string;
    public allDay: boolean;
    public start: string;
    public end: string;
    public startTime?: string;
    public endTime?: string;
    public title: string;
    public startEditable?: boolean;
    public classNames?: string;
    public rrule?: string;
    public groupId: string;
    public duration?: string;
}

export class RruleObjectModel {
    public freq: string;
    public interval?: number;
    public byweekday?: any;
    public dtstart?: string;
    public until?: string;
}

export class EventSchedulerRepeaterChecker {
    public repeaters: EventSchedulerRepeater[];
}

export class EventSchedulerRepeater {
    public id?: string;
    public name?: string;
    public checked?: boolean;
    public monthlyRepeaterFields?: ShedulerRepeater[];
    public monthlyPeriodOccurences?: ShedulerRepeater[];
    public monthlyPeriodDays?: ShedulerRepeater[];
    public yearlyMonths?: ShedulerRepeater[];
    public yearlyMonthsFirst?: ShedulerRepeater[];
    public yearlyOccurences?: ShedulerRepeater[];
    public yearlyDays?: ShedulerRepeater[];
    public yearlyFields?: ShedulerRepeater[];
    public yearlyDay?: string;
}

export class ShedulerRepeater {
    public name: string;
    public fullName?: string;
    public shortName?: string;
    public selected: boolean;
    public options?: any;
    public optionsnth?: any;
    public yearlyFieldDisable?: number;
}

export class ShedulerRuleModel {
    public interval: number;
    public freq: string;
    public byDay: string;
    public bySetPos: string;
    public count: string;
    public until: string;
    public byMonthDay: string;
    public byMonth: string;
}
