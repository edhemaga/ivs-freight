import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent {
  @Input() isNavigationHovered: boolean = false;
  @Output() onModalPanelOpenEvent = new EventEmitter<{type: boolean, name: string}>();

  public onAction(type: string) {
    switch (type) {
      case 'Open Panel': {
        this.onModalPanelOpenEvent.emit({type: true, name: 'Modal Panel'});
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
