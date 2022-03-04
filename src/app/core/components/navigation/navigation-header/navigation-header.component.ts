import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent {
  @Input() isNavigationHovered: boolean = false;
  @Output() onPanelOpenEvent = new EventEmitter<boolean>();

  public onAction(type: string) {
    switch (type) {
      case 'Open Panel': {
        this.onPanelOpenEvent.emit(true);
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
