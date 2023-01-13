import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { settings } from '../model/navigation-data';
import { FooterData, Settings } from '../model/navigation.model';
import {
    DropDownAnimation,
    navigation_route_animation,
} from '../navigation.animation';
import { NavigationService } from '../services/navigation.service';
@Component({
    selector: 'app-navigation-settings',
    templateUrl: './navigation-settings.component.html',
    styleUrls: ['./navigation-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        navigation_route_animation('showHideDetails'),
        DropDownAnimation,
    ],
})
export class NavigationSettingsComponent implements OnInit {
    @Input() isNavigationHovered: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() isSettingsPanelOpen = false;
    @Input() settingsRouteActivated: boolean = false;
    @Input() isActiveFooterRouteClick: boolean = false;
    @Output() activatedSettingsRoute = new EventEmitter<any>();
    public footer: FooterData[] = settings;
    constructor(
        private router: Router,
        private navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.navigationService.navigationDropdownActivation$.subscribe(
            (res) => {
                if (res.name === 'Settings') {
                    this.isSettingsPanelOpen = res.type;
                }
            }
        );
    }
    routeAction(route) {
        this.navigationService.setValueWhichNavIsOpen(false);
        this.activatedSettingsRoute.emit({ value: true, id: 34 });
        localStorage.setItem(
            'footer_active',
            route.activeRouteFlegId.toString()
        );
        localStorage.removeItem('subroute_active');
    }
    public isActiveRouteOnReload(route: string): boolean {
        if (this.router.url.includes(route)) {
        }
        return this.router.url.includes(route);
    }

    public onUserPanelClose() {
        this.navigationService.onDropdownActivation({
            name: 'Settings',
            type: !this.isSettingsPanelOpen,
        });
    }
    public changeRouteSettings(subroute: Settings): void {
        if (subroute.route === '/user') {
            this.router.navigate([subroute.route]);
        } else {
            this.router.navigate([`/settings${subroute.route}`]);
        }
    }
}
