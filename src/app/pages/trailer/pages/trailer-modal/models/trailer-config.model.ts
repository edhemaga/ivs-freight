import {
    TrailerMakeResponse,
    TrailerTypeResponse,
    type ColorResponse,
} from 'appcoretruckassist';

export interface TrailerConfigInterface {
    selectedTrailerType?: TrailerTypeResponse;
    loadingVinDecoder?: boolean;
    selectedTrailerMake?: TrailerMakeResponse;
    selectedColor?: ColorResponse;
    editType?: string;
    formValue?: string;
}
