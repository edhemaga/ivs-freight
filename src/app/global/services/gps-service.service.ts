import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GpsServiceService {
    private hubConnection: signalR.HubConnection;
    private destroy$ = new Subject<void>();
    constructor(private router: Router) {
        this.router.events
            .pipe(
                filter((route) => route instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe((route: NavigationEnd) => {
                /*   console.log('WHAT IS ROUTE', route.url); */
            });
    }

    public startConnection = () => {
        // return new Promise((resolve, reject) => {
        // Object.defineProperty(WebSocket, 'OPEN', { value: 1 }); // workaround za da se otvori socket jbg

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${environment.GPS_ENDPOINT}/gpsHub`, {
                    accessTokenFactory: () => user?.token,
                })
                // .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.hubConnection.on('GpsData', (gps) => {
                console.log(gps);
            });

            this.hubConnection
                .start()
                .then(() => {
                    console.log('CONNECTION STARTED');
                    console.log(this.hubConnection);
                })
                .catch((err) =>
                    console.log('Error while starting connection: ' + err)
                );
        }
    };
}
