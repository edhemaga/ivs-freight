import { ITaInput } from "@shared/components/ta-input/config/ta-input.config";

export class ChatInput {
    static messageInput: ITaInput = {
        name: 'message',
        type: 'text',
        label: 'Type your message here',
        hideRequiredCheck: true,
        placeholderInsteadOfLabel: true,
        autoFocus: true
    }

    static userSearchInput: ITaInput = {
        name: 'searchTerm',
        type: 'text',
        label: 'Type your message here',
        placeholderIcon: 'search',
        hideRequiredCheck: true,
        placeholderInsteadOfLabel: true,
        autoFocus: true,
        minLength: 3
    }
}