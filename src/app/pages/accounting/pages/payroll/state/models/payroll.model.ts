// Models
import {
    DriverShortResponse,
    MilesStopShortResponse,
    PayrollCountsResponse,
    PayrollDriverMileageByIdResponse,
    PayrollDriverMileageClosedByIdResponse,
    PayrollDriverMileageListResponse,
    PayrollOwnerResponse,
    RoutingResponse,
} from 'appcoretruckassist';
import { IDriverCommissionList } from './driver-commission.model';
import { IDriverOwnerList } from './driver-owner.model';
import { IDriverFlatRateList } from './driver-flat-rate.model';
import { LoadWithMilesStopResponse } from 'appcoretruckassist';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export interface PayrollState {
    payrollCounts: PayrollCountsResponse;
    payrollDriverMileage: PayrollDriverMileageListResponse[];
    payrollOpenedReport?: IPayrollDriverMileageByIdResponseNumberId;
    payrollCommissionDriverList: IDriverCommissionList;
    ownerPayrollList: IDriverOwnerList;
    ownerPayrollResponse?: PayrollOwnerResponse;
    loading: boolean;
    reportLoading: boolean;
    lastLoadDate?: string;
    selectedDeductionIds?: number[];
    selectedFuelIds?: number[];
    selectedCreditIds?: number[];
    selectedBonusIds?: number[];
    selectedLoadIds?: number[];
    expandedReportTable?: boolean;
    closeReportPaymentLoading?: boolean;
    closeReportPaymentError?: boolean;

    driverMileageCollapsedList?: PayrollDriverMileageCollapsedListResponse[];
    driverCommissionCollapsedList?: PayrollDriverMileageCollapsedListResponse[];
    driverFlatRateCollapsedList?: PayrollDriverMileageCollapsedListResponse[];
    driverOwnerCollapsedList?: PayrollDriverMileageCollapsedListResponse[];

    driverMileageExpandedList?: PayrollDriverMileageExpandedListResponse[];
    driverCommissionExpandedList?: PayrollDriverMileageExpandedListResponse[];
    driverFlatRateExpandedList?: PayrollDriverMileageExpandedListResponse[];
    driverOwnerExpandedList?: PayrollDriverMileageExpandedListResponse[];
    driverFlatRateList?: IDriverFlatRateList;
    payrollOpenedTab: ePayrollTablesStatus;

    payrollMapRoutes: RoutingResponse;
    openedPayrollLeftId: string;
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

export interface PayrollDriverMileageExpandedListResponse {
    id: number;
    payrollNumber: string;
    periodStart: string;
    periodEnd: string;
    closedDate: string;
    payrollStatus: PayrollStatus;
    perMileEmpty: number;
    perMileLoaded: number;
    perMileStop: number;
    emptyMiles: number;
    loadedMiles: number;
    totalMiles: number;
    stopCount: number;
    emptyPay: number;
    loadedPay: number;
    milePay: number;
    stopPay: number;
    bonus: number;
    salary: number;
    credit: number;
    deduction: number;
    earnings: number;
    paid: number;
    debt: number;
}

export interface PayrollStatus {
    name: string;
    id: number;
}

export interface IPayrollProccessPaymentModal {
    id: number;
    totalEarnings: number;
    payrollNumber: string;
    selectedTab: ePayrollTablesStatus;
    payrollType?: PayrollTypes;
}
export interface IAddPayrollClosedPayment {
    payrollDriverMileageId?: number;
    payrollDriverCommissionId?: number;
    payrollDriverFlatRateId?: number;
    payrollOwnerId?: number;
    paymentType?: string;
    modalId?: number;
    type?: string;
    date?: string;
    amount?: number;
    otherPaymentType?: string;
}

export interface IGet_Payroll_Solo_Mileage_Driver_Report {
    reportId: string;
    lastLoadDate: string;
    selectedCreditIds?: number[];
    selectedDeductionIds?: number[];
    selectedBonusIds?: number[];
}
export interface IGet_Payroll_Commission_Driver_Report {
    reportId: string;
    selectedLoadIds?: number[];
    selectedCreditIds?: number[];
    selectedDeductionIds?: number[];
    selectedFuelIds?: number[];
    selectedBonusIds?: number[];
}

export enum PayrollTypes {
    MILES = 'miles',
    COMMISSION = 'commission',
    FLAT_RATE = 'flat rate',
    OWNER = 'owner',
}
export interface IGetPayrollByIdAndOptions {
    reportId: string;
    payrollOpenedTab: ePayrollTablesStatus;
    lastLoadDate?: string;
    selectedLoadIds?: number[];
    selectedCreditIds?: number[];
    selectedBonusIds?: number[];
    selectedDeductionIds?: number[];
    selectedFuelIds?: number[];
}

export interface ILoadWithMilesStopResponseNumberId
    extends Omit<LoadWithMilesStopResponse, 'id'> {
    id?: number | null;
}
export interface IPayrollDriverMileageByIdResponseNumberId
    extends Omit<
        PayrollDriverMileageByIdResponse,
        'includedLoads' | 'excludedLoads'
    > {
    includedLoads?: Array<ILoadWithMilesStopResponseNumberId> | null;
    excludedLoads?: Array<ILoadWithMilesStopResponseNumberId> | null;
}
export interface IPayrollDriverMileageClosedByIdResponse
    extends Omit<
        PayrollDriverMileageClosedByIdResponse,
        'includedLoads' | 'excludedLoads'
    > {
    includedLoads?: Array<ILoadWithMilesStopResponseNumberId> | null;
    excludedLoads?: Array<ILoadWithMilesStopResponseNumberId> | null;
}

export interface IDropdownMenuLoadItem extends Pick<IDropdownMenuItem, "id" | "title"> {};