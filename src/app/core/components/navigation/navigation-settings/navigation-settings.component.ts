import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { settings } from '../model/navigation-data';
import { FooterData } from '../model/navigation.model';
import { navigation_magic_line } from '../navigation.animation';
@Component({
  selector: 'app-navigation-settings',
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [navigation_magic_line('showHideDetails')],
})
export class NavigationSettingsComponent implements OnInit {
  @Input() isNavigationHovered: boolean = false;
  public footer: FooterData[] = settings;
  public showItems = false;
  constructor() { }

  ngOnInit(): void {
    console.log(this.isNavigationHovered);
    
    console.log(this.footer)
  }

}
