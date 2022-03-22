import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-toollbar-card',
  templateUrl: './settings-toollbar-card.component.html',
  styleUrls: ['./settings-toollbar-card.component.scss'],
})
export class SettingsToollbarCardComponent {
  @Input() cardId: number;
  @Input() cardName: string;
  @Input() cardCount: number;
  @Input() cardSvg: boolean;
  @Input() cardBackground: boolean;
  @Input() route: string;

  
}
