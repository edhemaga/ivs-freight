import {
  Navigation,
  NavigationSubRoute,
  NavigationSubRoutes,
} from './../model/navigation.model';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-subroute',
  templateUrl: './navigation-subroute.component.html',
  styleUrls: ['./navigation-subroute.component.scss'],
})
export class NavigationSubrouteComponent {
  @Input() subroute: Navigation;
  @Output() onSubrouteActiveEvent = new EventEmitter<NavigationSubRoutes>();

  public isMagicLineActive: boolean = false;

  constructor(private router: Router) {}

  public onSubrouteAction(subroute: NavigationSubRoutes) {
    if (this.subroute.id === subroute.activeRouteFlegId) {
      localStorage.setItem('subroute_active', this.subroute.id.toString());
      this.onSubrouteActiveEvent.emit({
        routeId: this.subroute.id,
        routes: this.subroute.route,
        activeRouteFlegId: subroute.activeRouteFlegId,
      });
    }
  }

  public isActiveRouteOnReload(route: string): boolean {
    return this.router.url.includes(route);
  }

  public onHoverSubroteContainer(type: boolean) {
    this.isMagicLineActive = type;
  }

  public identifySubroute(index: number, item: NavigationSubRoute): string {
    return item.name;
  }
}
