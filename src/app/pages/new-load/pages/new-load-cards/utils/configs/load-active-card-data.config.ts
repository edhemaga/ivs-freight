// interfaces
import { ICardValueData } from '@shared/interfaces';

// helpers
import { CardDefaultValuesHelper } from '@shared/utils/helpers';

// configs
import { LoadCardDataConfig } from '@pages/new-load/pages/new-load-cards/utils/configs';

export class LoadActiveCardDataConfig {
    static FRONT_TITLES = ['Status', 'Pickup', 'Delivery', 'Billing • Rate'];
    static BACK_TITLES = [
        'Assigned • Driver',
        'Assigned • Truck',
        'Assigned • Trailer',
        'Miles • Total',
    ];

    static get FRONT_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.FRONT_TITLES
        );
    }

    static get BACK_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.BACK_TITLES
        );
    }
}
