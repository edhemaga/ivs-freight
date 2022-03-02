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

  public onSubRouteEvent(subroute: Subroute) {
    let index = this.navigation.findIndex((item) => item.id === subroute.routeId);
    this.navigation[index].isSubRouteActive =
      !this.navigation[index].isSubRouteActive;
  }

  public identifySubRoute(index, item) {
    return item;
  }
}
