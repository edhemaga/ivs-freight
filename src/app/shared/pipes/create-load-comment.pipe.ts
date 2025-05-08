import { Pipe, PipeTransform } from '@angular/core';

// helpers
import { MethodsCalculationsHelper, UserHelper } from '@shared/utils/helpers';

// models
import { User } from '@shared/models';
import { CommentResponse } from 'appcoretruckassist';
import { IComment } from 'ca-components';

@Pipe({
    name: 'createLoadComment',
    standalone: true,
})
export class CreateLoadCommentsPipe implements PipeTransform {
    transform(
        comments: CommentResponse[] | null,
        filter?: string,
        isDriver?: boolean
    ): IComment[] {
        if (!comments) return [];

        const currentUser: User = UserHelper.getUserFromLocalStorage();

        const _comments: IComment[] = [
            ...comments?.map((comment: CommentResponse) => {
                const {
                    companyUser,
                    id,
                    commentContent,
                    createdAt,
                    isEdited,
                    isDriver,
                } = comment;

                const { fileId, fileName, url } = companyUser?.avatarFile || {};

                let _comment: IComment = {
                    id,
                    companyUser: {
                        id: companyUser.id,
                        fullName: companyUser.fullName,
                        avatarFile: { fileId, fileName, url },
                    },
                    commentContent,
                    createdAt:
                        MethodsCalculationsHelper.convertDateFromBackendToDateAndTime(
                            createdAt
                        ),
                    isCommenting: false,
                    isEdited,
                    isMe: companyUser.id === currentUser.userId,
                    isDriver,
                };
                return _comment;
            }),
        ];

        const commentsWithIsDriverFilter: IComment[] = isDriver
            ? _comments.filter((comment) => comment.isDriver)
            : _comments;

        const filteredComments: IComment[] = commentsWithIsDriverFilter?.filter(
            (comment) => comment.commentContent?.includes(filter)
        );

        return filter ? filteredComments : commentsWithIsDriverFilter;
    }
}
