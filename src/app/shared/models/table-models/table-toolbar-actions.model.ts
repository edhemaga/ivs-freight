import { DataForCardsAndTables } from 'src/app/core/components/shared/model/all-tables.modal';

export interface TableToolbarActions {
    action: string;
    tabData: DataForCardsAndTables;
    mode: string;
}
