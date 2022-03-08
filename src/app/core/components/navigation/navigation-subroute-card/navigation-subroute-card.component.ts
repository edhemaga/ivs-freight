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
   * 28 - height of item
   * 2 - margin-top of item
   */
  public getDynamicHeight() {
    return this.isRouteActive && this.isNavigationHovered
      ? (this.contentHeight + 1) * 28 + (this.contentHeight * 2) + 6
      : 0;
  }


}
