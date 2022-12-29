import { ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { settings } from '../model/navigation-data';
import { FooterData, Settings } from '../model/navigation.model';
import { navigation_route_animation } from '../navigation.animation';
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
  constructor(private router: Router) { }

  ngOnInit(): void {
  
  }
  public changeRouteSettings(subroute: Settings): void {
    this.router.navigate([subroute.route]);
  }
}
