export interface CommentCompanyUser {
    companyUser: {
        name: string;
        avatar: string;
    };
    commentContent: string;
    isCommenting?: boolean;
}
