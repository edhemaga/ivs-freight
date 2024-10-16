// Enums
import { BrokerDetailsStringEnum } from '@pages/customer/pages/broker-details/enums/';

// Models
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';

export class BrokerInvoiceAgingConstants {
    static invoiceAgingTabs: TabOptions[] = [
        {
            id: 1,
            name: BrokerDetailsStringEnum.UNPAID,
            checked: true,
        },
        {
            id: 2,
            name: BrokerDetailsStringEnum.PAID,
            checked: false,
        },
    ];
}
