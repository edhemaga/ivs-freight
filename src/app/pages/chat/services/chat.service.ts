import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Models
import {
    CompanyUserForChatListResponse,
    ConversationInfoResponse,
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
    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;

    // Headers
    private headers = new HttpHeaders({
        'Authorization': `bearer ${this.token}`,
    });

    constructor(
        public http: HttpClient,

        // Services
        private chatService: ChatService,
        private formDataService: FormDataService
    ) { }

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

    public getCompanyChannels(): Observable<ConversationResponse[]> {
        return this.http.get<ConversationResponse[]>(`${environment.API_ENDPOINT}/api/chat/companychannels`,
            {
                headers: this.headers
            }
        );
    }

    public getConversation(id: number): Observable<ConversationResponse> {
        return this.http.get<ConversationResponse>(
            `${environment.API_ENDPOINT}/api/chat/conversation/${id}`,
            {
                headers: this.headers
            }
        );
    }

    public getMessages(id: number): Observable<MessageResponse[]> {
        const params: HttpParams = new HttpParams({
            fromObject: {
                'MessageSpecParams.ConversationId': id,
            },
        });
        return this.http.get<MessageResponse[]>
            (`${environment.API_ENDPOINT}/api/chat/message/list`,
                {
                    params,
                    headers: this.headers
                }
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
            conversationParticipants,
            { headers: this.headers }
        )
    }

    public sendMessage(
        conversationId: number,
        content: string,
        attachmentsList?: UploadFile[],
        linksList?: string[]
    ): Observable<any> {
        if (!conversationId) return;

        const attachments: File[] = attachmentsList.map(item => {
            return item.realFile
        })


        let links;

        if (linksList) {
            links = linksList.map(link => {
                return {
                    url: link
                }
            })
        }

        const data = { conversationId, content, attachments, links };

        this.formDataService.extractFormDataFromFunction(data);

        return this.http.post(
            `${environment.API_ENDPOINT}/api/chat/message`,
            this.formDataService.formDataValue,
            { headers: this.headers }
        );
    }

    public getAllConversationFiles(conversationId: number): Observable<ConversationInfoResponse> {

        return this.http.get<ConversationInfoResponse>(
            `${environment.API_ENDPOINT}/api/chat/conversation/${conversationId}/files`,
            {
                headers: this.headers
            }
        );
    }
}
