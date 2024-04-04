import { Observable } from "rxjs";
import { AccountingTableDefinition } from "./accounting-table-defiinition.model";

export interface AccountingTableOptions {
    name: string;
    options: any;
    data: Observable<Array<any>>;
    columns: Array<AccountingTableDefinition>;
}