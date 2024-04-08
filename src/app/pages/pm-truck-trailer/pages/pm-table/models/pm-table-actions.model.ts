import { CardDetails } from "src/app/shared/models/card-table-data.model";

export interface PmTableAction {
    id?: number;
    type?: string;
    data?: CardDetails[];
}