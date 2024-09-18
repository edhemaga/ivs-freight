import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// animations
import { navigationRouteAnimation } from '@core/components/navigation/animations/navigation.animation';

// services
import { NavigationService } from '@core/components/navigation/services/navigation.service';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
  
@Component({
    selector: 'app-navigation-header',
    templateUrl: './navigation-header.component.html',
    styleUrls: ['./navigation-header.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, 
        AngularSvgIconModule,
        NgbModule,
        TaAppTooltipV2Component,
    ],
    animations: [navigationRouteAnimation('showHideDetails')],
})
export class NavigationHeaderComponent {
    @Input() isNavigationHovered: boolean = false;
    @Input() ChangeCloseTextTitle: boolean;
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
