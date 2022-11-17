import { Component, Input } from '@angular/core';
import { settings_card_animation } from '../settings-animation/settings-card.animation';

@Component({
    selector: 'app-settings-card',
    templateUrl: './settings-card.component.html',
    styleUrls: ['./settings-card.component.scss'],
    animations: [settings_card_animation('openCloseBodyCard')],
})
export class SettingsCardComponent {
    @Input() cardTemplate: string = null;
    @Input() cardName: string = null;
    @Input() cardCount: string = null;
    @Input() cardStatus: string = null;
    @Input() hasLine: boolean = true;
    @Input() hasCard: boolean = true;
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

        if (!this.isAccountVisible) {
            this.accountText = this.hiddenPassword(value, 4);
            return;
        }
        this.accountText = value;
    }

    public onCardOpen() {
        if (this.data?.name !== 'Fuel Station') {
            this.isCardOpen = !this.isCardOpen;
        }
    }

    public identity(index: number, item: any): number {
        return item.id;
    }
}
