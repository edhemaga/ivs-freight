import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss'],
})
export class SettingsCardComponent {
  @ViewChild('cardBody') cardBodyRef: ElementRef;
  @Input() cardTemplate: string = null;
  @Input() cardName: string = null;
  @Input() cardCount: string = null;
  @Input() cardStatus: string = null;
  @Input() hasLine: boolean = true;
  @Input() data: any;

  public isCardOpen: boolean = false;

  // Bank Account
  public isAccountVisible: boolean = false;
  public accountText: string = null;

  // Bank Card
  public bankCardHeaders = ['Nickname', 'Card #', 'CVC', 'Exp.'];

  public hiddenPassword(value: any, numberOfCharacterToHide: number): string {
    const lastFourCharaters = value.substring(
      value.length - numberOfCharacterToHide
    );
    let hiddenCharacter = '';

    for (let i = 0; i < numberOfCharacterToHide; i++) {
      hiddenCharacter += '*';
    }

    return hiddenCharacter + lastFourCharaters;
  }

  public showHideValue(value: string) {
    this.isAccountVisible = !this.isAccountVisible;
    if (this.isAccountVisible) {
      const timeout = setTimeout(() => {
        this.cardBodyRef.nativeElement.focus();
        clearTimeout(timeout);
      }, 250);
    }
    if (!this.isAccountVisible) {
      this.accountText = this.hiddenPassword(value, 4);
      return;
    }

    this.accountText = value;
  }
}
