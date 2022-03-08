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

  public isActiveFooterRoute: boolean = false;
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
      console.log('FROM SUBROUTING NAV', subroute);
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
        this.navigation[index].isRouteActive = true;
      }

      if (!this.navigation[index].isRouteActive) {
        this.isActiveSubroute = false;
      } else {
        this.isActiveSubroute = true;
      }
    }

    if (index !== this.isActiveSubrouteIndex) {
      this.navigation.forEach((nav) => (nav.isRouteActive = false));
      this.isActiveSubroute = true;
      this.isActiveSubrouteIndex = index;
      this.navigation[index].isRouteActive = true;
      console.log(this.navigation[index]);
    }
    console.log(this.navigation[index]);
  }

  private activationMainRoute(index: number) {
    this.disableRoutes();
    this.navigation[index].isRouteActive = true;
  }

  private disableRoutes() {
    this.navigation.forEach((nav) => (nav.isRouteActive = false));
    this.isActiveSubrouteIndex = -1;
    this.isActiveSubroute = false;
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
    } else if (this.isActiveFooterRoute) {
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
