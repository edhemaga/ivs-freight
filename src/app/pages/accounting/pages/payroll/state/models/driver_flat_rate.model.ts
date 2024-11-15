import {
    DriverShortResponse,
    PayrollLoadMinimalResponse,
} from 'appcoretruckassist';
import { PayrollDeadLine } from './driver_commission.model';

export type IDriverFlatRateList = IDriverFlatRateResponse[];

export interface IDriverFlatRateResponse {
    id: number;
    driver?: DriverShortResponse;
    payrollNumber: string;
    periodStart: string;
    periodEnd: string;
    status: StatusFlatRate;
    payrollDeadLine: PayrollDeadLine;
    loadCount: number;
    miles: number;
    rate: string;
    flatPay: number;
    bonus: number;
    salary: number;
    credit: number;
    deduction: number;
    total: number;
}

export interface StatusFlatRate {
    name: string;
    id: number;
}


export type FlatRateLoadShortReponseWithRowType =
    | PayrollLoadMinimalResponse
    | { rowType: string };
