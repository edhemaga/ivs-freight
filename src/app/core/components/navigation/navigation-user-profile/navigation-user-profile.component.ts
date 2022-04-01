import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
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
import { NavigationService } from '../services/navigation.service';
import { PersistState } from '@datorama/akita';

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

  public currentUser: {} = JSON.parse(localStorage.getItem('currentUser'));
  public userCompany: {} = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public isItemHovered: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private customModalService: CustomModalService,
    private sharedService: SharedService,
    private navigationService: NavigationService,
    @Inject('persistStorage') private persistStorage: PersistState
  ) {}

  ngOnInit() {
    // this.communicatorUserDataService.chatUser
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((chatUser: any) => {
    //     setTimeout(() => {
    //       this.currentUserStatus = chatUser?.status;
    //     });
    //   });
  }

  public onUserPanelClose() {
    this.navigationService.onDropdownActivation({
      name: 'User Panel',
      type: false,
    });
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
        this.persistStorage.clearStore();
        this.persistStorage.destroy();
        this.authService.logout();
        this.router.navigate(['/login']);
        break;
      }
      default:
        return;
    }
  }

  public identity(index: number, item: NavigationUserPanel): number {
    return item.id;
  }

  private changeMyStatus() {
    // this.communicatorUserService.changeMyStatus(this.changeStatusOption);
  }

  private get changeStatusOption() {
    // if (
    //   ['online', 'active', 'away'].includes(
    //     this.communicatorUserService.user?.status
    //   )
    // ) {
    //   return 'busy';
    // } else {
    //   if (this.isUserInChat()) {
    //     return 'active';
    //   } else {
    //     return 'online';
    //   }
    // }
    return 'online'
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
