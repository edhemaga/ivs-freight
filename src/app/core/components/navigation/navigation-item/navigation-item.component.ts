import { Navigation } from './../model/navigation.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.scss'],
})
export class NavigationItemComponent {
  @Input() navItem: Navigation;
  @Input() isNavigationHovered: boolean = false;
}
