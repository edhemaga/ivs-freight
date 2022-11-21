import { NavigationSubRoutes } from '../model/navigation.model';
import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  navigation_magic_line,
  navigation_route_animation,
} from '../navigation.animation';

@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
  animations: [
    navigation_route_animation('showHideDetails'),
    navigation_magic_line('magicLine'),
  ],
})
export class NavigationRouteComponent implements OnInit {
  @Input() route: Navigation;
  @Input() isNavigationHovered: boolean = false;
  @Input() isActiveSubroute: boolean = false;

  @Output() onRouteEvent = new EventEmitter<NavigationSubRoutes>();

  public isNavItemHovered: boolean = false;
  private timeout = null;

  constructor(public router: Router) {}

  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.isActiveRouteOnReload(window.location.pathname);
      clearTimeout(this.timeout);
    }, 1000);
  }

  public onRouteAction() {
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route,
      activeRouteFlegId: JSON.parse(localStorage.getItem('subroute_active')),
    });

    if (!Array.isArray(this.route.route)) {
      this.router.navigate([`${this.route.route}`]);
    }
  }

  public onReloadSubroute(flegId?: number) {
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route,
      activeRouteFlegId: flegId,
    });
  }

  private isActiveRouteOnReload(pathname: string) {
    const flegId = JSON.parse(localStorage.getItem('subroute_active'));

    if (flegId && this.route.id === flegId) {
      this.onReloadSubroute(flegId);
    }

    if (
      !Array.isArray(this.route.route) &&
      this.route.route.includes(pathname)
    ) {
      this.onRouteAction();
    }
  }

  public onNavItemHover(type: boolean) {
    if (type) {
      this.isNavItemHovered = !(
        [3, 4, 5, 6].includes(this.route.id) && this.route.isRouteActive
      );
    } else {
      this.isNavItemHovered = false;
    }
  }
}
