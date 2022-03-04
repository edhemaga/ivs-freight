import { NavigationSubRoutes } from './../model/navigation.model';
import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
})
export class NavigationRouteComponent {
  @Input() route: Navigation;
  @Input() isNavigationHovered: boolean = false;

  @Output() onRouteEvent = new EventEmitter<NavigationSubRoutes>();

  public isNavItemHovered: boolean = false;

  constructor(public router: Router) {}

  public onRouteAction() {
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route,
    });
  }

  public activateHeaderOfSubroutes() {
    if(this.route.name === 'List' && this.route.isRouteActive) {
      return true;
    }
    else if(this.route.name === 'Accounting' && this.route.isRouteActive) {
      return true;
    }
    else if(this.route.name === 'Safety' && this.route.isRouteActive) {
      return true;
    }
    else if(this.route.name === 'Tools' && this.route.isRouteActive) {
      return true;
    }
  }
}
