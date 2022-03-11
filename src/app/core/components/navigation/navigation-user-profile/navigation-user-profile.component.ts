import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { userNavigationData } from '../model/navigation-data';
import { NavigationUserPanel } from '../model/navigation.model';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangePasswordComponent } from '../../authentication/change-password/change-password.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { CommunicatorUserService } from 'src/app/core/services/communicator/communicator-user.service';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator/communicator-user-data.service';

@Component({
  selector: 'app-navigation-user-profile',
  templateUrl: './navigation-user-profile.component.html',
  styleUrls: ['./navigation-user-profile.component.scss'],
})
export class NavigationUserProfileComponent implements OnInit, OnDestroy {
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;

  @Output() onUserPanelCloseEvent: EventEmitter<{}> = new EventEmitter<{
    type: boolean;
    name: string;
  }>();

  @Output() onUserCompanyDetailsOpen = new EventEmitter<{
    type: boolean;
    name: string;
  }>();

  public userNavigationData: NavigationUserPanel[] = userNavigationData;

  public currentUser: {} = JSON.parse(localStorage.getItem('currentUser'));
  public userCompany: {} = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = null;

  public isItemHovered: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private customModalService: CustomModalService,
    private sharedService: SharedService,
    private communicatorUserService: CommunicatorUserService,
    private communicatorUserDataService: CommunicatorUserDataService
  ) {}

  ngOnInit() {
    this.communicatorUserDataService.chatUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((chatUser: any) => {
        setTimeout(() => {
          this.currentUserStatus = chatUser?.status;
        });
      });
  }

  public onUserPanelClose() {
    this.onUserPanelCloseEvent.emit({ type: false, name: 'User Panel' });
  }

  public onAction(data: NavigationUserPanel) {
    switch (data.action) {
      case 'update': {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.userService
          .getUserByUsername(currentUser.username)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (user: any) => {
              this.customModalService.openModal(
                ChangePasswordComponent,
                user,
                null,
                {
                  size: 'small',
                }
              );
            },
            (error: any) => {
              error ? this.sharedService.handleServerError() : null;
            }
          );
        break;
      }
      case 'status': {
        this.changeMyStatus();
        break;
      }
      case 'company': {
        this.onUserCompanyDetailsOpen.emit({
          type: true,
          name: 'User Company Details',
        });
        break;
      }
      case 'help': {
        break;
      }
      case 'logout': {
        this.authService.logout();
        this.router.navigate(['/login']);
        break;
      }
      default:
        return;
    }
  }

  public identify(index: number, item: NavigationUserPanel): number {
    return item.id;
  }

  private changeMyStatus() {
    this.communicatorUserService.changeMyStatus(this.changeStatusOption);
  }

  private get changeStatusOption() {
    if (
      ['online', 'active', 'away'].includes(
        this.communicatorUserService.user?.status
      )
    ) {
      return 'busy';
    } else {
      if (this.isUserInChat()) {
        return 'active';
      } else {
        return 'online';
      }
    }
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
