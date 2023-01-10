import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from 'stream';
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
export class NavigationSettingsComponent implements OnInit, OnChanges {
    @Input() isNavigationHovered: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() isSettingsPanelOpen: boolean = false;
    // @Output() onRouteEvent: any = new EventEmitter();
    public footer: FooterData[] = settings;
    public isMagicLineActive: boolean = false;
    status: boolean = false;
    constructor(
        private router: Router,
        private navigationService: NavigationService
    ) {}
    ngOnChanges(): void {
        if (!this.isNavigationHovered) {
            this.isSettingsPanelOpen = false;
        }
    }
    routeAction(route) {
        // this.onRouteEvent.emit({
        //     routeId: this.route.id,
        //     routes: this.route.route,
        //     activeRouteFlegId: JSON.parse(
        //         localStorage.getItem('subroute_active')
        //     ),
        // });
        localStorage.setItem(
            'settings_active',
            route.activeRouteFlegId.toString()
        );
        localStorage.removeItem('subroute_active');
    }
    public isActiveRouteOnReload(route: string): boolean {
        if (this.router.url.includes(route)) {
            this.isMagicLineActive = true;
        }
        return this.router.url.includes(route);
    }
    ngOnInit(): void {}
    public onUserPanelClose() {
        this.isSettingsPanelOpen = !this.isSettingsPanelOpen;

        this.navigationService.onDropdownActivation({
            name: 'Settings',
            type: this.isSettingsPanelOpen,
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
