import { ByStateIntervalResponse } from "@pages/dashboard/pages/dashboard-by-state/models";

export interface ITopRatedListItem {
    id: number;
    name: string;
    value: string;
    percent: string;
    isSelected: boolean;
    selectedColor?: string;
    intervals?: ByStateIntervalResponse[];
}
