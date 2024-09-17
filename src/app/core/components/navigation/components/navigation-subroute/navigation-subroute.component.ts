import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    Component,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

// animations
import {
    dropDownAnimation,
    navigationRouteAnimation,
    test,
} from '@core/components/navigation/animations/navigation.animation';

// models
import { Navigation } from '@core/components/navigation/models/navigation.model';
import { NavigationSubRoute } from '@core/components/navigation/models/navigation-subroute.model';
import { NavigationSubRoutes } from '@core/components/navigation/models/navigation-subroutes.model';

@Component({
    selector: 'app-navigation-subroute',
    templateUrl: './navigation-subroute.component.html',
    styleUrls: ['./navigation-subroute.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        navigationRouteAnimation('showHideDetails'),
        dropDownAnimation,
        test('test'),
    ],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, AngularSvgIconModule],
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
        if( route.constuction ) return;
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
