import { Component, ViewChild } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss'],
})
export class SettingsGeneralComponent {
  public companyBasicMiddleData = [
    {
      id: 1,
      name: 'Address',
      svg: 'assets/img/svgs/settings-company/settings-address.svg',
      value: '5462 N East River Rd apt 611, Chicago, IL 60656, USA',
    },
    {
      id: 2,
      name: 'Phone',
      svg: 'assets/img/svgs/settings-company/settings-phone.svg',
      value: '(123) 456-7890',
    },
    {
      id: 3,
      name: 'Email',
      svg: 'assets/img/svgs/settings-company/settings-email.svg',
      value: 'contact@windsor-brokers.com',
    },
    {
      id: 4,
      name: 'Fax',
      svg: 'assets/img/svgs/settings-company/settings-fax.svg',
      value: '(123) 456-7890',
    },
    {
      id: 5,
      name: 'webUrl',
      svg: 'assets/img/svgs/settings-company/settings-webUrl.svg',
      value: 'https://windsor-brokers.com',
    },
  ];

  public companyBasicBottomData = [
    {
      id: 1,
      name: 'USDOT',
      value: '2797832',
    },
    {
      id: 2,
      name: 'EIN',
      value: '47-5010621',
    },
    {
      id: 3,
      name: 'MC',
      value: '934185',
    },
  ];

  public generalData = {
    logo: 'assets/img/svgs/settings-company/settings-companyLogo.svg',

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

  constructor(private settingsStoreService: SettingsStoreService) {}

  public onAction(modal: { modalName: string; type: boolean; action: string }) {
    this.settingsStoreService.onModalAction(modal.type, modal.modalName, modal.action);
  }
}
