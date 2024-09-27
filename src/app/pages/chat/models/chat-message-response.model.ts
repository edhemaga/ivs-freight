import { ChatMessage } from '.';

export interface ChatMessageResponse {
    pagination: {
        pageIndex: number;
        pageSize: number;
        count: number;
        data: ChatMessage[];
    };
}
