// interfaces
import { ICardValueData } from '@shared/interfaces';

// helpers
import { CardDefaultValuesHelper } from '@shared/utils/helpers';

// configs
import { LoadCardDataConfig } from '@pages/new-load/pages/new-load-cards/utils/configs';

export class LoadTemplateCardDataConfig {
    static TEMPLATE_FRONT_TITLES = [
        'Commodity',
        'Broker Detail • Business Name',
        'Broker Detail • Contact',
        'Broker Detail • Phone',
    ];
    static TEMPLATE_BACK_TITLES = [
        'Pickup',
        'Delivery',
        'Miles • Total',
        'Billing • Rate',
    ];

    static get TEMPLATE_FRONT_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.TEMPLATE_FRONT_TITLES
        );
    }

    static get TEMPLATE_BACK_SIDE_DATA(): ICardValueData[] {
        return CardDefaultValuesHelper.extractCardValuesByTitles(
            LoadCardDataConfig.CARD_ALL_DATA,
            this.TEMPLATE_BACK_TITLES
        );
    }
}
