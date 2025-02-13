import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { filter, startWith, Subject, takeUntil } from 'rxjs';

// constants
import { NavigationDataConstants } from '@core/components/navigation/utils/constants/navigation-data.constants';

// services
import { NavigationService } from '@core/components/navigation/services/navigation.service';
import { navigationMagicLine } from '@core/components/navigation/animations/navigation.animation';
import { DetailsDataService } from '@shared/services/details-data.service';

// components
import { NavigationHeaderComponent } from '@core/components/navigation/components/navigation-header/navigation-header.component';
import { NavigationModalsComponent } from '@core/components/navigation/components/navigation-modals/navigation-modals.component';
import { NavigationUserProfileComponent } from '@core/components/navigation/components/navigation-user-profile/navigation-user-profile.component';
import { NavigationUserCompanyComponent } from '@core/components/navigation/components/navigation-user-company/navigation-user-company.component';
import { NavigationSubrouteCardComponent } from '@core/components/navigation/components/navigation-subroute-card/navigation-subroute-card.component';
import { NavigationRouteComponent } from '@core/components/navigation/components/navigation-route/navigation-route.component';
import { NavigationSubrouteComponent } from '@core/components/navigation/components/navigation-subroute/navigation-subroute.component';

// models
import {
    NavigationSubRoutes,
    Navigation,
} from '@core/components/navigation/models';

// enums
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [navigationMagicLine('showHideDetails')],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NavigationHeaderComponent,
        NavigationModalsComponent,
        NavigationUserProfileComponent,
        NavigationUserCompanyComponent,
        NavigationSubrouteCardComponent,
        NavigationRouteComponent,
        NavigationSubrouteComponent,
    ],
    host: {
        '(document:click)': 'closeNavbar($event)',
    },
})
export class NavigationComponent implements OnInit, OnDestroy {
    public navigation: Navigation[] = NavigationDataConstants.navigationData;

