import { CompanyResponse, LoadResponse } from 'appcoretruckassist';

export interface EditData {
    data: LoadResponse;
    type: string;
    company: CompanyResponse;
    id: number;
}
