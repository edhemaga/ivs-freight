export interface CommentCompanyUser {
    commentId: number;
    companyUser: {
        name: string;
        avatar: string;
    };
    commentContent: string;
    isCommenting?: boolean;
}
