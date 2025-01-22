import { AvatarColors } from "@shared/models";
import { CommentResponse } from "appcoretruckassist";

export interface ICommentWithAvatarColor extends CommentResponse {
    avatarColor?: AvatarColors;
    textShortName?: string;
}