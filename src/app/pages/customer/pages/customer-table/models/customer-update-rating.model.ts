import { ConstantStringTableComponentsEnum } from "src/app/core/utils/enums/table-components.enum";

export interface CustomerUpdateRating {
    actionAnimation: ConstantStringTableComponentsEnum;
    tableRaiting: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number | ConstantStringTableComponentsEnum;
        dislikeCount: number | ConstantStringTableComponentsEnum;
    };
    id: number;
}