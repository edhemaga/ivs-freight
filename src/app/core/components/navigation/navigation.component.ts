import { Navigation,  NavigationSubRoutes } from './model/navigation.model';
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

  public identifySubRoute(index, item): number {
    return item.id;
  }

  public onPanelEvent(isOpen: boolean, panel: string) {
    if (panel === 'ModalPanel') {
      this.isModalPanelOpen = isOpen;
    } else {
      this.isUserPanelOpen = isOpen;
    }
  }

  public onActivateSubRoute(item: NavigationSubRoutes) {
    this.navigation.filter((nav) => (nav.isSubRouteActive = false));
    this.navigation.forEach( item => {
      if(item.id === item.id) {
        item.isSubRouteActive = item.isSubRouteActive
      }
      else {
        item.isSubRouteActive = false;
      }
    })
  }

  public onSubRouteEvent(subroute: NavigationSubRoutes) {
    let index = this.navigation.findIndex(
      (item) => item.id === subroute.routeId
    );

    if (index === this.activeRoute) {
      this.navigation[index].isSubRouteActive =
        !this.navigation[index].isSubRouteActive;
    }

    if (index !== this.activeRoute) {
      this.navigation.filter((nav) => (nav.isSubRouteActive = false));
      this.activeRoute = index;
      this.navigation[index].isSubRouteActive = true;
    }
  }
}
