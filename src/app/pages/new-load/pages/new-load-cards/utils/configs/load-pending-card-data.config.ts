// interfaces
import { ICardValueData } from '@shared/interfaces';

// helpers
import { CardDefaultValuesHelper } from '@shared/utils/helpers';

// configs
import { LoadCardDataConfig } from '@pages/new-load/pages/new-load-cards/utils/configs';

export class LoadPendingCardDataConfig {
    static PENDING_FRONT_TITLES = ['Status', 'Pickup', 'Delivery', 'Billing • Rate'];
    static PENDING_BACK_TITLES = [
        'Assigned • Driver',
        'Assigned • Truck',
        'Assigned • Trailer',
        'Miles • Total',
    ];

    static get PENDING_FRONT_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.PENDING_FRONT_TITLES
        );
    }

    static get PENDING_BACK_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.PENDING_BACK_TITLES
        );
    }
}
