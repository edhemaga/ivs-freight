import { Observable } from 'rxjs';

// SingalR
import * as signalR from '@microsoft/signalr';

// Models
import { ChatMessageResponse } from '@pages/chat/models/chat-message-reponse.model';

// Env
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChatHubService {

    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;
    private hubConnection!: signalR.HubConnection;

    private establishInitialConnection(): void {
        if (!this.token) return;
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}/chatHub`, {
                withCredentials: false,
                skipNegotiation: false,
                accessTokenFactory: () => this.token
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();
    }

    public connect(): Observable<void> {
        if (!this.token) return;

        this.establishInitialConnection();

        if (!this.hubConnection) return;

        return new Observable<void>((observer) => {
            this.hubConnection
                .start()
                .then(() => {
                    observer.next();
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    public disconnect(): void {
        this.hubConnection
            .stop()
            .then();
    }

    public receiveMessage(): Observable<ChatMessageResponse> {
        return new Observable<ChatMessageResponse>((observer) => {
            this.hubConnection.on('ReceiveMessage',
                (
                    newMessage: ChatMessageResponse
                ) => {
                    return observer.next(newMessage);
                }
            );
        });
    }

    public notifyTyping(conversationId: number): void {
        // If function within a hub is called 'invoke' is a must
        // invoke(name of the function, arguments)
        // Send would not work
        this.hubConnection.invoke(`NotifyTyping`, conversationId);
    }

    public receiveTypingNotification(): Observable<number> {
        return new Observable<number>((observer) => {
            this.hubConnection.on('ReceiveTypingNotification',
                (companyUserId: number) => {
                    observer.next(companyUserId);
                });
            observer.next(0);
        })
    }


}
