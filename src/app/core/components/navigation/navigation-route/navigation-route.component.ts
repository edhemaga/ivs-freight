import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Subroute {
  routeId: number;
  routes: [];
}
@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
})
export class NavigationRouteComponent {
  @Input() navRoute: Navigation;
  @Input() isNavigationHovered: boolean = false;

  @Output() onSubRouteEvent = new EventEmitter<Subroute>();

  constructor(private router: Router) {}

  public onRouteEvent() {
    if (this.navRoute.arrow) {
      this.onSubRouteEvent.emit({
        routeId: this.navRoute.id,
        routes: this.navRoute.route,
      });
      return;
    }
    this.router.navigate([`${this.navRoute.route}`]);
  }
}
