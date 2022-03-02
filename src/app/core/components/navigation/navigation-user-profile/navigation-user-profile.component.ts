import { Component, Input, Output, EventEmitter } from '@angular/core';
import { userNavigationData } from '../model/navigation-data';
import { NavigationUserPanel } from '../model/navigation.model';

@Component({
  selector: 'app-navigation-user-profile',
  templateUrl: './navigation-user-profile.component.html',
  styleUrls: ['./navigation-user-profile.component.scss'],
})
export class NavigationUserProfileComponent {
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;

  @Output() onUserPanelCloseEvent = new EventEmitter<boolean>();

  public userNavigationData: NavigationUserPanel[] = userNavigationData;

  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public userCompany = JSON.parse(localStorage.getItem('userCompany'));
  public currentUserStatus: string = 'online';

  public isItemHovered: boolean = false;

  public onUserPanelClose() {
    this.onUserPanelCloseEvent.emit(false);
  }
  ngOnInit() {
    console.log(this.currentUser)
  }
}
