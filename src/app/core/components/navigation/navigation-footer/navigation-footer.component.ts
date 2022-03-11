import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator/communicator-user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
})
export class NavigationFooterComponent implements OnInit, OnDestroy {
  @Input() isNavigationHovered: boolean = false;
  @Output() onUserPanelOpenEvent = new EventEmitter<{
    type: boolean;
    name: string;
  }>();
  @Output() onActivateFooterRoutes = new EventEmitter<boolean>();

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public footerData: FooterData[] = footerData;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private communicatorUserDataService: CommunicatorUserDataService
  ) {}

  ngOnInit() {
    this.footerData[2].text = {
      companyName: this.userCompany?.name,
      userName: this.currentUser?.firstName.concat(
        ' ',
        this.currentUser?.lastName
      ),
    };

    this.isActiveFooterRouteOnReload(window.location.href);

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
          this.onUserPanelOpenEvent.emit({ type: true, name: 'User Panel' });
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

  private isActiveFooterRouteOnReload(url: string) {
    const urlString = url.split('/');
    const reloadUrl =
      urlString[urlString.length - 2] + '/' + urlString[urlString.length - 1];

    const index = this.footerData.findIndex((item) =>
      item.route?.includes(reloadUrl)
    );

    if (index > -1) {
      this.router.navigate([`/${reloadUrl}`]);
      this.onActivateFooterRoutes.emit(true);
    } else {
      this.onActivateFooterRoutes.emit(false);
    }
  }

  public identify(index: number, item: FooterData): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
