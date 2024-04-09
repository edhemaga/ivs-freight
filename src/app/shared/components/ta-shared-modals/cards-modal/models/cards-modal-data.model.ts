import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

export interface CardsModalData {
    checked: boolean;
    front_side: CardRows[];
    back_side: CardRows[];
    numberOfRows: number;
}
