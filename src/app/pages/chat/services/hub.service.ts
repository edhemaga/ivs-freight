import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

export class HubService {
    hubConnection: HubConnection;

    constructor() {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}/api/chat`, {
                skipNegotiation: false,
            }).build();

    }

    connect(): Observable<void> {
        return new Observable<void>((observer) => {
            this.hubConnection
                .start()
                .then(() => {
                    console.log("Connected!")
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    receiveMessage(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection.on('ReceiveMessage', (message: string) => {
                observer.next(message);
            });
        });
    }
}