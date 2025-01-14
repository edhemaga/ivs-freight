import { CompanyUserShortResponse } from "appcoretruckassist";

export interface ICreateCommentMetadata {
    cardId?: number,
    date?: string,
    createdAt?: string,
    companyUser?: {
        avatar?: string,
        fullName?: string,
        id?: number
    },
}