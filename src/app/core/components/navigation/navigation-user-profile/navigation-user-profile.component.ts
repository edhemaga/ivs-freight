import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from 'src/app/core/services/auth/auth.service';
import {userNavigationData} from '../model/navigation-data';
import {NavigationUserPanel} from '../model/navigation.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-user-profile',
  templateUrl: './navigation-user-profile.component.html',
  styleUrls: ['./navigation-user-profile.component.scss'],
})
export class NavigationUserProfileComponent {
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;

  @Output() onUserPanelCloseEvent = new EventEmitter<{ type: boolean, name: string }>();

  public userNavigationData: NavigationUserPanel[] = userNavigationData;

  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public isItemHovered: boolean = false;

  constructor(private authService: AuthService, public router: Router) {
  }

  public onUserPanelClose() {
    this.onUserPanelCloseEvent.emit({type: false, name: 'User Panel'});
  }

  public onAction(data: NavigationUserPanel) {
    switch (data.action) {
      case 'update': {
      }
        break;
      case 'status': {
      }
        break;

      case 'company': {
      }
        break;

      case 'help': {
      }
        break;

      case 'logout': {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
        break;
      default:
        return;
    }
  }

  public identify(index: number, item: NavigationUserPanel): number {
    return item.id;
  }

}
