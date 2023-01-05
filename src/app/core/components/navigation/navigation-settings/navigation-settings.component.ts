import { ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { settings } from '../model/navigation-data';
import { FooterData, Settings } from '../model/navigation.model';
import { navigation_route_animation } from '../navigation.animation';
import { NavigationService } from '../services/navigation.service';
@Component({
  selector: 'app-navigation-settings',
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [navigation_route_animation('showHideDetails')]
})
export class NavigationSettingsComponent implements OnInit {
  @Input() isNavigationHovered: boolean = false;
  @Input() isUserPanelOpen: boolean = false;
  @Input() isSettingsPanelOpen: boolean = false;
  public footer: FooterData[] = settings;
  status: boolean = false;
  constructor(private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
    }
    public onUserPanelClose() {
      this.isSettingsPanelOpen = !this.isSettingsPanelOpen
      
    this.navigationService.onDropdownActivation({
        name: 'Settings',
        type: this.isSettingsPanelOpen,
    });
}
  public changeRouteSettings(subroute: Settings): void {
    this.router.navigate([subroute.route]);
  }
}
