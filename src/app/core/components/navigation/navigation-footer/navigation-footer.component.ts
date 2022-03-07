import { Router } from '@angular/router';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
})
export class NavigationFooterComponent implements OnInit {
  @Input() isNavigationHovered: boolean = false;
  @Output() onUserPanelOpenEvent = new EventEmitter<{type: boolean, name: string}>();
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
  }

  public isUserData(text: any): boolean {
    if (text.hasOwnProperty('companyName')) {
      return true;
    }
    return false;
  }

  public onAction(index: number, action: string) {
    switch (action) {
      case 'Open User Panel': {
        if (index === 2) {
          this.onUserPanelOpenEvent.emit({type: true, name: 'User Panel'});
        } else {
          this.isActiveRoute(this.footerData[index])
          this.onActivateFooterRoutes.emit(true);
        }
      }
      default: {
        return;
      }
    }
  }

  public isActiveRoute(item: FooterData): boolean {
    if(item.id !== 3) {
      return this.router.url.includes(item.route);
    }
  }

  public identify(index: number, item: FooterData): number {
    return item.id;
  }

  
}
