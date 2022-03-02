import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-subroute-card',
  templateUrl: './navigation-card.component.html',
  styleUrls: ['./navigation-card.component.scss'],
})
export class NavigationSubrouteCardComponent {
  @Input() isSubRouteActive: boolean = false;
  @Input() isNavigationHovered: boolean = false;
}
