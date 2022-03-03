import { Router } from '@angular/router';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
})
export class NavigationFooterComponent {
  @Input() isNavigationHovered: boolean = false;
  @Output() onUserPanelOpenEvent = new EventEmitter<boolean>();

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public footerData: FooterData[] = footerData;

  constructor(private router: Router) {
    this.footerData[2].text = {
      companyName: this.userCompany?.name,
      userName: this.currentUser?.firstName.concat(
        ' ',
        this.currentUser?.lastName
      ),
    };
  }

  public checkIfUserTextData(text: any): boolean {
    if (text.hasOwnProperty('companyName')) {
      return true;
    }
    return false;
  }

  public onUserPanelOpen(isUser: boolean) {
    if (isUser) {
      console.log(isUser);
      this.onUserPanelOpenEvent.emit(true);
    }
  }

  public identify(index: number, item: FooterData): string {
    return item.image;
  }

  public isActiveRoute(item: FooterData): boolean {
   
    return this.router.url.includes(item.route);
  }
}
