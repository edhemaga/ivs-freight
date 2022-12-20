import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { scrollButtonAnimation } from './app.component.animation';
import { StaticInjectorService } from './core/utils/application.decorators';
import { GpsServiceService } from './global/services/gps-service.service';

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
        private _: StaticInjectorService
    ) {}

    ngOnInit() {
        //this.gpsService.startConnection();

        setTimeout(() => {
            this.gpsService.closeConnection();
        }, 30000);
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
                this.titleService.setTitle('CarrierAssist' + ' | ' + event.title);
            });
    }

    /**
     * Top function
     */
    public top() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
