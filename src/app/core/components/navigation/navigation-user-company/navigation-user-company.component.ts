import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-navigation-user-company',
  templateUrl: './navigation-user-company.component.html',
  styleUrls: ['./navigation-user-company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationUserCompanyComponent {
  @Input() isNavigationHoveredAndPanelOpen: boolean = false;

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

  constructor(private navigationService: NavigationService) {}

  public onAction() {
    this.navigationService.onDropdownActivation({
      name: 'User Company Details',
      type: false,
    });
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
}
