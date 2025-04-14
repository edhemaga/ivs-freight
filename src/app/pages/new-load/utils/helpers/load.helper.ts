// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// Interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

// Models
import { ITableData } from '@shared/models';

// Modesl
import { LoadListDto, LoadListResponse } from 'appcoretruckassist';

export class LoadHelper {
    static loadMapper(loads: LoadListDto[]): IMappedLoad[] {
        return loads.map((load) => {
            return {
                id: load.id,
                loadNumber: load.loadNumber,
                status: load.status,
            };
        });
    }

    static updateTabsCount = (
        listResponse: LoadListResponse,
        toolbarTabs: ITableData[]
    ): ITableData[] => {
        return [
            {
                ...toolbarTabs[0],
                length: listResponse.templateCount,
            },
            {
                ...toolbarTabs[1],
                length: listResponse.pendingCount,
            },
            {
                ...toolbarTabs[2],
                length: listResponse.activeCount,
            },
            {
                ...toolbarTabs[3],
                length: listResponse.closedCount,
            },
        ];
    };

    static loadStatusTypeToStringMap: Record<
        eLoadStatusType,
        eLoadStatusStringType
    > = {
        [eLoadStatusType.Template]: eLoadStatusStringType.TEMPLATE,
        [eLoadStatusType.Pending]: eLoadStatusStringType.PENDING,
        [eLoadStatusType.Active]: eLoadStatusStringType.ACTIVE,
        [eLoadStatusType.Closed]: eLoadStatusStringType.CLOSED,
    };
}
