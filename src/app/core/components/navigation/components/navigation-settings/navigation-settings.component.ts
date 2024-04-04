import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { settings } from '../../utils/constants/navigation-data.constants';
import { FooterData, Settings } from '../../models/navigation.model';
import {
    DropDownAnimation,
    navigation_route_animation,
} from '../../animations/navigation.animation';
import { NavigationService } from '../../services/navigation.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaTooltipSlideComponent } from 'src/app/shared/components/ta-tooltip-slide/ta-tooltip-slide.component';
@Component({
    selector: 'app-navigation-settings',
    templateUrl: './navigation-settings.component.html',
    styleUrls: ['./navigation-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        TaTooltipSlideComponent,
    ],
    animations: [
        navigation_route_animation('showHideDetails'),
        DropDownAnimation,
    ],
})
export class NavigationSettingsComponent implements OnInit, OnChanges {
    @Input() isNavigationHovered: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() isSettingsPanelOpen = false;
    @Input() settingsRouteActivated: boolean = false;
    @Input() isActiveFooterRouteClick: boolean = false;
    @Input() mouseOverMiddleNav: boolean = false;
    @Input() mouseOverFooter: boolean = false;
    @Input() subrouteContainerOpened: boolean = false;
    @Input() selectedRoute: string;
    @Input() selectedSubRoute: string;
    @Output() activatedSettingsRoute = new EventEmitter<any>();
    public footer: FooterData[] = settings;
    public showToolTip: boolean;
    public magicBoxAnime: boolean = true;
    constructor(
        private router: Router,
        private navigationService: NavigationService
    ) {}
    ngOnInit(): void {
        this.navigationService.navigationDropdownActivation$.subscribe(
            (res) => {
                if (res.name === 'Company') {
                    this.isSettingsPanelOpen = res.type;
                }
            }
        );
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('isNavigationHovered')) {
            const prev = changes.isNavigationHovered;

            if (changes && prev.previousValue != undefined) {
                this.magicBoxAnime = changes.isNavigationHovered.currentValue;
            }
        }
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
        this.router.navigate([`/company${subroute.route}`]);
    }
}
