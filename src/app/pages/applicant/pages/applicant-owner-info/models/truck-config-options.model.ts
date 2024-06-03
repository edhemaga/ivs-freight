import {
    ColorResponse,
    TruckMakeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';

export interface TruckConfigOptions {
    selectedMode: string;
    selectedTruckType?: TruckTypeResponse;
    selectedTruckMake?: TruckMakeResponse;
    selectedTruckColor?: ColorResponse;
    stepFeedbackValues?: any;
    loadingTruckVinDecoder?: boolean;
}
