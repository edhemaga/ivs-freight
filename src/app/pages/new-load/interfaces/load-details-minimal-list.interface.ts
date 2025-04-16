import { LoadMinimalListResponse } from 'appcoretruckassist';

export interface ILoadDetailsLoadMinimalList {
    pagination: LoadMinimalListResponse;
    groupedByStatusTypeList: Record<string, LoadMinimalListResponse[]>;
}
