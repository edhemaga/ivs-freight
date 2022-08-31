import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { navigation_route_animation } from '../navigation.animation';
import { TaUserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [navigation_route_animation('showHideDetails')],
})
export class NavigationFooterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() isNavigationHovered: boolean = false;

  @Output() onActivateFooterRoutes = new EventEmitter<boolean>();

  public currentUserStatus: string = 'online';

  public footerData: FooterData[] = footerData;

  public loggedUser: any = null;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private imageBase64Service: ImageBase64Service,
    private userService: TaUserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isActiveFooterRouteOnReload(window.location.pathname);

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
        : 'assets/svg/common/ic_profile.svg',
    };

    this.footerData[2] = {
      id: this.loggedUser.userId,
      image: this.loggedUser.avatar,
      text: {
        companyName: this.loggedUser.companyName,
        userName: this.loggedUser.firstName.concat(
          ' ',
          this.loggedUser.lastName
        ),
      },
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

          this.footerData[2] = {
            id: this.loggedUser.userId,
            image: this.loggedUser.avatar,
            text: {
              companyName: this.loggedUser.companyName,
              userName: this.loggedUser.firstName.concat(
                ' ',
                this.loggedUser.lastName
              ),
            },
          };

          this.cdRef.detectChanges();
        }
      });
  }

  public onAction(index: number, action: string) {
    switch (action) {
      case 'Open User Panel': {
        if (index === 2) {
          this.navigationService.onDropdownActivation({
            name: 'User Panel',
            type: true,
          });
        } else {
          this.isActiveFooterRoute(this.footerData[index]);
          localStorage.removeItem('subroute_active');
          this.onActivateFooterRoutes.emit(true);
        }
      }
      default: {
        return;
      }
    }
  }

  public isActiveFooterRoute(item: FooterData): boolean {
    if (item.id !== 3) {
      return this.router.url.includes(item.route);
    }
  }

  private isActiveFooterRouteOnReload(pathname: string) {
    const timeout = setTimeout(() => {
      const hasSettingsInRoute = pathname.includes('settings');

      if (hasSettingsInRoute) {
        this.router.navigate([`/${pathname}`]);
        this.onActivateFooterRoutes.emit(true);
      } else {
        this.onActivateFooterRoutes.emit(false);
      }
      clearTimeout(timeout);
    }, 50);
  }

  public identity(index: number, item: FooterData): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
