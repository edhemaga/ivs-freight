// Models
import { ChatMessage } from '@pages/chat/models';

export const chatMessageSenderFullname = (
    data: ChatMessage[],
    message: ChatMessage
): ChatMessage => {
    if (message.parentId || message.parentMessageId) {
        const messageFound: ChatMessage = data?.find(
            (_message: ChatMessage) =>
                _message.id === (message.parentId || message.parentMessageId)
        );
        return {
            ...message,
            parentMessageId: message.parentMessageId ?? message.parentId,
            parentMessageSenderFullname: messageFound?.sender?.fullName,
            parentMessageContent: messageFound?.parentMessageContent,
        };
    }
    return message;
};
