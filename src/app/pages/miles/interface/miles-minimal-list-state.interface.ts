import { MilesByUnitMinimalResponse } from 'appcoretruckassist';

export interface IMinimalListState {
    data: MilesByUnitMinimalResponse[];
    currentPage: number;
    totalCount: number;
    searchString: string;
}
