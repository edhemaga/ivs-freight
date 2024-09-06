import {
    Component,
    EnvironmentInjector,
    Injector,
    OnInit,
    TemplateRef,
    createComponent,
} from '@angular/core';
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
import { ChatHubService } from '@pages/chat/services/chat-hub.service';
import { ReusableTemplatesComponent } from '@shared/components/reusable-templates/reusable-templates.component';
import { TemplateManagerService } from '@shared/services/template-manager.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        {
            provide: ReusableTemplatesComponent,
            useFactory: (environmentInjector: EnvironmentInjector) => {
                // Create the component manually with EnvironmentInjector
                const componentRef = createComponent(
                    ReusableTemplatesComponent,
                    {
                        environmentInjector,
                    }
                );
                componentRef.changeDetectorRef.detectChanges(); // Trigger change detection
                return componentRef.instance;
            },
            deps: [EnvironmentInjector], // Inject EnvironmentInjector
        },
    ],
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
        public titleService: Title,

        // Routing
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // Services
        private _: StaticInjectorService,
        private chatHubService: ChatHubService,

        //components
        private reusableTemplatesComponent: ReusableTemplatesComponent,
        private templateManagerService: TemplateManagerService
    ) {}

    ngOnInit(): void {
        this.registerAllTemplates();
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
        this.connectToChatHub();
    }

    private registerAllTemplates(): void {
        const templatePrefix = 'template'; // Define a prefix or use a common convention
        const properties = Object.keys(this.reusableTemplatesComponent) as (keyof ReusableTemplatesComponent)[];
        
        properties.forEach((property) => {
          if (property.startsWith(templatePrefix)) {
            const templateRef = this.reusableTemplatesComponent[property];
            if (templateRef instanceof TemplateRef) {
              this.templateManagerService.setTemplate(property as string, templateRef);
            }
          }
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
        this.chatHubService.connect();
    }
}
