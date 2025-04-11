import { eLoadStatusStringType } from '@pages/new-load/enums';

// Models
import { ITableData } from '@shared/models';

export const LoadToolbarTabs: ITableData[] = [
    {
        title: eLoadStatusStringType.TEMPLATE,
        length: 0,
    },
    {
        title: eLoadStatusStringType.ACTIVE,
        length: 0,
    },
    {
        title: eLoadStatusStringType.PENDING,
        length: 0,
    },
    {
        title: eLoadStatusStringType.CLOSED,
        length: 0,
    },
];
