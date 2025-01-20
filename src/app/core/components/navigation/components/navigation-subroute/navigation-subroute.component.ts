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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// animations
import {
    dropDownAnimation,
    navigationRouteAnimation,
    test,
} from '@core/components/navigation/animations/navigation.animation';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Constants
import { NavigationDataConstants } from '@core/components/navigation/utils/constants/navigation-data.constants';

// models
import {
    NavigationSubRoutes,
    Navigation,
} from '@core/components/navigation/models';

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
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AngularSvgIconModule,
        NgbModule,
        TaAppTooltipV2Component,
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
    @Input() isLastChild: boolean;
    public icons = NavigationDataConstants.icons;
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
        event.stopPropagation();
        if (route.constuction) return;
        window.open(route, '_blank');
    }
    public isActiveRouteOnReload(route: string): boolean {
        if (this.router.url.includes(route)) {
            this.isMagicLineActive = true;
        }
        return this.router.url.includes(route);
    }
}
