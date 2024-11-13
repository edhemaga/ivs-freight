import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class ChatInput {
    static messageInput = (
        isChatTypingActivated: boolean,
        hasAttachments: boolean
    ): ITaInput => {
        return {
            name: 'message',
            type: 'text',
            label: 'Type your message here',
            hideRequiredCheck: true,
            placeholderInsteadOfLabel: true,
            autoFocus: true,
            blackInput: true,
            customClass:
                isChatTypingActivated && hasAttachments ? 'rounded-top-0' : '',
        };
    };

    static userSearchInput = (text?: string): ITaInput => {
        return {
            name: 'searchTerm',
            type: 'text',
            label: `Find ${text ?? 'Chat'}`,
            placeholderIcon: 'search',
            hideRequiredCheck: true,
            placeholderInsteadOfLabel: true,
            autoFocus: false,
            minLength: 3,
        };
    };
}
