import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// singalR
import * as signalR from '@microsoft/signalr';

// env
import { environment } from 'src/environments/environment';

// models
import {
    DispatchBoardResponse,
    DispatchResponse,
    LoadListDto,
} from 'appcoretruckassist';

// utils
import { DispatchHubConstants } from '@shared/utils/constants';
import { UserHelper } from '@shared/utils/helpers';

// enums
import { eStringPlaceholder } from 'ca-components';

// utils

@Injectable({
    providedIn: 'root',
})
export class DispatchHubService {
    private token: string =
        UserHelper.getUserFromLocalStorage()?.token ?? eStringPlaceholder.EMPTY;

    private static hubConnection: signalR.HubConnection;

    private establishInitialConnection(): void {
        if (!this.token) return;

        DispatchHubService.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}/dispatchHub`, {
                withCredentials: false,
                skipNegotiation: false,
                accessTokenFactory: async () => this.token,
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

        DispatchHubService.hubConnection.start().then().catch();

        DispatchHubService.hubConnection.onclose(() => {
            DispatchHubService.hubConnection.start();
        });
    }

    public disconnect(): void {
        DispatchHubService.hubConnection.stop();
    }

    public onLoadChanged(): Observable<LoadListDto[]> {
        return new Observable<LoadListDto[]>((observer) => {
            DispatchHubService.hubConnection.on(
                DispatchHubConstants.HUB_EVENT_LOAD_CHANGED,
                (response) => {
                    observer.next(response);
                }
            );
        });
    }

    public onDispatchChanged(): Observable<DispatchResponse> {
        return new Observable<DispatchResponse>((observer) => {
            DispatchHubService.hubConnection.on(
                DispatchHubConstants.HUB_EVENT_DISPATCH_CHANGED,
                (response) => {
                    observer.next(response);
                }
            );
        });
    }

    public onDispatchBoardChanged(): Observable<DispatchBoardResponse> {
        return new Observable<DispatchBoardResponse>((observer) => {
            DispatchHubService.hubConnection.on(
                DispatchHubConstants.HUB_EVENT_DISPATCH_BOARD_CHANGED,
                (response) => {
                    observer.next(response);
                }
            );
        });
    }
}
