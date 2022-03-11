import { Navigation, NavigationSubRoutes } from './model/navigation.model';
import { Component } from '@angular/core';
import { navigationData } from './model/navigation-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public navigation: Navigation[] = navigationData;

  public isNavigationHovered: boolean = false;
  public isModalPanelOpen: boolean = false;
  public isUserPanelOpen: boolean = false;

  private isActiveSubrouteIndex: number = -1;
  public isActiveSubroute: boolean = false;
  public activeSubrouteFleg: boolean = false;

  public isActiveFooterRoute: boolean = false;
  public isUserCompanyDetailsOpen: boolean = false;
  public isActiveMagicLine: boolean = false;

  constructor(private router: Router) {}

  public onPanelEvent(panel: { type: boolean; name: string }) {
    switch (panel.name) {
      case 'Modal Panel': {
        this.isModalPanelOpen = panel.type;
        break;
      }
      case 'User Panel': {
        this.isUserPanelOpen = panel.type;
        break;
      }
      case 'User Company Details': {
        this.isUserCompanyDetailsOpen = panel.type;
        break;
      }
      default:
        break;
    }
  }

  public onRouteEvent(subroute: NavigationSubRoutes) {
    const index = this.navigation.findIndex(
      (item) => item.id === subroute.routeId
    );
    this.onActivateFooterRoute(false);

    if (Array.isArray(subroute.routes)) {
      this.activationSubRoute(index, subroute);
    } else if (index > -1) {
      this.activationMainRoute(index);
    }
  }

  private activationSubRoute(index: number, subroute: NavigationSubRoutes) {
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

  private activationMainRoute(index: number) {
    this.disableRoutes();
    this.navigation[index].isRouteActive = true;
    this.isActiveFooterRoute = false;
  }

  private disableRoutes() {
    this.navigation.forEach((nav) => (nav.isRouteActive = false));
    this.navigation.forEach((nav) => (nav.isSubrouteActive = false));
    localStorage.removeItem('subroute_active');
    this.isActiveSubrouteIndex = -1;
    this.isActiveSubroute = false;
    this.activeSubrouteFleg = false;
  }

  public onActivateFooterRoute(type: boolean) {
    if (type) {
      this.isActiveFooterRoute = true;
      this.disableRoutes();
    } else {
      this.isActiveFooterRoute = false;
    }
  }

  public onHoveredRoutesContainer(type: boolean) {
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

  public onHoveredNavigation(type: boolean) {
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

  public identify(index, item): number {
    return item.id;
  }
}
