// interfaces
import { ICardValueData } from '@shared/interfaces';

// helpers
import { CardDefaultValuesHelper } from '@shared/utils/helpers';

// configs
import { LoadCardDataConfig } from '@pages/new-load/pages/new-load-cards/utils/configs';

export class LoadClosedCardDataConfig {
    static CLOSED_FRONT_TITLES = [
        'Status',
        'Billing • Rate',
        'Billing • Paid',
        'Billing • Due',
    ];
    static CLOSED_BACK_TITLES = [
        'Broker Detail • Business Name',
        'Pickup',
        'Delivery',
        'Billing • Age - Unpaid',
    ];

    static get CLOSED_FRONT_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.CLOSED_FRONT_TITLES
        );
    }

    static get CLOSED_BACK_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.CLOSED_BACK_TITLES
        );
    }
}
