import { HttpParams } from '@angular/common/http';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// Interfaces
import { ILoadModel } from '@pages/new-load/interfaces';
import { IStateFilters } from '@shared/interfaces';

// Models
import { ITableData } from '@shared/models';

// Modesl
import { LoadListDto, LoadListResponse } from 'appcoretruckassist';

export class LoadHelper {
    static loadMapper(loads: LoadListDto[]): ILoadModel[] {
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

    static mapLoadListQueryParams(
        statusType: number,
        filters: IStateFilters
    ): HttpParams {
        let params = new HttpParams().set('statusType', statusType.toString());

        if (filters.dispatcherIds?.length) {
            filters.dispatcherIds.forEach((id) => {
                params = params.append('dispatcherIds', id.toString());
            });
        }

        if (filters.status?.length) {
            filters.status.forEach((status) => {
                params = params.append('status', status.toString());
            });
        }

        if (filters.dateFrom)
            params = params.append('dateFrom', filters.dateFrom);

        if (filters.dateTo) params = params.append('dateTo', filters.dateTo);

        if (filters.rateFrom)
            params = params.append('rateFrom', filters.rateFrom);

        if (filters.rateTo) params = params.append('rateTo', filters.rateTo);

        if (filters.paidFrom)
            params = params.append('paidFrom', filters.paidFrom);

        if (filters.paidTo) params = params.append('paidTo', filters.paidTo);

        if (filters.dueFrom) params = params.append('dueFrom', filters.dueFrom);

        if (filters.dueTo) params = params.append('dueTo', filters.dueTo);

        if (filters.searchQuery?.length) {
            const { searchQuery } = filters;
            if (searchQuery[0])
                params = params.append('search', filters.searchQuery[0]);

            if (searchQuery[1])
                params = params.append('search1', filters.searchQuery[1]);

            if (searchQuery[2])
                params = params.append('search2', filters.searchQuery[2]);
        }

        return params;
    }
}
