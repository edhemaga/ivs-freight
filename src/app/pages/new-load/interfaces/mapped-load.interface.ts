import { CompanyUserShortResponse, LoadDetails, LoadStatusResponse, LoadBrokerInfo } from 'appcoretruckassist';

export interface IMappedLoad {
    id: number;
    edit: boolean;
    isSelected: boolean;
    loadNumber: string;
    status: LoadStatusResponse;
    dispatcher: CompanyUserShortResponse;
    loadDetails: LoadDetails;
    totalDue: number;
    broker: LoadBrokerInfo;
}
