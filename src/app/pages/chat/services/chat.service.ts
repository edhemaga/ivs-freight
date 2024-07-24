import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpEvent,
    HttpHeaders,
} from "@angular/common/http";

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

// environment
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserChatService {

    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;

    constructor(
        public http: HttpClient,
        private chatService: ChatService
    ) {
    }

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
    ): Observable<HttpEvent<CreateResponse>> {

        if (!conversationId) return;

        // Data
        var formData: FormData = new FormData();
        console.log(formData)

        formData.append('MessageType', String(1));
        formData.append('ConversationId', String(conversationId));
        formData.append('Content', content);
        console.log(formData)

        if (attachments) attachments.forEach(attachment => {
            formData.append('Attachments', attachment);
        })

        // Headers
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });

        headers.set('Content-Type', 'multipart/form-data');
        headers.set('Accept', 'application/json');

        return this.http.post(
            `${environment.API_ENDPOINT}/api/chat/message`,
            formData,
            {
                headers,
                reportProgress: true,
                observe: 'events',
            }
        );
    }

}