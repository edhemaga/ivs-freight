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
  public footer: FooterData[] = settings;
  public showItems = false;
  private destroy$ = new Subject<void>();
  isModalPanelOpen
  isUserPanelOpen
  isUserCompanyDetailsOpen
  status: boolean = false;
  constructor(private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.navigationDropdownActivation$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                switch (data.name) {
                    case 'Modal Panel': {
                        if (data.type) {
                            this.isModalPanelOpen = data.type;
                            this.isUserPanelOpen = false;
                            this.isUserCompanyDetailsOpen = false;
                        } else {
                            this.isModalPanelOpen = data.type;
                        }
                        break;
                    }
                    case 'User Panel': {
                        if (data.type) {
                            this.isModalPanelOpen = false;
                            this.isUserPanelOpen = data.type;
                            this.isUserCompanyDetailsOpen = false;
                        } else {
                            this.isUserPanelOpen = data.type;
                        }
                        break;
                    }
                    case 'User Company Details': {
                        if (data.type) {
                            this.isModalPanelOpen = false;
                            this.isUserPanelOpen = false;
                            this.isUserCompanyDetailsOpen = data.type;
                        } else {
                            this.isUserCompanyDetailsOpen = data.type;
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
  }
  public changeRouteSettings(subroute: Settings): void {
    this.router.navigate([subroute.route]);
  }
}
