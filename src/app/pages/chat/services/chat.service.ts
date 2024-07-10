import { Observable } from "rxjs";
import { inject } from "@angular/core";

// Models
import {
    CompanyUserForChatListResponse,
    ConversationResponse,
    CreateConversationCommand,
    CreateMessageCommand,
    CreateResponse,
    MessageResponse,
    UserType
} from "appcoretruckassist";

// Services
import { ChatService } from "appcoretruckassist/api/chat.service";

export class UserChatService {

    private chatService = inject(ChatService);

    public getCompanyUserList(userType: UserType): Observable<CompanyUserForChatListResponse> {
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

    public getConversation(id: number): Observable<ConversationResponse> {
        return this.chatService.apiChatConversationIdGet(id);
    }

    public getMessages(id: number): Observable<MessageResponse[]> {
        return this.chatService.apiChatMessageListGet(id);
    }

    public createConversation(participants: number[]): Observable<CreateResponse> {
        const conversationParticipants: CreateConversationCommand = {
            participantIds: participants
        };

        return this.chatService.apiChatConversationPost(
            conversationParticipants
        );
    }

    sendMessage(conversationId: number, content: string): Observable<any> {
        const messageToSend: CreateMessageCommand = {
            conversationId,
            content
        }
        return this.chatService.apiChatMessagePost(messageToSend);
    }

}