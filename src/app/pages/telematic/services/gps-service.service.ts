import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GpsService {
    private hubConnection: signalR.HubConnection;

    private destroy$ = new Subject<void>();
    public gpsStatusChange = new Subject<any>();

    constructor(private router: Router) {
        this.router.events
            .pipe(
                filter((route) => route instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {});
    }

    public startConnection = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${environment.GPS_ENDPOINT}/gpsHub`, {
                    accessTokenFactory: () => user?.token,
                })
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.hubConnection.on('GpsData', (gps) => {
                this.gpsStatusChange.next(gps);
            });

            this.hubConnection
                .start()
                .then(() => {})
                .catch((err) =>
                    console.log('Error while starting connection: ' + err)
                );
        }
    };

    public closeConnection = () => {
        this.hubConnection?.stop();
    };
}
