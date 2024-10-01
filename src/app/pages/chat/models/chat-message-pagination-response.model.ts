import { ChatMessage } from '.';

export interface ChatMessagePaginationResponse {
    pagination: {
        pageIndex: number;
        pageSize: number;
        count: number;
        data: ChatMessage[];
    };
}
