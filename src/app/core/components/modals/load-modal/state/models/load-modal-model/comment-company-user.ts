export interface CommentCompanyUser {
    companyUser: {
        id: number;
        name: string;
        avatar: string;
    };
    commentId: number;
    commentContent: string;
    commentDate: string;
    isCommenting?: boolean;
}
