export interface TabFilter {
  title: string;
  field?: string;
}

export interface TabFilterEvent {
  tabFilter: TabFilter[];
  check: boolean;
}
