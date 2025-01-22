import { IBrokerPaymentHistoryChart } from "./broker-payment-history-chart.model";

export interface IBrokerPaymentHistory {
    averagePayPeriod?: number | null;
    payTerm?: number | null;
    brokerPaymentHistoryChartResponse?: IBrokerPaymentHistoryChart[];
}
