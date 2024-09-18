import {
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
}

export interface IPayrollCountsSelector {
    payrollCounts: PayrollCountsResponse;
    payrolls: string[];
}
