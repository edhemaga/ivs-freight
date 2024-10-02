import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// SingalR
import * as signalR from '@microsoft/signalr';

// Models
import { ChatMessage } from '@pages/chat/models';

// Env
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChatHubService {
    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;
    private static hubConnection: signalR.HubConnection;

    private establishInitialConnection(): void {
        if (!this.token) return;

        ChatHubService.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}/chatHub`, {
                withCredentials: false,
                skipNegotiation: false,
                accessTokenFactory: () => this.token,
            })
            .withAutomaticReconnect()
            .configureLogging(6) // No logs at all; none
            .build();
    }

    public connect(): void {
        if (!this.token) return;

        this.establishInitialConnection();

        if (
            !ChatHubService.hubConnection &&
            ChatHubService.hubConnection?.state !==
                signalR.HubConnectionState.Connecting &&
            ChatHubService.hubConnection?.state !==
                signalR.HubConnectionState.Connected
        )
            return;

        ChatHubService.hubConnection.start().then();

        ChatHubService.hubConnection.onclose(() => {
            ChatHubService.hubConnection.start();
        });
    }

    public disconnect(): void {
        ChatHubService.hubConnection.stop().then();
    }

    public static receiveMessage(): Observable<ChatMessage> {
        return new Observable<ChatMessage>((observer) => {
            ChatHubService.hubConnection.on(
                'ReceiveMessage',
                (newMessage: ChatMessage) => {
                    return observer.next(newMessage);
                }
            );
        });
    }

    public static notifyTyping(conversationId: number): void {
        // If function within a hub is called 'invoke' is a must
        // invoke(name of the function, arguments), send not working
        ChatHubService.hubConnection.invoke(`NotifyTyping`, conversationId);
    }

    public receiveTypingNotification(): Observable<number> {
        return new Observable<number>((observer) => {
            ChatHubService.hubConnection.on(
                'ReceiveTypingNotification',
                (companyUserId: number) => {
                    observer.next(companyUserId);
                }
            );
            observer.next(0);
        });
    }
}
