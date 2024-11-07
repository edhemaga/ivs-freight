import { Pipe, PipeTransform } from '@angular/core';

// Enums
import {
    ChatObjectPropertyEnum,
    ChatToolbarActiveFilterEnum,
} from '@pages/chat/enums';

// Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models';
import { CompanyUserChatResponse } from 'appcoretruckassist';

@Pipe({
    name: 'chatUserFilter',
})
export class ChatUserFilterPipe implements PipeTransform {
    transform(
        value: CompanyUserChatResponsePaginationReduced,
        filter: number
    ): CompanyUserChatResponsePaginationReduced {
        if (!value?.count || !filter) return value;

        let appliedFilter: string;

        switch (filter) {
            case ChatToolbarActiveFilterEnum.FAVORITE:
                appliedFilter = ChatObjectPropertyEnum.IS_FAVORITE;
                break;
            case ChatToolbarActiveFilterEnum.UNREAD:
                appliedFilter = ChatObjectPropertyEnum.HAS_UNREAD_MESSAGES;
                break;
            default:
                return value;
        }

        const filteredData: CompanyUserChatResponse[] = [
            ...value?.data.filter((item) => item[appliedFilter]),
        ];

        return {
            count: filteredData.length,
            data: filteredData,
        };
    }
}
