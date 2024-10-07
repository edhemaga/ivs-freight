import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Models
import {
    CompanyUserForChatListResponse,
    ConversationInfoResponse,
    ConversationResponse,
    ConversationType,
    CreateConversationCommand,
    CreateResponse,
    UserType,
} from 'appcoretruckassist';
import {
    ChatMessagePaginationResponse,
    ChatMessageResponse,
} from '@pages/chat/models';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// Services
import { ChatService } from 'appcoretruckassist/api/chat.service';
import { FormDataService } from '@shared/services/form-data.service';

// environment
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserChatService {
    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;

    // Headers
    private headers = new HttpHeaders({
        Authorization: `bearer ${this.token}`,
    });

    constructor(
        public http: HttpClient,

        // Services
        private chatService: ChatService,
        private formDataService: FormDataService
    ) {}

    public getCompanyUserList(
        userType: UserType,
        pageIndex?: number,
        pageSize?: number,
        searchParam?: string
    ): Observable<CompanyUserForChatListResponse> {
        return this.chatService.apiChatUserListGet(
            null,
            userType,
            pageIndex,
            pageSize,
            null,
            null,
            null,
            null,
            searchParam,
            null
        );
    }

    public getCompanyChannels(): Observable<ConversationResponse[]> {
        return this.http.get<ConversationResponse[]>(
            `${environment.API_ENDPOINT}/api/chat/companychannels`,
            {
                headers: this.headers,
            }
        );
    }

    public getConversation(id: number): Observable<ConversationResponse> {
        return this.http.get<ConversationResponse>(
            `${environment.API_ENDPOINT}/api/chat/conversation/${id}`,
            {
                headers: this.headers,
            }
        );
    }

    public getMessages(
        conversationId: number
    ): Observable<ChatMessagePaginationResponse> {
        const params: HttpParams = new HttpParams({
            fromObject: {
                'MessageSpecParams.ConversationId': conversationId,
            },
        });
        return this.http.get<ChatMessagePaginationResponse>(
            `${environment.API_ENDPOINT}/api/chat/message/list`,
            {
                params,
                headers: this.headers,
            }
        );
    }

    public createConversation(
        participants: number[],
        chatType: ConversationType
    ): Observable<CreateResponse> {
        const conversationParticipants: CreateConversationCommand = {
            participantIds: participants,
            conversationType: chatType,
        };

        return this.http.post(
            `${environment.API_ENDPOINT}/api/chat/conversation`,
            conversationParticipants,
            { headers: this.headers }
        );
    }

    public sendMessage(
        conversationId: number,
        messageType: number,
        content: string,
        attachmentsList?: UploadFile[],
        linksList?: string[],
        parentMessageId?: number
    ): Observable<any> {
        if (!conversationId) return;

        const attachments: File[] = attachmentsList.map((item) => {
            return item.realFile;
        });

        const links = linksList?.map((link) => {
            return {
                url: link,
            };
        });

        const data = {
            conversationId,
            messageType,
            content,
            attachments,
            links,
            parentMessageId,
        };

        console.log(data);

        this.formDataService.extractFormDataFromFunction(data);

        return this.http.post(
            `${environment.API_ENDPOINT}/api/chat/message`,
            this.formDataService.formDataValue,
            { headers: this.headers }
        );
    }

    public editMessage(messageId: number, content: string): Observable<Object> {
        return this.http.put(
            `${environment.API_ENDPOINT}/api/chat/message`,
            {
                id: messageId,
                content,
            },
            { headers: this.headers }
        );
    }

    public deleteMessage(messageId: number): Observable<any> {
        return this.http.delete(
            `${environment.API_ENDPOINT}/api/chat/message/${messageId}`,
            {
                headers: this.headers,
            }
        );
    }

    public getAllConversationFiles(
        conversationId: number
    ): Observable<ConversationInfoResponse> {
        return this.http.get<ConversationInfoResponse>(
            `${environment.API_ENDPOINT}/api/chat/conversation/${conversationId}/files`,
            {
                headers: this.headers,
            }
        );
    }
}
