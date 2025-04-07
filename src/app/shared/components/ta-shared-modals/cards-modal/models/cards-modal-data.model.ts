import { CardRows } from '@shared/models/card-models/card-rows.model';

export interface CardsModalData {
    checked: boolean;
    front_side: CardRows[];
    back_side: CardRows[];
    cardsAllData?: CardRows[];
    numberOfRows: number;
}
