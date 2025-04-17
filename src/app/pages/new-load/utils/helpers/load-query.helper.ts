import { HttpParams } from '@angular/common/http';

// Interfaces
import { IStateFilters } from '@shared/interfaces';
import { LoadSortBy, SortOrder } from 'appcoretruckassist';

export class LoadQueryHelper {
    static mapLoadListQueryParams(
        statusType: number,
        filters: IStateFilters,
        sortOrder?: SortOrder,
        sortBy?: LoadSortBy,
        page?: number
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

        if (sortBy) params = params.append('SortBy', sortBy);
        if (sortOrder) params = params.append('SortOrder', sortOrder);
        if (page) {
            params = params.append('PageIndex', page);
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
