import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// Models
import { ITableData } from '@shared/models';

export const LoadToolbarTabs: ITableData[] = [
    {
        title: eLoadStatusStringType.TEMPLATE,
        value: eLoadStatusType.Template,
        length: 0,
    },
    {
        title: eLoadStatusStringType.PENDING,
        value: eLoadStatusType.Pending,
        length: 0,
    },
    {
        title: eLoadStatusStringType.ACTIVE,
        value: eLoadStatusType.Active,
        length: 0,
    },
    {
        title: eLoadStatusStringType.CLOSED,
        value: eLoadStatusType.Closed,
        length: 0,
    },
];
