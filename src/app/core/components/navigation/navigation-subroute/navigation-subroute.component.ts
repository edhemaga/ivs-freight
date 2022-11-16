import {
    Navigation,
    NavigationSubRoute,
    NavigationSubRoutes,
} from '../model/navigation.model';
import {
    Component,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { navigation_route_animation } from '../navigation.animation';

@Component({
    selector: 'app-navigation-subroute',
    templateUrl: './navigation-subroute.component.html',
    styleUrls: ['./navigation-subroute.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [navigation_route_animation('showHideDetails')],
})
export class NavigationSubrouteComponent {
    @Input() subroute: Navigation;
    @Input() isNavigationHovered: boolean = false;
    @Output() onSubrouteActiveEvent = new EventEmitter<NavigationSubRoutes>();

    public isMagicLineActive: boolean = false;

    constructor(private router: Router) {}

    public onSubrouteAction(subroute: NavigationSubRoutes) {
        if (this.subroute.id === subroute.activeRouteFlegId) {
            localStorage.setItem(
                'subroute_active',
                this.subroute.id.toString()
            );
            this.onSubrouteActiveEvent.emit({
                routeId: this.subroute.id,
                routes: this.subroute.route,
                activeRouteFlegId: subroute.activeRouteFlegId,
            });
        }
    }

    public isActiveRouteOnReload(route: string): boolean {
        if (this.router.url.includes(route)) {
            this.isMagicLineActive = true;
        }
        return this.router.url.includes(route);
    }

    public identity(index: number, item: NavigationSubRoute): string {
        return item.name;
    }
}
