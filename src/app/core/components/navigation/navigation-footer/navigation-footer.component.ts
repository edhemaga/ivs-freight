import { Router } from '@angular/router';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
})
export class NavigationFooterComponent implements OnInit {
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.footerData[2].text = {
      companyName: this.userCompany?.name,
      userName: this.currentUser?.firstName.concat(
        ' ',
        this.currentUser?.lastName
      ),
    };
    this.isActiveFooterRouteOnReload(window.location.href);
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
    const reloadUrl = urlString[urlString.length - 1];

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
}
