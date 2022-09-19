import { Navigation, NavigationSubRoutes } from './model/navigation.model';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { navigationData } from './model/navigation-data';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from './services/navigation.service';
import { navigation_magic_line } from './navigation.animation';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [navigation_magic_line('showHideDetails')],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public navigation: Navigation[] = navigationData;

  public isNavigationHovered: boolean = false;

  public isModalPanelOpen: boolean = false;
  public isUserPanelOpen: boolean = false;
  public isUserCompanyDetailsOpen: boolean = false;

  private isActiveSubrouteIndex: number = -1;
  public isActiveSubroute: boolean = false;
  public activeSubrouteFleg: boolean = false;

  public isActiveFooterRoute: boolean = false;

  public isActiveMagicLine: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.navigationService.navigationDropdownActivation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        switch (data.name) {
          case 'Modal Panel': {
            if (data.type) {
              this.isModalPanelOpen = data.type;
              this.isUserPanelOpen = false;
              this.isUserCompanyDetailsOpen = false;
            } else {
              this.isModalPanelOpen = data.type;
            }
            break;
          }
          case 'User Panel': {
            if (data.type) {
              this.isModalPanelOpen = false;
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

  public onRouteEvent(subroute: NavigationSubRoutes): void {
    const index = this.navigation.findIndex(
      (item) => item.id === subroute.routeId
    );
    this.onActivateFooterRoute(false);
    this.isModalPanelOpen = false;
    this.isUserPanelOpen = false;
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
        this.navigation[this.isActiveSubrouteIndex].isSubrouteActive = false;
      }
      this.isActiveSubrouteIndex = index;
      this.navigation[index].isRouteActive = true;
    }
    this.isActiveFooterRoute = false;
  }

  private activationMainRoute(index: number): void {
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

  public onHoveredRoutesContainer(type: boolean): void {
    if (type) {
      this.onActivateFooterRoute(false);
      this.isActiveMagicLine = true;
    } else {
      const index = this.navigation.findIndex(
        (item) => item.isRouteActive || item.isSubrouteActive
      );
      if (index === -1) {
        this.isActiveMagicLine = false;
      }
    }
  }

  public onHoveredNavigation(type: boolean): void {
    if (type) {
      this.isNavigationHovered = true;

      const index = this.navigation.findIndex(
        (item) => item.isRouteActive || item.isSubrouteActive
      );
      if (index > -1) {
        this.isActiveMagicLine = true;
      }
    } else {
      this.isNavigationHovered = false;
      this.isActiveMagicLine = false;
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
