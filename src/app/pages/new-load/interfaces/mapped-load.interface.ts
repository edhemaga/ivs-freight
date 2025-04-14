import { LoadStatusResponse } from 'appcoretruckassist';

export interface IMappedLoad {
    id: number;
    isSelected: boolean;
    loadNumber: string;
    status: LoadStatusResponse;
    totalDue: number;
}
