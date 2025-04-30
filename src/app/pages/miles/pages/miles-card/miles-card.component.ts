import { Component } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// components
import { CaTableCardViewComponent } from 'ca-components';

// pipes
import {
    FormatCurrencyPipe,
    ThousandSeparatorPipe,
    GetNestedValuePipe,
} from '@shared/pipes';

// enums
import { eTableCardViewData } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// svg-routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-miles-card',
    templateUrl: './miles-card.component.html',
    styleUrl: './miles-card.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,

        // components
        CaTableCardViewComponent,

        // pipes
        FormatCurrencyPipe,
        ThousandSeparatorPipe,
        GetNestedValuePipe,
    ],
})
export class MilesCardComponent {
    // enums
    public eTableCardViewData = eTableCardViewData;
    public eMileTabs = eMileTabs;

    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(public milesStoreService: MilesStoreService) {}

    public onShowMoreClick(): void {
        this.milesStoreService.getNewPage();
    }
}
