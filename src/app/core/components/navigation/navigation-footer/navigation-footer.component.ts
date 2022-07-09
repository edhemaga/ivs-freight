import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { navigation_route_animation } from '../navigation.animation';
import { SignInResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [navigation_route_animation('showHideDetails')],
})
export class NavigationFooterComponent implements OnInit, OnDestroy {
  @Input() isNavigationHovered: boolean = false;

  @Output() onActivateFooterRoutes = new EventEmitter<boolean>();

  public currentUserStatus: string = 'online';

  public footerData: FooterData[] = footerData;

  public loggedUser: SignInResponse = null;

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.isActiveFooterRouteOnReload(window.location.pathname);

    // this.communicatorUserDataService.chatUser
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((chatUser: any) => {
    //     setTimeout(() => {
    //       this.currentUserStatus = chatUser?.status;
    //     });
    //   });

    // ----------------------- PRODUCSTION MODE ----------------------------
    // if(this.authQuery.getEntity(1)) {
    //   const currentUser: SignInResponse = this.authQuery.getEntity(1);

    //   if (currentUser.token) {
    //     return true;
    //   }
    // }

    // ----------------------- DEVELOP MODE ----------------------------
    this.loggedUser = JSON.parse(localStorage.getItem('user'));

    this.footerData = [
      ...this.footerData,
      {
        id: 34,
        image: this.loggedUser?.avatar
          ? this.loggedUser.avatar
          : 'assets/svg/common/ic_profile.svg',
        text: {
          companyName: this.loggedUser.companyName,
          userName: this.loggedUser.firstName.concat(
            ' ',
            this.loggedUser.lastName
          ),
        },
      },
    ];
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

  ngOnDestroy(): void {}
}
