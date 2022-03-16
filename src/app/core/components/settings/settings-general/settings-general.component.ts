import { Component } from '@angular/core';
import { SettingsStoreService } from '../state/settings.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss'],
})
export class SettingsGeneralComponent {
  public generalData = {
    logo: 'assets/img/svgs/settings-company/settings-companyLogo.svg',
    address: '5462 N East River Rd apt 611, Chicago, IL 60656, USA ',
    phone: '(123) 456-7890',
    fax: '(123) 456-7890',
    email: 'contact@windsor-brokers.com',
    webUrl: 'https://windsor-brokers.com',
    additionalDetails: [
      {
        id: 1,
        name: 'IFTA',
        value: 'IL47501062101',
      },
      {
        id: 2,
        name: 'IRP',
        value: '80100',
      },
      {
        id: 3,
        name: 'Toll',
        value: '30443331',
      },
      {
        id: 4,
        name: 'SCAC',
        value: 'FXPG',
      },
      {
        id: 5,
        name: 'Time Zone',
        value: 'UTC-8',
      },
      {
        id: 6,
        name: 'Currency',
        value: 'USD ($)',
      },
    ],
    bankAccount: [
      {
        id: 1,
        name: 'Bank Name',
        value:
          'assets/img/svgs/settings-company/settings-bankaccount-dummy.svg',
      },
      {
        id: 2,
        name: 'Routing',
        value: '052001633',
      },
      {
        id: 3,
        name: 'Account',
        value: '00000006213',
      },
    ],
    bankCard: [
      {
        id: 1,
        nickName: 'Main Card',
        cardNumber: '********1633',
        cardPicture: 'assets/img/svgs/settings-company/settings_visa.svg',
        cvc: '***',
        expiration: '04/24',
      },
      {
        id: 1,
        nickName: 'Do Not Use',
        cardNumber: '********5687',
        cardPicture: 'assets/img/svgs/settings-company/settings_visa2.svg',
        cvc: '***',
        expiration: '04/24',
      },
    ],
    loadFormat: [
      {
        id: 1,
        name: 'Load Format',
        value: 'TA XXX IVS',
      },
      {
        id: 2,
        name: 'Pref. Load Type',
        value: 'FTL',
      },
      {
        id: 3,
        name: 'Auto Invoicing',
        value: 'On',
      },
      {
        id: 4,
        name: 'Customer Pay Term',
        value: '30 days',
      },
      {
        id: 5,
        name: 'Customer Credit',
        value: '$60,000.00',
      },
      {
        id: 6,
        name: 'Factor by Default',
        value: 'On',
      },
    ],
    mvr: [
      {
        id: 1,
        name: 'MVR',
        value: '6 months',
      },
      {
        id: 2,
        name: 'Truck Inspection',
        value: '6 months',
      },
      {
        id: 3,
        name: 'Trailer Inspection',
        value: '6 months',
      },
    ],
  };

  // Bank Account
  public isAccountVisible: boolean = false;
  public accountText: string = null;

  // Bank Card
  public bankCardHeaders = ['Nickname', 'Card #', 'CVC', 'Exp.'];

  constructor(private settingsStoreService: SettingsStoreService) {}

  public onAction(modal: { modalName: string; type: boolean; action: string }) {
    this.settingsStoreService.modalSubject$.next(modal);
  }

  public hiddenText(value: any, numberOfCharacterToHide: number): string {
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
      this.accountText = this.hiddenText(value, 4);
      return;
    }

    this.accountText = value;
  }
}
