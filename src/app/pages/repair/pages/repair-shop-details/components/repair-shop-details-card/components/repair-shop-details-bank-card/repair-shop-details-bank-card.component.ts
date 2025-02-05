import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// models
import { RepairShopResponse } from 'appcoretruckassist';
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';

@Component({
    selector: 'app-repair-shop-details-bank-card',
    templateUrl: './repair-shop-details-bank-card.component.html',
    styleUrls: ['./repair-shop-details-bank-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
        TaPasswordAccountHiddenCharactersComponent,
    ],
})
export class RepairShopDetailsBankCardComponent {
    @Input() set cardData(data: RepairShopResponse) {
        this.createBankCardData(data);
    }

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public _cardData: ExtendedRepairShopResponse;

    public isBankCardOpen: boolean = true;

    public handleBankCardOpen(isOpen: boolean): void {
        this.isBankCardOpen = isOpen;
    }

    private createBankCardData(data: RepairShopResponse): void {
        this._cardData = data;

        const { bank, routing, account } = data;

        this._cardData = {
            ...this._cardData,
            bankInfo: [
                {
                    title: RepairShopDetailsStringEnum.BANK,
                    value: bank?.logoName,
                },
                { title: RepairShopDetailsStringEnum.ROUTING, value: routing },
                { title: RepairShopDetailsStringEnum.ACCOUNT, value: account },
            ],
        };
    }
}
