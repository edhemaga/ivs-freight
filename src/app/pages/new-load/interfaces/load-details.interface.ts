import { LoadResponse } from 'appcoretruckassist';

export interface ILoadDetails {
    data: LoadResponse;
    isLoading: boolean;
    isMapOpen: boolean;
    stopCount: number;
    extraStopCount: number;
}
