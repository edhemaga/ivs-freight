import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

// Models
import {
    CompanyUserForChatListResponse,
    ConversationResponse,
    CreateConversationCommand,
    CreateResponse,
    MessageResponse,
    UserType
} from "appcoretruckassist";

// Services
import { ChatService } from "appcoretruckassist/api/chat.service";

@Injectable({
    providedIn: 'root'
})
export class UserChatService {

    constructor(private chatService: ChatService) { }

    public getCompanyUserList(userType: UserType, searchParam?: string): Observable<CompanyUserForChatListResponse> {
        return this.chatService.apiChatUserListGet(
            null,
            userType,
            null,
            null,
            null,
            null,
            searchParam ?? null,
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

    public sendMessage(
        conversationId: number,
        content: string,
        attachments?: Blob[]
    ): Observable<CreateResponse> {
        return this.chatService.apiChatMessagePost(
            1,
            conversationId,
            content,
        );
    }

}