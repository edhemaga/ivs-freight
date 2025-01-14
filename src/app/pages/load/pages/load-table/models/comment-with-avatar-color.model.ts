import { AvatarColors } from "@pages/driver/pages/driver-table/models/avatar-colors.model";
import { CommentResponse } from "appcoretruckassist";

export interface ICommentWithAvatarColor extends CommentResponse {
    avatarColor?: AvatarColors;
    textShortName?: string;
}