export interface PmTableColumns {
    ngTemplate: string;
    title: string;
    field: string;
    name: string;
    hidden: boolean;
    isPined?: boolean;
    width: number;
    filter?: string;
    isNumeric?: boolean;
    index: number;
    sortable?: boolean;
    isActionColumn?: boolean;
    isSelectColumn?: boolean;
    filterable?: boolean;
    disabled?: boolean;
    export?: boolean;
    resizable?: boolean;
    sortName?: string;
    pdfWidth?: number;
    headAlign?: string;
    minWidth?: number;
    tooltipColor?: string;
    tooltipTitle?: string;
    hoverTemplate?: boolean;
    svgUrl?: string;
    classField?: string;
    class?: string;
    svgDimensions?: SvgDimensionsData;
    isDate?: boolean;
    tableHeadTitle?: string;
    isAction?: boolean;
}

interface SvgDimensionsData {
    width: number;
    height: number;
}
