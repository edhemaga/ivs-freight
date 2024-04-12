import { TableStringEnum } from '@shared/enums/table-string.enum';

export interface CustomerUpdateRating {
    actionAnimation: TableStringEnum;
    tableRaiting: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number | TableStringEnum;
        dislikeCount: number | TableStringEnum;
    };
    id: number;
}
