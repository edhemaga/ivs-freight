import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-subroute-card',
  templateUrl: './navigation-subroute-card.component.html',
  styleUrls: ['./navigation-subroute-card.component.scss'],
})
export class NavigationSubrouteCardComponent {
  @Input() isSubRouteActive: boolean = false;
  @Input() isNavigationHovered: boolean = false;
  @Input() contentHeight: number = 0;
 

  public getDynamicHeight() {
    return this.isSubRouteActive && this.isNavigationHovered
      ? (this.contentHeight + 1) * 28 + 8
      : 0;
  }


}
