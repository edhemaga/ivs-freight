import { Navigation } from './model/navigation.model';
import { Component } from '@angular/core';
import { navigationData } from './model/navigation-data';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public navigation: Navigation[] = navigationData;
  public isNavigationHovered: boolean = false;


  public onRouteEvent(navItem: Navigation) {
    
  }
}
