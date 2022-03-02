import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent {
  @Input() isNavigationHovered: boolean = false;
  @Output() onModalPanelOpenEvent = new EventEmitter<boolean>();

  public onModalPanelOpen() {
    this.onModalPanelOpenEvent.emit(true);
  }
}
