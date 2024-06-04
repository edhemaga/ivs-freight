import {
    TrailerTypeResponse,
    TrailerMakeResponse,
    ColorResponse,
} from 'appcoretruckassist';

export interface TrailerConfigOptions {
    selectedMode: string;
    isAddTrailerSelected: boolean;
    selectedTrailerType?: TrailerTypeResponse;
    selectedTrailerMake?: TrailerMakeResponse;
    selectedTrailerColor?: ColorResponse;
    stepFeedbackValues?: any;
    loadingTrailerVinDecoder?: boolean;
}
