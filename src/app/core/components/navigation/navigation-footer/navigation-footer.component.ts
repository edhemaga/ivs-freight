import { Component, Input, OnInit } from '@angular/core';

interface FooterData {
  image: string;
  text: string | {};
}

@Component({
  selector: 'app-navigation-footer',
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.scss'],
})
export class NavigationFooterComponent implements OnInit {
  @Input() isNavigationHovered: boolean = false;

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online'

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

  constructor() {}

  ngOnInit(): void {}

  public checkIfUserTextData(text: any): boolean {
    if(text.hasOwnProperty('companyName')) {
      return true;
    }
    return false;
  }
}
