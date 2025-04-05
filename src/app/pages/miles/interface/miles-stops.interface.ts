import {
    MilesByUnitPaginatedStopsResponse,
    MilesStopItemResponse,
} from 'appcoretruckassist';

export interface IMinimalStopsState {
    data: MilesByUnitPaginatedStopsResponse;
    stops: MilesStopItemResponse[];
    currentPage: number;
    totalCount: number;
    searchString: string;
}
