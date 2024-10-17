import {
    DriverShortResponse,
    MilesStopShortResponse,
    PayrollCountsResponse,
    PayrollDriverMileageByIdResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

export interface PayrollState {
    payrollCounts: PayrollCountsResponse;
    payrollDriverMileage: PayrollDriverMileageListResponse[];
    payrollOpenedReport?: PayrollDriverMileageByIdResponse;
    loading: boolean;
    reportLoading: boolean;
    lastLoadDate?: string;
    selectedDeducionIds?: number[];
    selectedCreditIds?: number[];
    selectedBonusIds?: number[];
    expandedReportTable?: boolean;
    closeReportPaymentLoading?: boolean;
    closeReportPaymentError?: boolean;
    driverMileageCollapsedList?: PayrollDriverMileageCollapsedListResponse[];
}

export interface IPayrollCountsSelector {
    payrollCounts: PayrollCountsResponse;
    payrolls: string[];
}

export type MilesStopShortReponseWithRowType =
    | MilesStopShortResponse
    | { rowType: string };

export interface PayrollDriverMileageCollapsedListResponse {
    driver?: DriverShortResponse;
    payrollCount?: number | null;
    firstPayroll?: string;
    lastPayroll?: string;
    statusUnpaidCount?: number | null;
    minEmptyPerMile?: number | null;
    maxEmptyPerMile?: number | null;
    minLoadedPerMile?: number | null;
    maxLoadedPerMile?: number | null;
    minPerStop?: number | null;
    maxPerStop?: number | null;
    emptyMiles?: number | null;
    loadedMiles?: number | null;
    totalMiles?: number | null;
    stopCount?: number | null;
    emptyPay?: number | null;
    loadedPay?: number | null;
    milePay?: number | null;
    stopPay?: number | null;
    bonus?: number | null;
    salary?: number | null;
    credit?: number | null;
    deduction?: number | null;
    earnings?: number | null;
    paid?: number | null;
    debt?: number | null;
}
