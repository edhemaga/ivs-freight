import { ByStateIntervalResponse } from "@pages/dashboard/pages/dashboard-by-state/models/by-state-interval-response.model";

export interface ByStateListItem {
    id: number;
    state: string;
    value: string;
    percent: string;
    isSelected: boolean;
    selectedColor: string;
    intervals: ByStateIntervalResponse[];
}
