import { NavigationSubRoutes } from '../model/navigation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {
    navigation_magic_line,
    navigation_route_animation,
} from '../navigation.animation';
import { StaticInjectorService } from 'src/app/core/utils/application.decorators';
import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-navigation-route',
    templateUrl: './navigation-route.component.html',
    styleUrls: ['./navigation-route.component.scss'],
    animations: [
        navigation_route_animation('showHideDetails'),
        navigation_magic_line('magicLine'),
    ],
})
export class NavigationRouteComponent implements OnInit {
    @Input() route: Navigation;
    @Input() isNavigationHovered: boolean = false;
    @Input() isActiveSubroute: boolean = false;
    @Input() message: number;
    @Input() files: number;
    @Input() class: string;
    @Input() closeDropdownOnNavClose: boolean;
    @Input() activeLink: boolean = false;
    @Input() isSettingsPanelOpen: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() isActiveFooterRoute: boolean = false;
    @Input() index: number;
    @Input() middleIsHovered: boolean = false;
    @Input() selectedRoute: string = '';
    @Input() selectedSubRoute: string = '';

    @Output() onRouteEvent = new EventEmitter<NavigationSubRoutes>();
    @Output() itemIndex = new EventEmitter<Number>();
    public activeRouteName: string;
    public activeRouteIdFromLocalStorage: number;
    public isNavItemHovered: boolean = false;
    private timeout = null;
    public settingsPage: boolean;
    public arrowHovered: boolean;
    public footerRouteActive: boolean;
    public footerHovered: boolean;
    public textSubRoute: string = '';
    showToolTip: boolean;
    routeId: string;
    // routeName: string;
    constructor(
        public router: Router,
        public navigationService: NavigationService,
        public activatedroute: ActivatedRoute
    ) {}
    routeIndex(ind) {
        // this.itemIndex.emit(ind);
    }
    //Get subroute name
    ngOnChanges(changes: SimpleChanges) {
        this.textSubRoute = this.selectedSubRoute;
        this.activeRouteIdFromLocalStorage = parseInt(
            localStorage.getItem('subroute_active')
        );

        let router = StaticInjectorService.Injector.get(Router);
        let n = router.url.split('/');
        if (n[2]) {
            this.activeRouteName = n[2];
        } else {
            this.activeRouteName = n[1];
        }
    }

    ngOnInit() {
        console.log(this.route.route);
        this.timeout = setTimeout(() => {
            this.isActiveRouteOnReload(window.location.pathname);
            clearTimeout(this.timeout);
        }, 1000);
        this.navigationService.getValueWhichNavIsOpen().subscribe((value) => {
            this.footerRouteActive = value;
        });
        this.navigationService.getValueFootHovered().subscribe((value) => {
            this.footerHovered = value;
        });
        // this.router.events.subscribe((val: any) => {
        //     console.log(val.urlAfterRedirects);
        // });
    }
    //Arrow clicked open link in new window
    public openLinkInNewWindow(item) {
        window.open(item, '_blank');
    }
    //Arrow hovered change fill
    public hoveredArrow(event) {
        this.arrowHovered = event;
    }
    public onRouteAction() {
        this.onRouteEvent.emit({
            routeId: this.route.id,
            routes: this.route.route,
            activeRouteFlegId: JSON.parse(
                localStorage.getItem('subroute_active')
            ),
        });
        if (!Array.isArray(this.route.route)) {
            this.itemIndex.emit(this.index);
            this.router.navigate([`${this.route.route}`]);
        }
    }

    public onReloadSubroute(flegId?: number) {
        this.onRouteEvent.emit({
            routeId: this.route.id,
            routes: this.route.route,
            activeRouteFlegId: flegId,
        });
    }

    private isActiveRouteOnReload(pathname: string) {
        const flegId = JSON.parse(localStorage.getItem('subroute_active'));

        if (flegId && this.route.id === flegId) {
            this.onReloadSubroute(flegId);
        }

        if (
            !Array.isArray(this.route.route) &&
            this.route.route.includes(pathname)
        ) {
            this.onRouteAction();
        }
    }

    public onNavItemHover(type: boolean) {
        if (type) {
            this.isNavItemHovered = !(
                [3, 4, 5, 6].includes(this.route.id) && this.route.isRouteActive
            );
        } else {
            this.isNavItemHovered = false;
        }
    }
}
