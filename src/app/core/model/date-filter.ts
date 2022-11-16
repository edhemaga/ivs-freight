export interface DateFilter {
  title: string;
  startDate: Date;
  endDate?: Date;
  hidden: boolean;
  field?: string;
}

export interface DateFilterEvent {
  dateFilter: DateFilter[];
  check: boolean;
}

export interface DateFilterGroup {
  id: number;
  value: DateFilter[];
}
