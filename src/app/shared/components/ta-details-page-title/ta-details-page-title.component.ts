import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Models
import { DetailsDropdownOptions } from '@shared/models';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaDropdownMenuComponent } from 'ca-components';

@Component({
    selector: 'app-ta-details-page-title',
    templateUrl: './ta-details-page-title.component.html',
    styleUrl: './ta-details-page-title.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        SvgIconComponent,
        CaDropdownMenuComponent,
    ],
})
export class TaDetailsPageTitleComponent {
    @Input() isLoading: boolean;
    @Input() textTitle!: string;
    @Input() routeLink!: string;
    @Input() detailsDropdownOptions!: DetailsDropdownOptions;
    @Input() rightSide?: TemplateRef<any>;

    private history: string[] = [];

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.history.push(event.urlAfterRedirects);
            }
        });
    }

    public backIcon = SharedSvgRoutes.DETAILS_BACK_BUTTON;

    public goBackInHistory(): void {
        // If user comes from google he will go back there, keep him on list
        if (this.history.length > 1) {
            this.history.pop();
            const previousUrl = this.history.pop();
            if (previousUrl) {
                this.router.navigateByUrl(previousUrl);
            }
        } else {
            // Fallback
            this.router.navigate([this.routeLink]);
        }
    }
}
