import type { TruckAttachment } from '@pages/truck/pages/truck-table/models/truck-attachment.model';

export interface TruckLeasePurchase {
    id: string;
    startDate: string;
    price: string;
    num_of_payments: number;
    down_payment: string;
    pay_period: string;
    rate: string;
    amount: string;
    next_pay: string;
    total_val: string;
    total_interest: string;
    file: TruckAttachment[];
}
