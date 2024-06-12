import { Component, OnInit } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map, mergeMap } from 'rxjs';

// animations
import { scrollButtonAnimation } from '@core/animations/scroll-button.animation';
import {
    slideLeft,
    slideRight,
} from '@pages/applicant/animations/applicant-route.animation';

// services
import { StaticInjectorService } from '@core/decorators/titles.decorator';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        scrollButtonAnimation('scrollButtonAnimation'),
        trigger('animRoutes', [
            transition(':increment', slideRight),
            transition(':decrement', slideLeft),
        ]),
    ],
})
export class AppComponent implements OnInit {
    public showScrollButton = false;
    

    public currentPage: string = 'login';

    public animationState: number = 0;

    constructor(
        private router: Router,
        public titleService: Title,
        private activatedRoute: ActivatedRoute,
        private _: StaticInjectorService
    ) {}

    ngOnInit(): void {
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
    }

    public top(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    public handleRouteAnimationActivate(): void {
        this.animationState =
            this.activatedRoute.firstChild.snapshot.data['routeIdx'];
    }
}
