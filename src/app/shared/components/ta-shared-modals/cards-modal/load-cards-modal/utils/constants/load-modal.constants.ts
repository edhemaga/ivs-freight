import { CardsModalData } from '../../../models/cards-modal-data.model';

export class LoadCardsModalConstants {
    static defaultCardsValues: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: [],
        back_side: [],
    };
}
