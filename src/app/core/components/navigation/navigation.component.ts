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

  constructor(private router: Router) {}

  public onPanelEvent(panel: {type: boolean, name: string}) {
    console.log(panel)
    switch (panel.name) {
      case 'Modal Panel': {
        this.isModalPanelOpen = panel.type;
      }
      case 'User Panel': {
        this.isUserPanelOpen = panel.type;
      }
      default:
        return;
    }
  }

  public onRouteEvent(subroute: NavigationSubRoutes) {
    const index = this.navigation.findIndex(
      (item) => item.id === subroute.routeId
    );
    
    this.onActivateFooterRoute(false);

    if (Array.isArray(subroute.routes)) {
      if (index === this.isActiveSubrouteIndex) {
        this.navigation[index].isRouteActive =
          !this.navigation[index].isRouteActive;

          if(!this.navigation[index].isRouteActive) {
            this.isActiveSubroute = false;
          }
          else {
            this.isActiveSubroute = true;
          }
      }

      if (index !== this.isActiveSubrouteIndex) {
        this.navigation.forEach((nav) => (nav.isRouteActive = false));
        this.isActiveSubroute = true;
        this.isActiveSubrouteIndex = index;
        this.navigation[index].isRouteActive = true;
      }
    } else {
      if (index > -1) {
        this.navigation.forEach((nav) => (nav.isRouteActive = false));
        this.isActiveSubroute = false;
        this.isActiveSubrouteIndex = -1;
        this.navigation[index].isRouteActive = true;
      }
    }
  }

  public onActivateFooterRoute(type: boolean) {
    if (type) {
      this.isActiveSubrouteIndex = -1;
      this.isActiveSubroute = false;
      this.isActiveFooterRoute = true;
      this.navigation.filter((nav) => (nav.isRouteActive = false));
    }
    else {
      this.isActiveFooterRoute = false;
    }
  }

  public identify(index, item): number {
    return item.id;
  }

  public isActiveRouteOnReload(route: string): boolean {
    return this.router.url.includes(route);
  }
}
