import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums';
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers';
import { IStateFilters } from '@shared/models';
import { DispatcherFilter } from '@shared/models/filters';
import { DispatcherFilterResponse } from 'appcoretruckassist';
import { IFilterAction } from 'ca-components';
 
export class FilterHelper {
    static dispatcherFilter(res: DispatcherFilterResponse[]): DispatcherFilter[] {
        return res.map((type: DispatcherFilterResponse) => ({
            name: type?.fullName,
            count: type.loadCount,
            isSelected: false,
            avatar: type.avatar,
            id: type.id
        }));
    }

    static mapFilters(
            res: IFilterAction,
            currentFilters: IStateFilters
        ): IStateFilters {
            // TODO: Cover all clear cases, extract to helpers
            switch (res.filterType) {
                case LoadFilterStringEnum.TIME_FILTER: {
                    if (res.action === 'Clear') {
                        return {
                            ...currentFilters,
                            dateFrom: null,
                            dateTo: null,
                        };
                    }
                    const { fromDate, toDate } =
                        RepairTableDateFormaterHelper.getDateRange(
                            res.queryParams?.timeSelected,
                            res.queryParams.year ?? null
                        );
                    return {
                        ...currentFilters,
                        dateFrom: fromDate,
                        dateTo: toDate,
                    };
                }
                case LoadFilterStringEnum.MONEY_FILTER: {
                    const moneyArray = res.queryParams?.moneyArray ?? [];
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
                case LoadFilterStringEnum.STATUS_FILTER:
                    return { ...currentFilters, status: res.queryParams as any };
                case LoadFilterStringEnum.DISPATCHER_FILTER:
                    return {
                        ...currentFilters,
                        dispatcherIds: res.queryParams as any,
                    };
                default:
                    return currentFilters;
            }
        }
}
