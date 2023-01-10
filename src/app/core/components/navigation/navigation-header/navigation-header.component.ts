import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
    navigation_header_animation,
    navigation_route_animation,
} from '../navigation.animation';
import { NavigationService } from '../services/navigation.service';
@Component({
    selector: 'app-navigation-header',
    templateUrl: './navigation-header.component.html',
    styleUrls: ['./navigation-header.component.scss'],
    animations: [navigation_route_animation('showHideDetails')],
})
export class NavigationHeaderComponent {
    @Input() isNavigationHovered: boolean = false;

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
