export interface UserTableDropdown {
    title: string;
    name: string;
    svgUrl: string;
    svgStyle: {
        width: number;
        height: number;
    };
    svgClass: string;
    hasBorder?: boolean;
    tableListDropdownContentStyle?: {
        'margin-bottom.px': number;
    };
    mutedStyle?: boolean;
}
