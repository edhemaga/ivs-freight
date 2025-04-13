// Interface
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import { LoadResponse } from 'appcoretruckassist';

export class LoadStoreHelper {
    static setLoadDetailsState(
        state: ILoadState,
        data: LoadResponse,
        isLoading: boolean
    ): ILoadState {
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
            },
        };
    }
}
