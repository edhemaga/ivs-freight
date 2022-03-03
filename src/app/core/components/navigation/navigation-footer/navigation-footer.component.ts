import { Component, Input, EventEmitter, Output } from '@angular/core';

interface FooterData {
  image: string;
  text: string | {};
}

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

  public footerData: FooterData[] = [
    {
      image: 'assets/img/svgs/navigation/ic_info.svg',
      text: "What's New",
    },
    {
      image: 'assets/img/svgs/navigation/ic_settings.svg',
      text: 'Settings',
    },
    {
      image: 'assets/img/svgs/navigation/ic_profile_user.svg',
      text: {
        companyName: this.userCompany?.name,
        userName: this.currentUser?.firstName.concat(
          ' ',
          this.currentUser?.lastName
        ),
      },
    },
  ];

  public checkIfUserTextData(text: any): boolean {
    if (text.hasOwnProperty('companyName')) {
      return true;
    }
    return false;
  }

  public onUserPanelOpen(isUser: boolean) {
    if (isUser) {
      console.log(isUser)
      this.onUserPanelOpenEvent.emit(true);
    }
  }

  public identify(index: number, item: FooterData): string {
    return item.image;
  }
}
