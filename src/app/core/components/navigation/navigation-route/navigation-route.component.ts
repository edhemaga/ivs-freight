import { NavigationSubRoutes } from './../model/navigation.model';
import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
})
export class NavigationRouteComponent {
  @Input() route: Navigation;
  @Input() isNavigationHovered: boolean = false;
  @Input() isActiveSubroute: boolean = false;

  @Output() onRouteEvent = new EventEmitter<NavigationSubRoutes>();

  public isNavItemHovered: boolean = false;

  constructor(public router: Router) {}

  public onRouteAction() {
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route,
    });
  }

  public checkIfSubroute(route: Navigation) {
    if (Array.isArray(route.route)) {
      if (route.isRouteActive) {
        return this.router.url;
      }
      return null;
    } else {
      return this.route.route;
    }
  }

  public isActiveRouteOnReload(): boolean {
    if (this.route.arrow) {
      return ;
    }
    return this.router.url.includes(this.route.route);
  }
}
