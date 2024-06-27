import { FileResponse } from "appcoretruckassist";

export interface CommentCompanyUser {
    companyUser: {
        id: number;
        name: string;
        avatarFile: FileResponse;
    };
    commentId: number;
    commentContent: string;
    commentDate: string;
    isCommenting?: boolean;
    isEdited?: boolean;
}
