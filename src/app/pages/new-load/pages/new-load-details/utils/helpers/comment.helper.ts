// models
import { CreateCommentCommand } from 'appcoretruckassist';

// enums
import { eStringPlaceholder } from '@shared/enums';

export class CommentHelper {
    public static createCommentCommand = (
        loadId: number,
        commentContent?: string
    ): CreateCommentCommand => {
        const comment: CreateCommentCommand = {
            entityTypeCommentId: 2,
            entityTypeId: loadId,
            commentContent: commentContent ?? eStringPlaceholder.EMPTY,
        };
        return comment;
    };
}
