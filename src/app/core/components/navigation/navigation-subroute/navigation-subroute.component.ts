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
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
    DropDownAnimation,
    navigation_route_animation,
    test,
} from '../navigation.animation';

@Component({
    selector: 'app-navigation-subroute',
    templateUrl: './navigation-subroute.component.html',
    styleUrls: ['./navigation-subroute.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        navigation_route_animation('showHideDetails'),
        DropDownAnimation,
        test('test'),
    ],
})
export class NavigationSubrouteComponent implements OnChanges {
    @Input() subroute: Navigation;
    @Input() isNavigationHovered: boolean = false;
    @Input() index: number;
    @Input() selectedSubRoute: string;
    @Input() openCloseContainer: boolean = false;
    @Input() otherContainerOpened: boolean;
    @Output() onSubrouteActiveEvent = new EventEmitter<NavigationSubRoutes>();
    @Output() subRouteIndex = new EventEmitter<Number>();
    public isMagicLineActive: boolean = false;
    public doAnimation: boolean = false;
    constructor(private router: Router) {}

    subrouteIndex(index) {
        this.subRouteIndex.emit(index);
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.openCloseContainer);

        if (changes.otherContainerOpened != undefined) {
            let prev = changes?.otherContainerOpened;
            if (prev.currentValue == true && prev.previousValue == false) {
                this.doAnimation = true;
            }
        }
    }
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
    public openLinkInNewWindow(route) {
        window.open(route, '_blank');
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
