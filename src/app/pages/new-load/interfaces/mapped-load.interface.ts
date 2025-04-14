import { LoadStatusResponse } from 'appcoretruckassist';

export interface IMappedLoad {
    loadNumber: string;
    id: number;
    status: LoadStatusResponse;
}
