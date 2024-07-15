import { Observable } from 'rxjs';

// SingalR
import * as signalR from '@microsoft/signalr';

// Models
import { MessageResponse } from 'appcoretruckassist';

// Env
import { environment } from 'src/environments/environment';

export class HubService {
    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;
    private hubConnection!: signalR.HubConnection;

    private establishInitialConnection(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}/chatHub`, {
                withCredentials: false,
                skipNegotiation: false,
                accessTokenFactory: () => this.token,
                transport: 4 // 4 - Long polling, web socket not working at the moment
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

    public receiveMessage(): Observable<MessageResponse> {
        return new Observable<MessageResponse>((observer) => {
            this.hubConnection.on('ReceiveMessage',
                (
                    messageId: number,
                    senderId: number,
                    senderName: string,
                    conversationId: number,
                    content: string
                ) => {
                    const newMessage: MessageResponse = {
                        id: messageId,
                        sender: {
                            id: senderId,
                            fullName: senderName
                        },
                        conversationId: conversationId,
                        content: content,
                    }
                    return observer.next(newMessage);
                }
            );
        });
    }

}
