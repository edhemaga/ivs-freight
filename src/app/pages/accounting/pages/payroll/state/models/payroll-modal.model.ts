import { PayrollCreditType } from 'appcoretruckassist';
import { ePayrollString } from '../enums';
import { PayrollType } from '@pages/accounting/pages/payroll/state/types/payroll.type';

export type PayrollModalAction =
    | ePayrollString.EDIT
    | ePayrollString.CREATE;

export type PayrollModalType =
    | ePayrollString.MODAL_DEDUCTION
    | ePayrollString.MODAL_BONUS
    | ePayrollString.MODAL_CREDIT;

export interface PayrollModal {
    edit: boolean;
    // TODO: TYPES When creating new credit for selected truck or driver
    data: any;
    // This will preselect tab when user add payroll from payroll table
    creditType: PayrollCreditType;
    type: PayrollType;
}
