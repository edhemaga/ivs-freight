import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-violation-card-view',
  templateUrl: './violation-card-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./violation-card-view.component.scss'],
})
export class ViolationCardViewComponent implements OnInit {
  @Input() public vilationCardData: any;
  @Input() public templateCard: boolean;
  public violationDropdown: any;
  public noteControl: FormControl = new FormControl();
  public dummyDataSpecial: any;
  public copiedBadgeNo: boolean;
  public copiedPhone: boolean;
  public copiedFax: boolean;
  constructor(private clipboar: Clipboard) {}

  ngOnInit(): void {
    this.dummyDataSpecial = [
      {
        id: 1,
        name: 'Alc/Cont. Sub. Check',
        checked: false,
      },
      {
        id: 2,
        name: 'Cond. by Local Juris.',
        checked: false,
      },
      {
        id: 3,
        name: 'Size & Weight Enf.',
        checked: true,
      },
      {
        id: 4,
        name: 'eScreen Inspection',
        checked: false,
      },
      {
        id: 5,
        name: 'Traffic Enforcement',
        checked: false,
      },
      {
        id: 6,
        name: 'PASA Cond. Insp.',
        checked: true,
      },
      {
        id: 7,
        name: 'Drug Interd. Search',
        checked: false,
      },
      {
        id: 8,
        name: 'Border Enf. Insp.',
        checked: false,
      },
      {
        id: 9,
        name: 'Post Crash Insp.',
        checked: false,
      },
      {
        id: 10,
        name: 'PBBT Inspection',
        checked: true,
      },
    ];

    this.noteControl.patchValue(
      'How to pursue pleasure rationally encounter consequences that are extremely painful.'
    );
    let names = [
      { id: 1, name: 'MS1017010339' },
      { id: 2, name: 'MS10120339' },
    ];
    this.violationDropdown = names.map((item) => {
      return {
        id: item.id,
        name: item.name,
        active: item.id === 1,
      };
    });
  }

  /* To copy any Text */
  public copyText(val: any, name: string) {
    switch (name) {
      case 'phone':
        this.copiedPhone = true;
        break;

      case 'badge':
        this.copiedBadgeNo = true;
        break;

      case 'fax':
        this.copiedFax = true;
        break;
    }

    this.clipboar.copy(val);
  }
}
