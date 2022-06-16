import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-navigation-subroute-card',
  templateUrl: './navigation-subroute-card.component.html',
  styleUrls: ['./navigation-subroute-card.component.scss'],
})
export class NavigationSubrouteCardComponent {
  @Input() isNavigationCardActive: boolean = false;
  @Input() contentHeight: number = 0;

  /**
   *
   * 30 - height of item
   * 1 - header of subroutes
   */
  public getDynamicHeight() {
    console.log('IZVRSAVANJE');
    return this.isNavigationCardActive ? (this.contentHeight + 1) * 29 + 5 : 0;
  }
}
