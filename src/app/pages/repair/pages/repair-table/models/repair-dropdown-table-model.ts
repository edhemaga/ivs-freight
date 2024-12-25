export interface RepairDropdownTableModel {
    title: string;
    name?: string;
    svgUrl: string;
    svgStyle: svgStyleModel;
    svgClass: string;
    hasBorder?: boolean;
    tableListDropdownContentStyle?: {
        [key: string]: number;
    };
    isDisabled?: boolean;
}

interface svgStyleModel {
    width: number;
    height: number;
}
