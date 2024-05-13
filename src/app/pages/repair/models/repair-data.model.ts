import { CardTableData } from "@shared/models/table-models/card-table-data.model";

export interface RepairData {
    id: number;
    type: string;
    data: CardTableData;
}