import { CompanyUserShortResponse, LoadDetails, LoadStatusResponse } from 'appcoretruckassist';

export interface IMappedLoad {
    loadNumber: string;
    id: number;
    status: LoadStatusResponse;
    dispatcher: CompanyUserShortResponse;
    loadDetails: LoadDetails;
}
