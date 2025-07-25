// Models
import { IStateFilters } from '@shared/interfaces';
import { DispatcherFilterResponse } from 'appcoretruckassist';

// Components
import {
    IFilterAction,
    eFilterDropdownEnum,
    IFilterDropdownList,
} from 'ca-components';

// Enums
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums';

export class FilterHelper {
    static dispatcherFilter(
        res: DispatcherFilterResponse[]
    ): IFilterDropdownList[] {
        return res.map((type: DispatcherFilterResponse) => ({
            name: type?.fullName,
            count: type.loadCount,
            selected: false,
            avatar: type.avatar,
            id: type.id,
        }));
    }

    static mapFilters(
        res: IFilterAction,
        currentFilters: IStateFilters
    ): IStateFilters {
        // if (res.queryParams === null) return null;
        switch (res.filterType) {
            case eFilterDropdownEnum.TIME_FILTER: {
                const { fromDate, toDate } = res.queryParams;

                return {
                    ...currentFilters,
                    dateFrom: fromDate,
                    dateTo: toDate,
                };
            }
            case LoadFilterStringEnum.MONEY_FILTER: {
                const moneyArray = res.queryParams?.moneyArray ?? [];

                if (res.queryParams?.from) {
                    return {
                        ...currentFilters,
                        revenueFrom: res.queryParams.from,
                        revenueTo: res.queryParams.to,
                    };
                }

                return {
                    ...currentFilters,
                    rateFrom: moneyArray[0]?.from ?? null,
                    rateTo: moneyArray[0]?.to ?? null,
                    paidFrom: moneyArray[1]?.from ?? null,
                    paidTo: moneyArray[1]?.to ?? null,
                    dueFrom: moneyArray[2]?.from ?? null,
                    dueTo: moneyArray[2]?.to ?? null,
                };
            }
            case eFilterDropdownEnum.STATE:
                return { ...currentFilters, states: res.selectedStates };

            case eFilterDropdownEnum.STATUS:
                return { ...currentFilters, status: res.selectedIds };

            // TODO: Uroš ADD DEPARTMENT
            // case eFilterDropdownEnum.DEPARTMENT:
            //     return { ...currentFilters, department: res.selectedIds };

            case eFilterDropdownEnum.DISPATCHER:
                return {
                    ...currentFilters,
                    dispatcherIds: res.selectedIds,
                };
            default:
                return currentFilters;
        }
    }
}
