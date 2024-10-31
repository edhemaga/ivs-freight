import {
    DriverShortResponse,
    PayrollLoadMinimalResponse,
} from 'appcoretruckassist';

export type IDriverFlatRateList = IDriverFlatRateResponse[];

export interface IDriverFlatRateResponse {
    id: number;
    driver?: DriverShortResponse;
    payrollNumber: string;
    periodStart: string;
    periodEnd: string;
    status: Status;
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

export interface Status {
    name: string;
    id: number;
}

export interface PayrollDeadLine {
    numberOfDays: number;
    period: string;
}

export type FlatRateLoadShortReponseWithRowType =
    | PayrollLoadMinimalResponse
    | { rowType: string };
