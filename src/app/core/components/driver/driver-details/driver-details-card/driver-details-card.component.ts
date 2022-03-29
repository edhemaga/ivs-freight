import { Component, Input, OnInit } from '@angular/core';
import { settings_card_animation } from './settings-card.animation';

@Component({
  selector: 'app-driver-details-card',
  templateUrl: './driver-details-card.component.html',
  styleUrls: ['./driver-details-card.component.scss'],
  animations: [settings_card_animation('openCloseBodyCard')]
})
export class DriverDetailsCardComponent implements OnInit {

  @Input() cardTemplate: string = null;
  @Input() cardName: string = null;
  @Input() cardCount: string = null;
  @Input() cardImg: boolean = false;
  @Input() data: any = null;
  @Input() hasLine: boolean = true; 

  public isCardOpen: boolean = true;

  public isAccountVisible: boolean = false;
  public accountText: string = null;

  constructor() { }

  ngOnInit() {
  }

  public onCardOpen() {
    this.isCardOpen = !this.isCardOpen;
  }

  public hiddenPassword(value: any, numberOfCharacterToHide: number): string {
    const lastFourCharaters = value.substring(
      value.length - numberOfCharacterToHide
    );
    let hiddenCharacter = '';

    for (let i = 0; i < numberOfCharacterToHide; i++) {
      hiddenCharacter += "*";
    }
    return hiddenCharacter + lastFourCharaters;
  }

  public showHideValue(value: string) {
    this.isAccountVisible = !this.isAccountVisible;
    
    if (!this.isAccountVisible) {
      this.accountText = this.hiddenPassword(value, 4);
      return;
    }
    this.accountText = value;
  }

}
