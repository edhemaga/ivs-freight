import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';

export interface FilteredSubperiod {
    filteredSubPeriodDropdownList: DropdownListItem[];
    selectedSubPeriod: DropdownListItem;
}
