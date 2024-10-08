import {
    MilesStopShortResponse,
    PayrollCountsResponse,
    PayrollDriverMileageByIdResponse,
    PayrollDriverMileageListResponse
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

export interface PayrollState {
    payrollCounts: PayrollCountsResponse;
    payrollDriverMileage: PayrollDriverMileageListResponse[];
    payrollOpenedReport?: PayrollDriverMileageByIdResponse;
    loading: boolean;
    reportLoading: boolean;
    lastLoadDate?: string;
    selectedDeducionIds?: number[],
    selectedCreditIds?: number[],
    selectedBonusIds?: number[]
}

export interface IPayrollCountsSelector {
    payrollCounts: PayrollCountsResponse;
    payrolls: string[];
}

export type MilesStopShortReponseWithRowType = MilesStopShortResponse | { rowType: string }