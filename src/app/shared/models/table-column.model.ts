import { LoadSortBy } from "appcoretruckassist";

export class ITableColummn {
    ngTemplate?: string;
    title?: string;
    field?: string;
    sortName?: LoadSortBy | string;
    name?: string;
    groupName?: string;
    // TODO: typo, needs to be fixed inside of component
    isPined?: boolean;
    hidden?: boolean;
    width?: number;
    minWidth?: number;
    pdfWidth?: number;
    margin?: number;
    padding?: number;
    filter?: string;
    isNumeric?: boolean;
    index?: number;
    sortable?: boolean;
    isActionColumn?: boolean;
    isSelectColumn?: boolean;
    avatar?: null;
    progress?: null;
    hoverTemplate?: boolean;
    filterable?: boolean;
    disabled?: boolean;
    export?: boolean;
    resizable?: boolean;
    link?: {
        routerLinkStart?: string;
        routerLinkEnd?: string;
    };
    linkField?: string;
    svgUrl?: string;
    svgDimensions?: {
        width?: number;
        height?: number;
    };
    setCenter?: boolean;
    headAlign?: string;
    pickupDeliveryType?: string;
    headIconStyle?: {
        width?: number;
        height?: number;
        imgPath?: string;
        customClass?: string;
    };
    colorTemplate?: {
        value?: string;
    };
    tooltipColor?: string;
    tooltipTitle?: string;
    opacityIgnore?: boolean;
    isDate?: boolean;
    moveRight?: boolean;
    isAction?: boolean;
    classField?: string;
    class?: string;
}