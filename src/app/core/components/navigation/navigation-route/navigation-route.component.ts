import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
})
export class NavigationRouteComponent {
  @Input() navRoute: Navigation;
  @Input() isNavigationHovered: boolean = false;

  @Output() routeEmitter = new EventEmitter<Navigation>();

  constructor(private router: Router) {}

  public onRouteEvent() {
    if (this.navRoute.arrow) {
      this.routeEmitter.emit(this.navRoute);
      return;
    }
    this.router.navigate([`${this.navRoute.route}`]);
  }
}
