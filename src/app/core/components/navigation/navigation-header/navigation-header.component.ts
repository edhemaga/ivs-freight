import { Component, Input } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent {
  @Input() isNavigationHovered: boolean = false;

  constructor(private navigationService: NavigationService) {}

  public onAction(type: string) {
    switch (type) {
      case 'Open Panel': {
        this.navigationService.onDropdownActivation({
          name: 'Modal Panel',
          type: true,
        });
        break;
      }
      case 'Search': {
        // TODO: search
        break;
      }
      case 'Notes': {
        // TODO: notes
        break;
      }
      case 'Bell': {
        // TODO: bell
        break;
      }
      default: {
        return;
      }
    }
  }
}
