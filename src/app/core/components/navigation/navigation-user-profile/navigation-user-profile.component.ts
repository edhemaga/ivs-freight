import { ImageBase64Service } from './../../../utils/base64.image';
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
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { AuthStoreService } from '../../authentication/state/auth.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ProfileUpdateModalComponent } from '../../modals/profile-update-modal/profile-update-modal.component';
import { TaUserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-navigation-user-profile',
  templateUrl: './navigation-user-profile.component.html',
  styleUrls: ['./navigation-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationUserProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;

  public userNavigationData: NavigationUserPanel[] = userNavigationData;
  public currentUserStatus: string = 'online';
  public isItemHovered: boolean = false;

  public loggedUser: any = null;

  constructor(
    public router: Router,
    private authService: AuthStoreService,
    private navigationService: NavigationService,
    private modalService: ModalService,
    private userService: TaUserService,
    private imageBase64Service: ImageBase64Service
  ) {}

  ngOnInit() {
    // ----------------------- PRODUCSTION MODE ----------------------------
    // if(this.authQuery.getEntity(1)) {
    //   const currentUser: SignInResponse = this.authQuery.getEntity(1);

    //   if (currentUser.token) {
    //     return true;
    //   }
    // }

    // ----------------------- DEVELOP MODE ----------------------------
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    this.loggedUser = {
      ...this.loggedUser,
      avatar: this.loggedUser.avatar
        ? this.imageBase64Service.sanitizer(this.loggedUser.avatar)
        : null,
    };

    this.userService.updateUserProfile$
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        if (val) {
          this.loggedUser = JSON.parse(localStorage.getItem('user'));

          this.loggedUser = {
            ...this.loggedUser,
            avatar: this.loggedUser.avatar
              ? this.imageBase64Service.sanitizer(this.loggedUser.avatar)
              : 'assets/svg/common/ic_profile.svg',
          };
        }
      });
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
        this.modalService.openModal(ProfileUpdateModalComponent, {
          size: 'medium',
        });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
