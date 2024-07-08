import { Observable, of } from "rxjs";
import { inject } from "@angular/core";

// Models
import { CompanyUserForChatListResponse, ConversationResponse, CreateConversationCommand, CreateResponse, MessageResponse, UserType } from "appcoretruckassist";

// Services
import { ChatService } from "appcoretruckassist/api/chat.service";

export class UserChatService {

    chatService = inject(ChatService);

    getCompanyUserList(userType: UserType): Observable<CompanyUserForChatListResponse> {
        return this.chatService.apiChatUserListGet(
            null,
            userType,
            null,
            null,
            null,
            null,
            null,
            null
        );
    }

    getConversation(id: number): Observable<ConversationResponse> {
        return this.chatService.apiChatConversationIdGet(id);
    }

    getMessages(id: number): Observable<MessageResponse[]> {
        return this.chatService.apiChatMessageListGet(id);
    }

    createConversation(participants: number[]): Observable<CreateResponse> {
        const conversationParticipants: CreateConversationCommand = {
            participantIds: participants
        };

        return this.chatService.apiChatConversationPost(
            conversationParticipants
        );
    }

}