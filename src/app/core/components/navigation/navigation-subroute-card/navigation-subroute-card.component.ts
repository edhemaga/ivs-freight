import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-subroute-card',
  templateUrl: './navigation-subroute-card.component.html',
  styleUrls: ['./navigation-subroute-card.component.scss'],
})
export class NavigationSubrouteCardComponent {
  @Input() isRouteActive: boolean = false;
  @Input() isNavigationHovered: boolean = false;
  @Input() contentHeight: number = 0;

  /**
   *
   * 30 - height of item
   * 1 - header of subroutes
   */
  public getDynamicHeight() {
    return this.isRouteActive && this.isNavigationHovered
      ? (this.contentHeight + 1) * 29 + 4
      : 0;
  }
}
