import { LoadStatusResponse } from 'appcoretruckassist';

export interface ILoadModel {
    loadNumber: string;
    id: number;
    status: LoadStatusResponse;
}
