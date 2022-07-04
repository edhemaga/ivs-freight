import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { userNavigationData } from '../model/navigation-data';
import { NavigationUserPanel } from '../model/navigation.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { AuthStoreService } from '../../authentication/state/auth.service';

@Component({
  selector: 'app-navigation-user-profile',
  templateUrl: './navigation-user-profile.component.html',
  styleUrls: ['./navigation-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationUserProfileComponent implements OnInit, OnDestroy {
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;

  public userNavigationData: NavigationUserPanel[] = userNavigationData;

  public currentUserStatus: string = 'online';

  public isItemHovered: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthStoreService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {}

  public onUserPanelClose() {
    this.navigationService.onDropdownActivation({
      name: 'User Panel',
      type: false,
    });
  }

  public onAction(data: NavigationUserPanel) {
    switch (data.action) {
      case 'update': {
        break;
      }
      case 'status': {
        this.changeMyStatus();
        break;
      }
      case 'company': {
        this.navigationService.onDropdownActivation({
          name: 'User Company Details',
          type: true,
        });
        break;
      }
      case 'help': {
        break;
      }
      case 'logout': {
        localStorage.clear();
        this.authService.accountLogut();
        break;
      }
      default:
        return;
    }
  }

  public identity(index: number, item: NavigationUserPanel): number {
    return item.id;
  }

  private changeMyStatus() {}

  private get changeStatusOption() {
    return 'online';
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  ngOnDestroy(): void {}
}
