// Interface
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import { LoadMinimalListResponse, LoadResponse } from 'appcoretruckassist';

export class LoadStoreHelper {
    static groupedByStatusTypeList(
        minimalList: LoadMinimalListResponse
    ): Record<string, LoadMinimalListResponse[]> {
        console.log('groupedByStatusTypeList');
        let groupedByStatusType;
        const data = minimalList?.pagination?.data;

        if (data) {
            groupedByStatusType = data?.reduce((acc, item) => {
                const key = item.statusType.name;
                acc[key] = acc[key] || [];
                acc[key].push(item);
                return acc;
            }, {});
        }

        return groupedByStatusType;
    }

    static setLoadDetailsState(
        state: ILoadState,
        data: LoadResponse,
        isLoading: boolean
    ): ILoadState {
        console.log('setLoadDetailsState');
        const stops = data?.stops || [];

        const isFirstStopDeadhead = stops[0]?.stopType?.id === 0;

        const stopCount = stops.length - (isFirstStopDeadhead ? 1 : 0);

        const extraStopCount =
            stops.length <= 2
                ? 0
                : isFirstStopDeadhead
                  ? stops.length - 3
                  : stops.length - 2;

        return {
            ...state,
            details: {
                data,
                isLoading,
                isMapOpen: true,
                stopCount,
                extraStopCount,
                reveresedHistory: data.statusHistory?.slice()?.reverse(),
            },
        };
    }
}
