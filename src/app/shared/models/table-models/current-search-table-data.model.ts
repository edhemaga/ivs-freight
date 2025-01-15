import { ICurrentSearchTableDataChip } from "@shared/models/index";

export interface ICurrentSearchTableData {
    chipAdded?: boolean;
    isChipDelete?: boolean;
    querys?: string[];
    query?: string;
    addToQuery?: string;
    search?: string;
    searchType?: string;
    chips?: ICurrentSearchTableDataChip[];
}