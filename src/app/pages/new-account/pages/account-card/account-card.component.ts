import { Component } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';

// components
import { CaTableCardViewComponent } from 'ca-components';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';

// pipes
import { GetNestedValuePipe, FormatDatePipe } from '@shared/pipes';

// enums
import { eTableCardViewData } from '@shared/enums';

// svg-routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// config
import { AccountCardDataConfig } from '@pages/new-account/pages/account-card/utils/configs/account-card-data.config';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrl: './account-card.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,

        // components
        CaTableCardViewComponent,
        TaPasswordAccountHiddenCharactersComponent,

        // pipes
        GetNestedValuePipe,
        FormatDatePipe,
    ],
})
export class AccountCardComponent {
    // enums
    public eTableCardViewData = eTableCardViewData;
    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    public cardData = AccountCardDataConfig;

    constructor(public accountStoreService: AccountStoreService) {}

    public onShowMoreClick(): void {
        this.accountStoreService.getNewPage();
    }
}
