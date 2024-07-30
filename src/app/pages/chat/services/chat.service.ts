import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Models
import {
    CompanyUserForChatListResponse,
    ConversationResponse,
    CreateConversationCommand,
    CreateResponse,
    MessageResponse,
    UserType,
} from 'appcoretruckassist';
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
    // Headers
    private headers = new HttpHeaders({
        'skip-form': '1',
    });
    constructor(
        public http: HttpClient,

        // Services
        private chatService: ChatService,
        private formDataService: FormDataService
    ) {}

    public getCompanyUserList(
        userType: UserType,
        searchParam?: string
    ): Observable<CompanyUserForChatListResponse> {
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
        return this.http.get<ConversationResponse>(
            `${environment.API_ENDPOINT}/api/chat/conversation/${id}`
        );
    }

    public getMessages(id: number): Observable<MessageResponse[]> {
        const params: HttpParams = new HttpParams({
            fromObject: {
                'MessageSpecParams.ConversationId': id,
            },
        });
        return this.http.get<MessageResponse[]>(
            `${environment.API_ENDPOINT}/api/chat/message/list`,
            { params }
        );
    }

    public createConversation(
        participants: number[]
    ): Observable<CreateResponse> {
        const conversationParticipants: CreateConversationCommand = {
            participantIds: participants,
        };

        return this.http.post(
            `${environment.API_ENDPOINT}/api/chat/conversation`,
            conversationParticipants
        );
    }

    public sendMessage(
        conversationId: number,
        content: string,
        attachments?: UploadFile[]
    ): Observable<any> {
        if (!conversationId) return;

        const data = { conversationId, content, attachments };

        this.formDataService.extractFormDataFromFunction(data);

        return this.http.post(
            `${environment.API_ENDPOINT}/api/chat/message`,
            this.formDataService.formDataValue,
            { headers: this.headers }
        );
    }
}
