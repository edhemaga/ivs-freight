import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// singalR
import * as signalR from '@microsoft/signalr';

// env
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DispatchHubService {
    private token: string = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : 0;

    private static hubConnection: signalR.HubConnection;

    private establishInitialConnection(): void {
        if (!this.token) return;

        DispatchHubService.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}/dispatchHub`, {
                withCredentials: false,
                skipNegotiation: false,
                accessTokenFactory: async () => this.token
            })
            .build();
    }

    public connect(): void {
        if (!this.token) return;
        this.establishInitialConnection();

        if (
            !DispatchHubService.hubConnection &&
            DispatchHubService.hubConnection?.state !==
                signalR.HubConnectionState.Connecting &&
            DispatchHubService.hubConnection?.state !==
                signalR.HubConnectionState.Connected
        )
            return;
        DispatchHubService.hubConnection.start().then().catch(e => console.log(e));
        DispatchHubService.hubConnection.onclose(() => {
            DispatchHubService.hubConnection.start();
        });
    }

    public disconnect(): void {
        DispatchHubService.hubConnection.stop();
    }

    public onLoadChanged(): void {
        DispatchHubService.hubConnection.on('LoadChanged', response => {
            console.log(response);
        });
    }

    public onDispatchChanged(): void {
        DispatchHubService.hubConnection.on('DispatchChanged', response => {
            console.log(response);
        });
    }

    public onDispatchBoardChanged(): void {
        DispatchHubService.hubConnection.on('DispatchBoardChanged', response => {
            console.log(response);
        });
    } 
}