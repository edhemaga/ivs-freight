// Models
import { LoadResponse, LoadStatusHistoryResponse } from 'appcoretruckassist';

// Ca components
import { ICaMapProps } from 'ca-components';

export interface ILoadDetails {
    data: LoadResponse;
    isLoading: boolean;
    isMapOpen: boolean;
    stopCount: number;
    extraStopCount: number;
    reveresedHistory: LoadStatusHistoryResponse[];
    mapRoutes: ICaMapProps;
}
