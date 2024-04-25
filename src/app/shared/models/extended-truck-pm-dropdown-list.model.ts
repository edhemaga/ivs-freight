import {
    PMTruckShortResponse,
    PMTrailerShortResponse,
} from 'appcoretruckassist';

export interface ExtendedTruckTrailerPmDropdownList
    extends PMTruckShortResponse,
        PMTrailerShortResponse {
    name: string;
    folder: string;
    subFolder: string;
}
