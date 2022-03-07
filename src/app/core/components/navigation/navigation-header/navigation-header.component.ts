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
      }
      case 'Search': {
        // TODO: search
      }
      case 'Notes': {
        // TODO: notes
      }
      case 'Bell': {
        // TODO: bell
      }
      default: {
        return;
      }
    }
  }
}
