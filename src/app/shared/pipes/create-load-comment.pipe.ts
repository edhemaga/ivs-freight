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
        filter?: string
    ): CommentCompanyUser[] {
        if (!comments) return [];

        const currentUser: User = UserHelper.getUserFromLocalStorage();

        const _comments = [
            ...comments?.map((comment: CommentResponse) => {
                const { companyUser, id, commentContent, createdAt, isEdited } =
                    comment;

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
                };
            }),
        ];

        // // TODO remove, test
        // _comments.push({
        //     companyUser: {
        //         id: currentUser.userId,
        //         name: `${currentUser.firstName} ${currentUser.lastName}`,
        //         avatarFile: { ...currentUser.avatarFile },
        //     },
        //     commentId: 0,
        //     commentContent: 'new comment',
        //     commentDate:
        //         MethodsCalculationsHelper.convertDateFromBackendToDateAndTime(
        //             new Date()
        //         ),
        //     isCommenting: true,
        //     isEdited: false,
        //     isMe: true,
        // });

        if (!filter) return _comments;
        return [
            ..._comments?.filter((comment) =>
                comment.commentContent?.includes(filter)
            ),
        ];
    }
}
