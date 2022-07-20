import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-settings-insurancepolicy',
  templateUrl: './settings-insurancepolicy.component.html',
  styleUrls: ['./settings-insurancepolicy.component.scss'],
})
export class SettingsInsurancepolicyComponent implements OnInit, OnChanges {
  public insuranceData = {
    phone: '(123) 456-7890',
    email: 'peraperic@gmail.com',
    address: '5462 N East River Rd apt 611,Chicago, IL 60656, USA',

    generalLiability: {
      insurerName: 'LLOYDS OF LONDON',
      rating: 'A++',
      numberOfPolicy: 'WGL000695-00',
      fields: [
        {
          id: 1,
          name: 'Each Occurrence',
          value: '$1,000.000',
        },
        {
          id: 2,
          name: 'Dmg. to Rented Pr.',
          value: '$2,000.000',
        },
        {
          id: 3,
          name: 'Medical Expiration',
          value: '$500.000',
        },
        {
          id: 4,
          name: 'Pers. and Adv. Injury',
          value: '$100.000',
        },
        {
          id: 5,
          name: 'General Aggregate',
          value: '$300.000',
        },
        {
          id: 6,
          name: 'Products - Comp / OP',
          value: '$800.000',
        },
      ],
    },
    automobileLiability: {
      insurerName: 'UNIQUE INSURANCE CO',
      rating: '',
      numberOfPolicy: 'KBG5675678-01',
      fields: [
        {
          id: 1,
          name: 'Combined Single',
          value: '$1,000.000',
        },
        {
          id: 2,
          name: 'Combined Single',
          value: '$2,000.000',
        },
        {
          id: 3,
          name: 'Boldly Injury (Person)',
          value: '$100.000',
        },
        {
          id: 4,
          name: 'Boldly Injury (Accident)',
          value: '$100.000',
        },
      ],
    },
    motorTruckCargo: {
      insurerName: 'Unique Insurance Co',
      rating: 'NR',
      numberOfPolicy: 'KBG5675678-01',
      fields: [
        {
          id: 1,
          name: 'Single Conveyance',
          value: '$100.000',
        },
        {
          id: 2,
          name: 'Deductable',
          value: '$300.000',
        },
      ],
    },
    physicalDamage: {
      insurerName: 'Unique Insurance Co',
      rating: 'NR',
      numberOfPolicy: 'KBG5675678-01',
      fields: [
        {
          id: 1,
          name: 'Comprehensive & Collision',
          value: '$100.000',
        },
        {
          id: 2,
          name: 'Deductable',
          value: '$300.000',
        },
      ],
    },
    trailerInterchange: {
      insurerName: 'Unique Insurance Co',
      rating: 'NR',
      numberOfPolicy: 'KBG5675678-01',
      fields: [
        {
          id: 1,
          name: 'Value',
          value: '$100.000',
        },
      ],
    },
  };
  @Input() public insurancePolicyData: any;
  public copyPolicyName: boolean[] = [];
  public copyInsurancePhone: boolean;
  public copyInsuranceEmail: boolean;
  constructor(
    private settingsStoreService: SettingsStoreService,
    private clipboar: Clipboard
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}
  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  /* To copy any Text */
  public copyText(val: any, index: number) {
    this.copyPolicyName[index] = true;
    this.clipboar.copy(val);
  }

  /* To copy any Text */
  public copyTextWhitoutIndex(val: any, name: string) {
    switch (name) {
      case 'phone':
        this.copyInsurancePhone = true;
        break;
      case 'email':
        this.copyInsuranceEmail = true;
        break;
    }

    this.clipboar.copy(val);
  }
  public onShowDetails() {}
}
