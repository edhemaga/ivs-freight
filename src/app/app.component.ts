import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    catchError,
    filter,
    map,
    mergeMap,
    of,
    switchMap,
    throwError,
} from 'rxjs';
import { scrollButtonAnimation } from './app.component.animation';
import { StaticInjectorService } from './core/utils/application.decorators';
import { GpsServiceService } from './global/services/gps-service.service';
import { SignInResponse } from '../../appcoretruckassist/model/signInResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from '../../appcoretruckassist/api/account.service';
import { configFactory } from './app.config';
import { UserLoggedService } from './core/components/authentication/state/user-logged.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [scrollButtonAnimation('scrollButtonAnimation')],
})
export class AppComponent implements OnInit {
    public showScrollButton = false;

    public currentPage: string = 'login';

    constructor(
        private router: Router,
        public titleService: Title,
        private activatedRoute: ActivatedRoute,
        private gpsService: GpsServiceService,
        private _: StaticInjectorService,
        private accountService: AccountService,
        private userLoggedService: UserLoggedService
    ) {}

    ngOnInit() {
        //this.gpsService.startConnection();

        // setTimeout(() => {
        //     this.gpsService.closeConnection();
        // }, 30000);
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route: any) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                filter((route) => route.outlet === 'primary'),
                mergeMap((route: any) => route.data)
            )
            .subscribe((event: any) => {
                this.currentPage = event?.title?.toLowerCase();
                this.titleService.setTitle(
                    'CarrierAssist' + ' | ' + event.title
                );
            });

        setTimeout(() => {
            this.checkRefreshTokenExpiration();
        }, 300);
    }

    /**
     * Top function
     */
    public top() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    public checkRefreshTokenExpiration() {
        const user: SignInResponse = JSON.parse(localStorage.getItem('user'));

        if (user) {
            this.accountService
                .apiAccountRefreshPost({
                    refreshToken: user.refreshToken,
                })
                .pipe(
                    switchMap((res: any) => {
                        user.token = res.token;
                        user.refreshToken = res.refreshToken;
                        localStorage.setItem('user', JSON.stringify(user));
                        configFactory(this.userLoggedService);
                        return of(true);
                    }),
                    catchError((err: HttpErrorResponse) => {
                        if (err.status === 404 || err.status === 500) {
                            this.currentPage = 'login';
                            localStorage.removeItem('user');
                            this.router.navigate(['/auth']);
                            window.location.reload();
                        }
                        return throwError(() => err);
                    })
                )
                .subscribe();
        }
    }
}
