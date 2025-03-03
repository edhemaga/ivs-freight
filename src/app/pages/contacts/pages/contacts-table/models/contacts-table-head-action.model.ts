import { SortOrder } from "appcoretruckassist";

export interface ContactsTableHeadAction {
    action?: string;
    direction?: string;
    sortOrder: SortOrder;
    sortBy: string;
}
