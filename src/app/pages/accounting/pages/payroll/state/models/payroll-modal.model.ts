import { PayrollCreditType } from 'appcoretruckassist';
import { PayrollStringEnum } from '../enums';
import { PayrollType } from '@pages/accounting/pages/payroll/state/types/payroll.type';

export type PayrollModalAction =
    | PayrollStringEnum.EDIT
    | PayrollStringEnum.CREATE;

export type PayrollModalType =
    | PayrollStringEnum.MODAL_DEDUCTION
    | PayrollStringEnum.MODAL_BONUS
    | PayrollStringEnum.MODAL_CREDIT;

export interface PayrollModal {
    edit: boolean;
    // TODO: TYPES When creating new credit for selected truck or driver
    data: any;
    // This will preselect tab when user add payroll from payroll table
    creditType: PayrollCreditType;
    type: PayrollType;
}
