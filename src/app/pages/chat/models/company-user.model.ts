import { CompanyUserChatResponse, FileResponse } from "appcoretruckassist";

export interface CompanyUser {
    id: number;
    userId: number;
    fullName: string;
    avatar: string;
    avatarFile: FileResponse;
    tagGeneratedByUser: boolean;
    updatedAt: string;
}

export interface CompanyUserChatResponsePaginationReduced {
    count: number;
    data: CompanyUserChatResponse[];
}