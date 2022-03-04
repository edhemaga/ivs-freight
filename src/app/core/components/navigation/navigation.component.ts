import { Navigation, NavigationSubRoutes } from './model/navigation.model';
import { Component } from '@angular/core';
import { navigationData } from './model/navigation-data';

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

  public activeRoute: number = -1;

  public onPanelEvent(isOpen: boolean, panel: string) {
    switch (panel) {
      case 'Modal Panel': {
        this.isModalPanelOpen = isOpen;
      }
      case 'User Panel': {
        this.isUserPanelOpen = isOpen;
      }
      default:
        return;
    }
  }

  public onRouteEvent(subroute: NavigationSubRoutes) {
    const index = this.navigation.findIndex(
      (item) => item.id === subroute.routeId
    );
    console.log("ROUTE EVENT")
    this.onActivateFooterRoute(false);

    if (subroute.routes.length) {
      if (index === this.activeRoute) {
        this.navigation[index].isRouteActive =
          !this.navigation[index].isRouteActive;
      }

      if (index !== this.activeRoute) {
        this.navigation.filter((nav) => (nav.isRouteActive = false));
        this.activeRoute = index;
        this.navigation[index].isRouteActive = true;
      }
    } else {
      if (index) {
        this.navigation.filter((nav) => (nav.isRouteActive = false));
        this.navigation[index].isRouteActive =
          !this.navigation[index].isRouteActive;
      }
    }
  }

  public onActivateFooterRoute(type: boolean) {
    if (type) {
      this.navigation.filter((nav) => (nav.isRouteActive = false));
    }
  }

  public identify(index, item): number {
    return item.id;
  }
}
