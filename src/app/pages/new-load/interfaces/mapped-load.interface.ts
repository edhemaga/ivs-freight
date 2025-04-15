import { LoadBrokerInfo, LoadStatusResponse } from 'appcoretruckassist';

export interface IMappedLoad {
    id: number;
    edit: boolean;
    isSelected: boolean;
    loadNumber: string;
    status: LoadStatusResponse;
    totalDue: number;
    broker: LoadBrokerInfo;
}
