import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-navigation-user-company',
  templateUrl: './navigation-user-company.component.html',
  styleUrls: ['./navigation-user-company.component.scss'],
})
export class NavigationUserCompanyComponent {
  @Output() onUserCompanyDetailsClose = new EventEmitter<{
    type: boolean;
    name: string;
  }>();

  public userCompanyDummyData: {}[] = [
    {
      id: 1,
      name: 'IVS FREIGHT, INC',
      active: true,
    },
    {
      id: 2,
      name: 'KSKA FREIGHT CO.',
      active: false,
    },
    {
      id: 3,
      name: 'UBER FREIGHT CORP',
      active: false,
    },
    {
      id: 4,
      name: 'SOME COMPANY',
      active: false,
    },
  ];

  public onAction() {
    this.onUserCompanyDetailsClose.emit({
      type: false,
      name: 'User Company Details',
    });
  }
}