    public isNavigationHovered: boolean = false;
    public isNavigationOpenend: boolean = false;
    public isModalPanelOpen: boolean = false;
    public isUserPanelOpen: boolean = false;
    public isSettingsPanelOpen: boolean = false;
    public isUserCompanyDetailsOpen: boolean = false;
    private isActiveSubrouteIndex: number = -1;
    public isActiveSubroute: boolean = false;
    public activeSubrouteFleg: boolean = false;
    public middleIsHovered: boolean = false;
    public footerHovered: boolean = false;
    public isActiveFooterRoute: boolean = false;
    public routeInSettingsActive: boolean = false;
    public isActiveMagicLine: boolean = true;
    public hideMagicLine: boolean = false;
    public showHideLineIfSettingsActive: boolean = true;
    public footerRouteActive: boolean = true;
    private destroy$ = new Subject<void>();
    public subrouteContainerOpened: boolean = false;
    public index: number;
    public openedDropdown: boolean = false;
    public hideSubrouteTitle: number = -1;
    closeDropdownOnNavClose: boolean;
    @ViewChild('navbar') navbar: ElementRef;
    selectedRoute: string = '';
    selectedSubRoute: string = '';
    companiesExists: boolean;
    routeIndexSelected: boolean;
    subrouteClicked: boolean = false;
    dropdowns: boolean = false;

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private navigationService: NavigationService,
        private DetailsDataService: DetailsDataService
    ) {}
    hideSubrouteFromChild($event) {
        this.hideSubrouteTitle = $event;
    }
    ngOnInit(): void {
        this.navigationService.getValueNavHovered().subscribe((value) => {
            this.middleIsHovered = value;
        });
        this.navigationService.getValueFootHovered().subscribe((value) => {
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
                            this.subrouteClicked = false;
                            this.isNavigationHovered = true;
                        } else {
                            this.isNavigationHovered = true;
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
                            this.subrouteClicked = false;
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
                            this.subrouteClicked = false;
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
                            this.subrouteClicked = false;
                        } else {
                            this.isUserCompanyDetailsOpen = data.type;
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        //Detect changes in routes
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((url: any) => {
                let ruteName = url.url.split('/');
                if (!ruteName[2]) {
                    this.selectedSubRoute = null;
                }

                if (url.url === '/dispatcher') {
                    this.selectedRoute = 'Dispatch';
                    this.cdRef.detectChanges();
                } else if (url.url === '/file-manager') {
                    this.selectedRoute = 'File Manager';
                    this.cdRef.detectChanges();
                } else {
                    const ruteName = url.url.split('/');
                    if (ruteName[2]) {
                        if (ruteName[2] == 'sms') {
                            this.selectedSubRoute = 'SMS';
                            this.cdRef.detectChanges();
                        } else if (ruteName[2] == 'todo') {
                            this.selectedSubRoute = 'To-Do';
                            this.cdRef.detectChanges();
                        } else if (ruteName[2] == 'scheduled-insurance') {
                            this.selectedSubRoute = 'Scheduled Ins.';
                            this.cdRef.detectChanges();
                        } else if (ruteName[2] == 'mvr') {
                            this.selectedSubRoute = 'MVR';
                            this.cdRef.detectChanges();
                        } else if (ruteName[2] == 'mvr') {
                            this.selectedSubRoute = 'MVR';
                            this.cdRef.detectChanges();
                        } else if (ruteName[2] == 'pm') {
                            this.selectedSubRoute = 'PM';
                            this.cdRef.detectChanges();
                        } else if (ruteName[2] == 'ifta') {
                            this.selectedSubRoute = 'IFTA';
                            this.cdRef.detectChanges();
                        } else {
                            let t =
                                ruteName[2].charAt(0).toUpperCase() +
                                ruteName[2].substr(1).toLowerCase();
                            this.selectedSubRoute = t;
                            this.cdRef.detectChanges();
                        }
                    }
                    let t =
                        ruteName[1].charAt(0).toUpperCase() +
                        ruteName[1].substr(1).toLowerCase();
                    this.selectedRoute = t;
                    this.cdRef.detectChanges();
                }
            });
    }
    getIndex(ind) {
        this.index = ind;
    }
    routeWithSubRouteClicked(event) {
        this.subrouteClicked = event;
        if (this.isNavigationHovered == false) {
        }
    }
    oneUserCompany($event) {
        this.companiesExists = $event;
        this.cdRef.detectChanges();
    }
    routeIndex($event) {
        this.routeIndexSelected = $event;
        this.cdRef.detectChanges();
    }
    dropdownOpened(event) {
        this.openedDropdown = event;
    }
    isSubrouteContainerOpen(event) {
        this.subrouteContainerOpened = event;
        this.cdRef.detectChanges();
    }
    //Midle navigation hovered hide magic line in footer nav
    onMidleNavHover(event) {
        this.navigationService.setValueNavHovered(event);
    }
    public onFooterHover(event) {
        this.navigationService.setValueFootHovered(event);
    }
    public routeInSettingsActivated($event) {
        this.routeInSettingsActive = $event;
    }
    //On outside of navbar close navbar
    closeNavbar(event) {
        if (
            //If this elements keep open navigation
            event.target.parentElement?.classList.contains(
                'nav-header-top-logo'
            ) ||
            event.target.classList.contains('subroute') ||
            event.target.classList.contains('item-name') ||
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
            event.target.classList.contains('tooltip') ||
            event.target.classList.contains('panel-name') ||
            event.target.classList?.contains('user-profile') ||
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
                event.target.classList.contains('modal-item') ||
                event.target.classList.contains('tooltip-notifications') ||
                event.target.classList.contains('open-navigation') ||
                event.target.classList.contains('notification-svg ') ||
                event.target.classList.contains('item-settings') ||
                event.target.classList.contains('navigation-middle') ||
                event.target.classList.contains('navigation-top') ||
                event.target.classList.contains('navigation-bottom') ||
                event.target.classList.contains('subroutes-item') ||
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
                event.target.parentElement?.classList.contains(
                    EGeneralActions.CLOSE
                ) ||
                event.target.parentElement?.parentElement?.classList.contains(
                    EGeneralActions.CLOSE
                ) ||
                event.target.parentElement?.parentElement?.parentElement?.classList.contains(
                    EGeneralActions.CLOSE
                )
            ) {
                this.isUserCompanyDetailsOpen = false;
                this.closeDropdownOnNavClose = false;
                this.isUserPanelOpen = false;
                this.isActiveMagicLine = true;
                this.isModalPanelOpen = false;
                this.isActiveSubroute = false;
                this.openedDropdown = false;
                this.navigationService.onDropdownActivation({
                    name: 'Settings',
                    type: false,
                });
                return (this.isNavigationHovered = false);
            } else {
                this.isNavigationHovered = true;
            }
        } else {
            this.isUserCompanyDetailsOpen = false;
            this.closeDropdownOnNavClose = false;
            this.isUserPanelOpen = false;
            this.isActiveMagicLine = true;
            this.isModalPanelOpen = false;
            this.isActiveSubroute = false;
            this.isNavigationHovered = false;
            this.navigation.map((res) => {
                res.isRouteActive = false;
            });
            this.openedDropdown = false;
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
            // this.isActiveSubroute = true;
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
        if (route == '/dispatcher') {
            let t = 'Dispatch';
            return route === t;
        } else {
            let ruteName = this.router.url.split('/');
            let t =
                ruteName[1].charAt(0).toUpperCase() +
                ruteName[1].substr(1).toLowerCase();
            return route === t;
        }
    }

    public identity(index, item): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
