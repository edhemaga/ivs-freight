import { CardRowsItem } from '@shared/models/card-models/card-rows-item.model';

export interface CardRows {
    inputItem?: CardRowsItem;
    title?: string;
    endpoint?: string;
    secondEndpoint?: string;
    id?: number;
    key?: string;
    secondKey?: string;
    thirdEndpoint?: string;
    thirdKey?: string;
    class?: string;
    hasLiked?: string;
    hasDislike?: string;
    selected?: boolean;
    field?: string;
}
