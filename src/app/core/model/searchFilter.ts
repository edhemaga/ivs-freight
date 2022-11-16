
import { DateFilter } from './date-filter';
import { TabFilter } from './tab-filter';
import { ViolationGroupFilterSummaryEvent } from './violation-group-filter-event';

export interface HighlightText {
  index: number;
  text: string;
  data?: any[];
}

export interface SearchFilter {
  chipsFilter: ChipsFilter;
  dateFilter: DateFilter[];
  tabFilter: TabFilter[];
  loadStatusFilter: number[];
  violationGroupFilter: number[];
  violationGroupFilterSummary: ViolationGroupFilterSummaryEvent;
  shopTypeFilter: any[];
}

export interface SearchFilterEvent {
  searchFilter: SearchFilter;
  check: boolean;
}

export interface ChipsFilter {
  label: string;
  removable: boolean;
  removeIcon: string;
  index: number;
  id?: number;
  // data?: any[];
  init: boolean;
  words: HighlightText[];
  hovered?: boolean;
  extended?: boolean;
}
