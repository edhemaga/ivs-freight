import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums';
import { IStateFilters } from '@shared/models';
import { DispatcherFilter } from '@shared/models/filters';
import { DispatcherFilterResponse } from 'appcoretruckassist';
import { IFilterAction, eFilterDropdownEnum } from 'ca-components';

export class FilterHelper {
    static dispatcherFilter(
        res: DispatcherFilterResponse[]
    ): DispatcherFilter[] {
        return res.map((type: DispatcherFilterResponse) => ({
            name: type?.fullName,
            count: type.loadCount,
            isSelected: false,
            avatar: type.avatar,
            id: type.id,
        }));
    }

    static mapFilters(
        res: IFilterAction,
        currentFilters: IStateFilters
    ): IStateFilters {
        // if (res.queryParams === null) return null;
        
        console.log(res, currentFilters);
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

                if(res.queryParams?.from) {
                    return {
                        ...currentFilters,
                        revenueFrom: res.queryParams.from,
                        revenueTo: res.queryParams.to
                    }
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
