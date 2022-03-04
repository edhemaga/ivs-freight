import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { userNavigationData } from '../model/navigation-data';
import { NavigationUserPanel } from '../model/navigation.model';

@Component({
  selector: 'app-navigation-user-profile',
  templateUrl: './navigation-user-profile.component.html',
  styleUrls: ['./navigation-user-profile.component.scss'],
})
export class NavigationUserProfileComponent {
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;

  @Output() onUserPanelCloseEvent = new EventEmitter<boolean>();

  public userNavigationData: NavigationUserPanel[] = userNavigationData;

  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public isItemHovered: boolean = false;

  constructor(private authService: AuthService) {}

  public onUserPanelClose() {
    this.onUserPanelCloseEvent.emit(false);
  }

  public identify(index: number, item: NavigationUserPanel): number {
    return item.id;
  }

  public onAction(data: NavigationUserPanel) {
    switch (data.action) {
      case 'update': {
      }
      case 'status': {
      }
      case 'company': {
      }
      case 'help': {
      }
      case 'logout': {
        console.log('logout');
        this.authService.logout();
      }
    }
  }
}
