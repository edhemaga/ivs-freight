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
}
export interface CardData {
    title?: string;
    value?: Value;
}
export interface RightSideCard {
    count: number;
    data: [];
    svg: string;
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
