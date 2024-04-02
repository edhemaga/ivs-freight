import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { navigation_route_animation } from '../../animations/navigation.animation';
import { NavigationService } from '../../services/navigation.service';
import { TooltipSlideComponent } from 'src/app/core/components/standalone-components/tooltip-slide/tooltip-slide.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
@Component({
    selector: 'app-navigation-header',
    templateUrl: './navigation-header.component.html',
    styleUrls: ['./navigation-header.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipSlideComponent,
        AngularSvgIconModule,
    ],
    animations: [navigation_route_animation('showHideDetails')],
})
export class NavigationHeaderComponent {
    @Input() isNavigationHovered: boolean = false;
    @Input() ChangeCloseTextTitle: boolean;
    public Title: string = 'Add Anything';
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
