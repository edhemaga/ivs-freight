import { Navigation } from './model/navigation.model';
import { Component } from '@angular/core';
import { navigationData } from './model/navigation-data';

interface Subroute {
  routeId: number;
  routes: [];
}
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

  public onSubRouteEvent(subroute: Subroute) {
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

  public identifySubRoute(index, item) {
    return item;
  }

  public onPanelEvent(isOpen: boolean, panel: string) {
    if (panel === 'ModalPanel') {
      this.isModalPanelOpen = isOpen;
    } else {
      this.isUserPanelOpen = isOpen;
    }
  }
}
