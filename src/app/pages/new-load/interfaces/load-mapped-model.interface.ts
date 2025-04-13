import { LoadStatusResponse } from 'appcoretruckassist';

export interface ILoadMappedModel {
    loadNumber: string;
    id: number;
    status: LoadStatusResponse;
}
