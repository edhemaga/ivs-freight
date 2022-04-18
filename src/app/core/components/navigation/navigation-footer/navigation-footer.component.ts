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

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public footerData: FooterData[] = footerData;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.footerData[2].text = {
      companyName: this.userCompany?.name,
      userName: this.currentUser?.firstName.concat(
        ' ',
        this.currentUser?.lastName
      ),
    };

    this.isActiveFooterRouteOnReload(window.location.pathname);

    // this.communicatorUserDataService.chatUser
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((chatUser: any) => {
    //     setTimeout(() => {
    //       this.currentUserStatus = chatUser?.status;
    //     });
    //   });
  }

  public isUserData(text: any): boolean {
    return text.hasOwnProperty('companyName');
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
