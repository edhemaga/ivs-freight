import { Navigation, NavigationSubRoutes } from './model/navigation.model';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { navigationData } from './model/navigation-data';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from './services/navigation.service';
import { navigation_magic_line } from './navigation.animation';
import { DetailsDataService } from '../../services/details-data/details-data.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [navigation_magic_line('showHideDetails')],
    host: {
        '(document:click)': 'closeNavbar($event)',
    },
})
export class NavigationComponent implements OnInit, OnDestroy {
    public navigation: Navigation[] = navigationData;

    public isNavigationHovered: boolean = false;
    public isNavigationOpenend: boolean = false;
    public isModalPanelOpen: boolean = false;
    public isUserPanelOpen: boolean = false;
    public isSettingsPanelOpen: boolean = false;
    public isUserCompanyDetailsOpen: boolean = false;
    private isActiveSubrouteIndex: number = -1;
    public isActiveSubroute: boolean = false;
    public activeSubrouteFleg: boolean = false;
    public footerHovered: boolean = false;
    public isActiveFooterRoute: boolean = false;
    public routeInSettingsActive: boolean = false;
    public isActiveMagicLine: boolean = true;
    public hideMagicLine: boolean = false;
    public showHideLineIfSettingsActive: boolean = true;
    public footerRouteActive: boolean = true;
    private destroy$ = new Subject<void>();
    closeDropdownOnNavClose: boolean;
    @ViewChild('navbar') navbar: ElementRef;
    constructor(
        private router: Router,
        private navigationService: NavigationService,
        private DetailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.navigationService.getValueNavHovered().subscribe((value) => {
            this.footerHovered = value;
        });
        this.navigationService.getValueWhichNavIsOpen().subscribe((value) => {
            this.footerRouteActive = value;
        });
        this.navigationService.navigationDropdownActivation$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                switch (data.name) {
                    case 'Modal Panel': {
                        if (data.type) {
                            this.isModalPanelOpen = data.type;
                            this.isUserPanelOpen = false;
                            this.isSettingsPanelOpen = false;
                            this.isUserCompanyDetailsOpen = false;
                        } else {
                            this.isModalPanelOpen = data.type;
                        }
                        break;
                    }
                    case 'Settings': {
                        if (data.type) {
                            this.isModalPanelOpen = false;
                            this.isUserPanelOpen = false;
                            this.isUserCompanyDetailsOpen = false;
                            this.isSettingsPanelOpen = data.type;
                        } else {
                            this.isSettingsPanelOpen = data.type;
                        }
                        break;
                    }
                    case 'User Panel': {
                        if (data.type) {
                            this.isModalPanelOpen = false;
                            this.isSettingsPanelOpen = false;
                            this.isUserPanelOpen = data.type;
                            this.isUserCompanyDetailsOpen = false;
                        } else {
                            this.isUserPanelOpen = data.type;
                        }
                        break;
                    }
                    case 'User Company Details': {
                        if (data.type) {
                            this.isModalPanelOpen = false;
                            this.isUserPanelOpen = false;
                            this.isSettingsPanelOpen = false;
                            this.isUserCompanyDetailsOpen = data.type;
                        } else {
                            this.isUserCompanyDetailsOpen = data.type;
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
    }
    //Midle navigation hovered hide magic line in footer nav
    onMidleNavHover(event) {
        this.navigationService.setValueNavHovered(event);
    }
    public routeInSettingsActivated($event) {
        this.routeInSettingsActive = $event;
    }
    public footerHoveredHideLine($event) {
        // this.footerHovered = $event;
    }
    //On outside of navbar close navbar
    closeNavbar(event) {
        console.log(event.target);

        if (
            //If this elements keep open navigation
            event.target.parentElement.classList.contains(
                'nav-header-top-logo'
            ) ||
            event.target.classList.contains('subroute') ||
            this.navbar.nativeElement.contains(event.target || 'panel-user') ||
            event.target.classList.contains('modal-nav-close') ||
            event.target.classList.contains('panel-user') ||
            event.target.classList.contains('nav-footer-user-company') ||
            event.target.classList.contains('panel-image') ||
            event.target.classList.contains('status-marker') ||
            event.target.classList.contains('nav-footer-user-name') ||
            event.target.classList.contains('nav-footer-user-name') ||
            event.target.classList.contains('user-content-text') ||
            event.target.classList.contains('modal-nav-close-text') ||
            event.target.classList.contains('user-company-header') ||
            event.target.parentElement?.parentElement?.classList.contains(
                'modal-nav-close-svg'
            ) ||
            event.target.parentElement?.parentElement?.classList.contains(
                'user-company-header-svg'
            ) ||
            event.target.classList.contains('user-company-header-text')
        ) {
            //If this elements close navigation
            if (
                event.target.classList.contains('open-navigation') ||
                event.target.classList.contains('notification-svg ') ||
                event.target.classList.contains('item-settings') ||
                event.target.classList.contains('navigation-middle') ||
                event.target.classList.contains('navigation-top') ||
                event.target.classList.contains('magic-line-footer') ||
                event.target.classList.contains('navigation-bottom') ||
                event.target.classList.contains('tooltip') ||
                event.target.parentElement?.classList.contains(
                    'item-settings'
                ) ||
                event.target.parentElement?.parentElement?.classList.contains(
                    'item-settings'
                ) ||
                event.target.classList.contains('nav-footer-image') ||
                event.target.parentElement?.classList.contains(
                    'notification'
                ) ||
                event.target.parentElement?.classList.contains(
                    'nav-header-top-logo'
                ) ||
                event.target.classList.contains('notification-svg') ||
                event.target?.parentElement?.parentElement.classList.contains(
                    'nav-header-top-logo'
                ) ||
                event.target.parentElement?.classList.contains('close') ||
                event.target.parentElement?.parentElement?.classList.contains(
                    'close'
                ) ||
                event.target.parentElement?.parentElement?.parentElement?.classList.contains(
                    'close'
                )
            ) {
                this.isUserCompanyDetailsOpen = false;
                this.closeDropdownOnNavClose = false;
                this.isUserPanelOpen = false;
                this.isActiveMagicLine = true;
                this.isModalPanelOpen = false;
                this.isActiveSubroute = false;

                this.navigationService.onDropdownActivation({
                    name: 'Settings',
                    type: false,
                });
                return (this.isNavigationHovered = false);
            }
            this.isNavigationHovered = true;
        } else {
            this.isUserCompanyDetailsOpen = false;
            this.closeDropdownOnNavClose = false;
            this.isUserPanelOpen = false;
            this.isActiveMagicLine = true;
            this.isModalPanelOpen = false;
            this.isActiveSubroute = false;
            this.isNavigationHovered = false;
            this.navigationService.onDropdownActivation({
                name: 'Settings',
                type: false,
            });
        }
    }

    public onRouteEvent(subroute: NavigationSubRoutes): void {
        localStorage.removeItem('footer_active');
        const index = this.navigation.findIndex(
            (item) => item.id === subroute.routeId
        );
        this.onActivateFooterRoute(false);
        this.isModalPanelOpen = false;
        this.isUserPanelOpen = false;
        this.isSettingsPanelOpen = false;
        this.isUserCompanyDetailsOpen = false;

        if (Array.isArray(subroute.routes)) {
            this.activationSubRoute(index, subroute);
        } else if (index > -1) {
            this.activationMainRoute(index);
        }
    }

    private activationSubRoute(
        index: number,
        subroute: NavigationSubRoutes
    ): void {
        if (index === this.isActiveSubrouteIndex) {
            this.navigationService.setValueWhichNavIsOpen(true);
            this.navigation[index].isRouteActive =
                !this.navigation[index].isRouteActive;

            if (subroute.activeRouteFlegId === this.navigation[index].id) {
                this.isActiveSubroute = true;
                this.activeSubrouteFleg = true;
            }

            if (!this.navigation[index].isRouteActive) {
                this.isActiveSubroute = false;
                this.navigation[index].isSubrouteActive = true;
            } else {
                this.isActiveSubroute = true;
                this.navigation[index].isSubrouteActive = false;
            }
        }

        if (index !== this.isActiveSubrouteIndex) {
            this.navigation.forEach((nav) => (nav.isRouteActive = false));
            this.isActiveSubroute = true;
            this.activeSubrouteFleg = false;
            if (this.isActiveSubrouteIndex != -1) {
                this.navigation[this.isActiveSubrouteIndex].isSubrouteActive =
                    false;
            }
            this.isActiveSubrouteIndex = index;
            this.navigation[index].isRouteActive = true;
        }
        this.isActiveFooterRoute = false;
    }

    private activationMainRoute(index: number): void {
        this.navigationService.setValueWhichNavIsOpen(true);
        this.disableRoutes();
        this.navigation[index].isRouteActive = true;
        this.isActiveFooterRoute = false;
    }

    private disableRoutes(): void {
        this.navigation.forEach((nav) => (nav.isRouteActive = false));
        this.navigation.forEach((nav) => (nav.isSubrouteActive = false));
        localStorage.removeItem('subroute_active');
        this.isActiveSubrouteIndex = -1;
        this.isActiveSubroute = false;
        this.activeSubrouteFleg = false;
    }

    public onActivateFooterRoute(type: boolean): void {
        if (type) {
            this.isActiveFooterRoute = true;
            this.disableRoutes();
        } else {
            this.isActiveFooterRoute = false;
        }
    }

    // public onHoveredRoutesContainer(type: boolean): void {
    //     if (type) {
    //         this.onActivateFooterRoute(false);
    //         this.isActiveMagicLine = true;
    //     } else {
    //         const index = this.navigation.findIndex(
    //             (item) => item.isRouteActive || item.isSubrouteActive
    //         );
    //         if (index === -1) {
    //             this.isActiveMagicLine = false;
    //         }
    //     }
    // }

    public onHoveredNavigation(type: boolean): void {
        if (type) {
            this.isNavigationHovered = true;
            this.DetailsDataService.updateLeftMenuStatus(true);
            const index = this.navigation.findIndex(
                (item) => item.isRouteActive || item.isSubrouteActive
            );
            if (index > -1) {
                this.closeDropdownOnNavClose = true;
                this.isActiveMagicLine = false;
            }
        } else {
            this.isNavigationHovered = false;
            this.isActiveMagicLine = true;
            this.DetailsDataService.updateLeftMenuStatus(false);
        }
    }

    public isActiveRouteOnReload(route: string): boolean {
        return this.router.url.includes(route);
    }

    public identity(index, item): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
