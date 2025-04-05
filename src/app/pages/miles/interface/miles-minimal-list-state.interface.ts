import { MilesByUnitMinimalResponse } from 'appcoretruckassist';

export interface MinimalListState {
    data: MilesByUnitMinimalResponse[];
    currentPage: number;
    totalCount: number;
    searchString: string;
}
