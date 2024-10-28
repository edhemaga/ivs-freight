import { TruckShortResponse } from '../../../../../../../../appcoretruckassist/model/truckShortResponse';
export type IDriverOwnerList = IDriverOwnerResponse[];

export interface IDriverOwnerResponse {
    id: number;
    truck: TruckShortResponse;
    owner: string;
    payrollNumber: string;
    periodStart: string;
    periodEnd: string;
    payrollDeadLine: PayrollDeadLine;
    load: number;
    miles: number;
    revenue: number;
    rate: number;
    salary: number;
    credit: number;
    fuel: number;
    deduction: number;
    total: number;
}

export interface TruckType {
    id: number;
    companyId: any;
    name: string;
    logoName: string;
}

export interface PayrollDeadLine {
    numberOfDays: number;
    period: string;
}
