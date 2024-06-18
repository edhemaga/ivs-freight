import { TableStringEnum } from '@shared/enums/table-string.enum'; 

export type OpenedTab =
    | TableStringEnum.CONTACT
    | TableStringEnum.REVIEW
    | TableStringEnum.DETAILS;
