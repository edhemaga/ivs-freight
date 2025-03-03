import { SortOrder } from "appcoretruckassist";

export interface IContactsTableHeadAction {
    action?: string;
    direction?: string;
    sortOrder: SortOrder;
    sortBy: string;
}
