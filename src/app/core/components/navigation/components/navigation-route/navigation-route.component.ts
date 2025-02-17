import { ActivatedRoute, Router } from '@angular/router';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// animations
import {
    navigationMagicLine,
    navigationRouteAnimation,
} from '@core/components/navigation/animations/navigation.animation';

// services
import { StaticInjectorService } from '@core/decorators/titles.decorator';
import { NavigationService } from '@core/components/navigation/services/navigation.service';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// models
import {
    NavigationSubRoutes,
    Navigation,
} from '@core/components/navigation/models';

// Const
import { NavigationDataConstants } from '@core/components/navigation/utils/constants/navigation-data.constants';

// enums
import { eStringPlaceholder } from '@shared/enums';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-navigation-route',
    templateUrl: './navigation-route.component.html',
    styleUrls: ['./navigation-route.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        ReactiveFormsModule,
        NgbModule,
        TaAppTooltipV2Component,
    ],
    animations: [
        navigationRouteAnimation('showHideDetails'),
        navigationMagicLine('magicLine'),
    ],
})
export class NavigationRouteComponent implements OnInit, OnChanges {
    @Input() route: Navigation;
    @Input() isActiveSubroute: boolean = false;
    @Input() message: number;
    @Input() files: number;
    @Input() class: string;
    @Input() closeDropdownOnNavClose: boolean;

    @Input() isSettingsPanelOpen: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() isActiveFooterRoute: boolean = false;
    @Input() index: number;
    @Input() ind: number;
    @Input() middleIsHovered: boolean = false;
    @Input() selectedRoute: string = eStringPlaceholder.EMPTY;
    @Input() selectedSubRoute: string = eStringPlaceholder.EMPTY;
    @Input() subrouteContainerOpened: boolean = false;
    @Input() openedDropdown: boolean = false;
    @Input() hideSubrouteTitle: number = -1;
    @Output() onRouteEvent = new EventEmitter<NavigationSubRoutes>();
    @Output() itemIndex = new EventEmitter<Number>();
    @Output() routeWithSubRouteClicked = new EventEmitter<boolean>();
    @Output() hideSubrouteFromChild = new EventEmitter<boolean>();
    @Input() isLocalDropdownOpen: boolean = false;
    public icons = NavigationDataConstants.icons;

    public activeRouteName: string;
    public activeRouteIdFromLocalStorage: number;
    public isNavItemHovered: boolean = false;
    private timeout = null;
    public settingsPage: boolean;
    public arrowHovered: boolean;
    public footerRouteActive: boolean;
    public footerHovered: boolean;
    public textSubRoute: string = eStringPlaceholder.EMPTY;

    public _activeLink = undefined;
    public activeLinkHighlight: boolean = false;
    public showToolTip: boolean;
    public routeId: string;
    public magicBoxAnime = true;
    public navigationIsOpened;
    constructor(
        public router: Router,
        public navigationService: NavigationService,
        public activatedroute: ActivatedRoute
    ) {}
    @Input() set isNavigationHovered(value) {
        this.navigationIsOpened = value;
        if (!this.isNavigationHovered) this._activeLink = 'undefined';
    }
    @Input() set activeLink(value) {
        this.activeLinkHighlight = false;
        if (typeof this._activeLink == 'undefined' && value)
            this._activeLink = value;
        else if (
            typeof this._activeLink != 'undefined' &&
            this.isNavigationHovered != false
        )
            this.activeLinkHighlight = value;
    }
    ngOnInit(): void {
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
    }

    //Get subroute name
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('isNavigationHovered')) {
            const prev = changes.isNavigationHovered;

            if (changes && prev.previousValue != undefined)
                this.magicBoxAnime = changes.isNavigationHovered.currentValue;
        }
        this.textSubRoute = this.selectedSubRoute;
        this.activeRouteIdFromLocalStorage = parseInt(
            localStorage.getItem('subroute_active')
        );

        let router = StaticInjectorService.Injector.get(Router);
        let n = router.url.split('/');
        if (n[2]) {
            if (n[2] == 'todo') this.activeRouteName = 'To-Do';
            else this.activeRouteName = n[2];
        } else this.activeRouteName = n[1];
    }

    public routeWithSubRoutesClick(event): void {
        if (event !== undefined) this.routeWithSubRouteClicked.emit(true);
        else this.routeWithSubRouteClicked.emit(false);
    }
    //Arrow clicked open link in new window
    public openLinkInNewWindow(item): void {
        window.open(item, '_blank');
    }
    //Arrow hovered change fill
    public hoveredArrow(event): void {
        this.arrowHovered = event;
    }

    public onRouteAction(ind?, underConstruction?: boolean): void {
        if (underConstruction) return;
        ind && this.hideSubrouteFromChild.emit(ind);

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

    public onReloadSubroute(flegId?: number): void {
        this.onRouteEvent.emit({
            routeId: this.route.id,
            routes: this.route.route,
            activeRouteFlegId: flegId,
        });
    }

    private isActiveRouteOnReload(pathname: string): void {
        const flegId = JSON.parse(localStorage.getItem('subroute_active'));

        if (flegId && this.route.id === flegId) this.onReloadSubroute(flegId);

        if (
            !Array.isArray(this.route.route) &&
            this.route.route.includes(pathname)
        )
            this.onRouteAction();
    }

    public onNavItemHover(type: boolean): void {
        if (!type) {
            this.isNavItemHovered = false;
            return;
        }
        this.isNavItemHovered = !(
            [3, 4, 5, 6].includes(this.route.id) && this.route.isRouteActive
        );
    }
}
