import { ChatMessage } from '.';

export interface ChatMessageResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: ChatMessage[];
}
