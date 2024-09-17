import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// animations
import { navigationRouteAnimation } from '@core/components/navigation/animations/navigation.animation';

// services
import { NavigationService } from '@core/components/navigation/services/navigation.service';

// components
import { TaTooltipSlideComponent } from '@shared/components/ta-tooltip-slide/ta-tooltip-slide.component';

// Const
import { NavigationDataConstants } from '@core/components/navigation/utils/constants/navigation-data.constants';

@Component({
    selector: 'app-navigation-header',
    templateUrl: './navigation-header.component.html',
    styleUrls: ['./navigation-header.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TaTooltipSlideComponent,
        AngularSvgIconModule,
    ],
    animations: [navigationRouteAnimation('showHideDetails')],
})
export class NavigationHeaderComponent {
    @Input() isNavigationHovered: boolean = false;
    @Input() ChangeCloseTextTitle: boolean;

    public Title: string = NavigationDataConstants.title;
    public showToolTip: boolean = false;

    constructor(
        private navigationService: NavigationService,
        private router: Router
    ) {}

    redirectToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    public onAction(type: string) {
        switch (type) {
            case 'Open Panel': {
                this.navigationService.onDropdownActivation({
                    name: 'Modal Panel',
                    type: true,
                });
                break;
            }
            case 'Search': {
                // TODO: search
                break;
            }
            case 'Notes': {
                // TODO: notes
                break;
            }
            case 'Bell': {
                // TODO: bell
                break;
            }
            default: {
                return;
            }
        }
    }
}
