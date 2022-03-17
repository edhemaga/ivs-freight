import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss'],
})
export class SettingsCardComponent {
  @Input() cardName: string = null;
  @Input() cardCount: string = null;
  @Input() hasLine: boolean = true;
  
  public isCardOpen: boolean = false;

  public onAction() {
    this.isCardOpen = !this.isCardOpen;
  }
}
