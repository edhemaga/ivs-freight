import { LoadResponse, LoadStatusHistoryResponse } from 'appcoretruckassist';

export interface ILoadDetails {
    data: LoadResponse;
    isLoading: boolean;
    isMapOpen: boolean;
    stopCount: number;
    extraStopCount: number;
    reveresedHistory: LoadStatusHistoryResponse[];
}
