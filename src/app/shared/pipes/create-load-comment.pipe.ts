import { Pipe, PipeTransform } from '@angular/core';

// helpers
import { MethodsCalculationsHelper, UserHelper } from '@shared/utils/helpers';

// models
import { CommentCompanyUser, User } from '@shared/models';
import { CommentResponse } from 'appcoretruckassist';

@Pipe({
    name: 'createLoadComment',
    standalone: true,
})
export class CreateLoadCommentsPipe implements PipeTransform {
    transform(
        comments: CommentResponse[] | null,
        filter?: string,
        isDriver?: boolean
    ): CommentCompanyUser[] {
        if (!comments) return [];

        const currentUser: User = UserHelper.getUserFromLocalStorage();

        const _comments = [
            ...comments?.map((comment: CommentResponse) => {
                const {
                    companyUser,
                    id,
                    commentContent,
                    createdAt,
                    isEdited,
                    isDriver,
                } = comment;

                return {
                    companyUser: {
                        id: companyUser.id,
                        name: companyUser.fullName,
                        avatarFile: companyUser.avatarFile,
                    },
                    commentId: id,
                    commentContent,
                    commentDate:
                        MethodsCalculationsHelper.convertDateFromBackendToDateAndTime(
                            createdAt
                        ),
                    isCommenting: false,
                    isEdited,
                    isMe: companyUser.id === currentUser.userId,
                    isDriver,
                };
            }),
        ];

        const commentsWithIsDriverFilter = isDriver
            ? _comments.filter((comment) => comment.isDriver)
            : _comments;

        const filteredComments = commentsWithIsDriverFilter?.filter((comment) =>
            comment.commentContent?.includes(filter)
        );

        if (!filter) return commentsWithIsDriverFilter;
        return filteredComments;
    }
}
