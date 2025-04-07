export interface ICardValueData {
    title: string;
    secondTitle?: string;
    key?: string;
    template?: string;
    format?: string;
    percentKey?: string;
    isDropdown?: boolean;
    values?: ICardValueData[];
    image?: string;
    inputItem?: ICardValueData;
}