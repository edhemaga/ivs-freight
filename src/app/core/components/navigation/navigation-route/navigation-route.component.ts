import { Observable } from 'rxjs';
import {
  NavigationSubRoute,
  NavigationSubRoutes,
} from './../model/navigation.model';
import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
})
export class NavigationRouteComponent {
  @Input() navRoute: Navigation;
  @Input() isNavigationHovered: boolean = false;
  @Input() isNavSubRouteActive: boolean = false;

  @Output() onSubRouteEvent = new EventEmitter<NavigationSubRoutes>();

  public isNavItemHovered: boolean = false;

  constructor(public router: Router) {}

  public onSubRouteAction() {
    if (this.navRoute.arrow) {
      this.isNavSubRouteActive = !this.isNavSubRouteActive;
      this.onSubRouteEvent.emit({
        routeId: this.navRoute.id,
        routes: this.navRoute.route,
      });
      return;
    }
  }

  public isActiveRoute(): boolean {
    if (this.navRoute.arrow) {
        return;
        // this.navRoute.id === this.activateSubRoute?.routeId;
    }
    return this.router.url.includes(this.navRoute.route);
  }

  public disableActivationOfSubrouteName(navRoute: Navigation): string {
    if (
      navRoute.name === 'List' ||
      navRoute.name === 'Accounting' ||
      navRoute.name === 'Safety' ||
      navRoute.name === 'Tools'
    ) {
      return null;
    }
    return navRoute.route;
  }
}
