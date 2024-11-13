import { Component, OnInit } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map, mergeMap } from 'rxjs';

// Animations
import { scrollButtonAnimation } from '@core/animations/scroll-button.animation';
import {
    slideLeft,
    slideRight,
} from '@pages/applicant/animations/applicant-route.animation';

// Services
import { StaticInjectorService } from '@core/decorators/titles.decorator';
import { ChatHubService } from '@pages/chat/services/chat-hub.service';

// Pipes
import { BlockedContentPipe } from '@core/pipes/blocked-content.pipe';

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

    public isSidePanelPinned: boolean = false;

    constructor(
        public titleService: Title,

        // Routing
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // Services
        private _: StaticInjectorService,
        private chatHubService: ChatHubService,

        // Pipes
        private blockedContent: BlockedContentPipe
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
                this.connectToChatHub();
            });
    }

    public top(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    public handleRouteAnimationActivate(): void {
        this.animationState =
            this.activatedRoute.firstChild.snapshot.data['routeIdx'];
    }

    private connectToChatHub(): void {
        if (this.blockedContent.transform(this.currentPage)) return;

        this.chatHubService.connect();
    }

    public sidePanelPinEvent(isSidePanelPinned: boolean): void {
        this.isSidePanelPinned = isSidePanelPinned;
    }
}
