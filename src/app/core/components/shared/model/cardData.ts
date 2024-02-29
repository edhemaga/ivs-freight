import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

export interface CardHeader {
    checkbox: boolean;
    cardTitleBeforeStyle: string;
    cardTitleBefore: string;
    cardTitle: string;
    img?: string;
    imgStyle?: string;
    svg?: string;
    svgStyle?: string;
    date?: string;
    isOwner?: boolean;
}
interface Value {
    firstValue?: string;
    firstValueStyle?: string;
    seccValue?: string;
    seccValueStyle?: string;
    thirdValue?: string;
    thirdValueStyle?: string;
    firstValueSvg?: string;
    seccondValueSvg?: string;
    deadline?: boolean;
    deadlineValue?: string;
}
export interface CardData {
    title?: string;
    value?: Value;
}
export interface RightSideCard {
    count: number;
    data: [];
    svg: string;
    svgStyle: string;
}

export interface LoadTableData {
    extended: boolean;
    field: string;
    gridNameTitle: string;
    isActive: boolean;
    length: number;
    stateName: string;
    tableConfiguration: string;
    title: string;
}

export interface CardRows {
    title: string;
    endpoint?: string;
    secondEndpoint?: string;
    key?: string;
    secondKey?: string;
    thirdEndpoint?: string;
    thirdKey?: string;
    class?: string;
    hasLiked?: string;
    hasDislike?: string;
    selected?: boolean;
}

export interface Search {
    chip: string;
    search: string;
    SearchType: string;
}

interface ToolbarAction {
    name: ConstantStringTableComponentsEnum;
    active: boolean;
}

export interface TableOptionsInterface {
    toolbarActions: {
        showRepairOrderFilter?: boolean;
        showMoneyFilter?: boolean;
        hideActivationButton?: boolean;
        showLocationFilter?: boolean;
        showStateFilter?: boolean;
        showBrokerFilterClosed?: boolean;
        showTruckFilter?: boolean;
        hideSearch?: boolean;
        showTrailerFilter?: boolean;
        showRepairShop?: boolean;
        viewModeOptions: ToolbarAction[];
        showTimeFilter?: boolean;
        showDispatcherFilter?: boolean;
        showStatusFilter?: boolean;
        showLtlFilter?: boolean;
        showBrokerFilter?: boolean;
        showPMFilter?: boolean;
        showCategoryRepairFilter?: boolean;
        hideMoneySubType?: boolean;
        showMoneyCount?: boolean;
    };
}
