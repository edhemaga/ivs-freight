import { CardRows } from "@shared/models/card-models/card-rows.model";

export interface TrailerCardTypes {
    checked: boolean;
    numberOfRows: number;
    front_side: CardRows[];
    back_side: CardRows[];
}