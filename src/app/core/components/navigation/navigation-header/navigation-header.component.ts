import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { navigation_route_animation } from '../navigation.animation';
import { NavigationService } from '../services/navigation.service';
@Component({
    selector: 'app-navigation-header',
    templateUrl: './navigation-header.component.html',
    styleUrls: ['./navigation-header.component.scss'],
    animations: [navigation_route_animation('showHideDetails')],
})
export class NavigationHeaderComponent implements OnChanges {
    @Input() isNavigationHovered: boolean = false;
    @Input() isModalPanelOpen: boolean;
    @Input() ChangeCloseTextTitle: boolean;
    public Title: string = 'Add Anything';
    public showToolTip: boolean = false;

    constructor(
        private navigationService: NavigationService,
        private router: Router
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        this.isModalPanelOpen == true && this.ChangeCloseTextTitle
            ? (this.Title = 'Close')
            : (this.Title = 'Add Anything');
    }
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
