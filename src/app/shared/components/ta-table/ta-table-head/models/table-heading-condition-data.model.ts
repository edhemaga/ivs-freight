export interface TableHeadingConditionData {
    conditionType?: string;
    name?: string;
    title?: string;
    headIconStyle?: {
        height: number;
        width: number;
        imgPath: string;
    };
    sortable?: boolean;
    sortDirection?: string;
    locked?: boolean;
    viewDataLength?: number;
}
