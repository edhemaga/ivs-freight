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

import { ModalService } from '@shared/services';
import { CardColumnsModalComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';

// configs
import { MilesCardDataConfig } from './utils/configs/miles-card-data.config';

// interfaces
import { ICardValueData } from '@shared/interfaces';

// enums
import { eMilesCardData } from '@pages/miles/pages/miles-card/enums';
import { eTableCardViewData, TableStringEnum } from '@shared/enums';

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
    public frontSideData: ICardValueData[] =
        MilesCardDataConfig.FRONT_SIDE_DATA;
    public backSideData: ICardValueData[] = MilesCardDataConfig.BACK_SIDE_DATA;

    // enums
    public tableCardViewEnums = eTableCardViewData;

    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(
        private modalService: ModalService,
        public milesStoreService: MilesStoreService
    ) {}

    public openColumnsModal(): void {
        const action = {
            data: {
                cardsAllData: MilesCardDataConfig.CARD_ALL_DATA,
                front_side: this.frontSideData,
                back_side: this.backSideData,
                numberOfRows: 4,
                checked: true,
            },
            title: eMilesCardData.MILES_ACTIVE_TRUCK,
        };
        
        this.modalService
            .openModal(
                CardColumnsModalComponent,
                { size: TableStringEnum.SMALL },
                action
            )
            .then((result) => {
                if (result) {
                    this.frontSideData = result.selectedColumns.front_side
                        .slice(0, result.selectedColumns.numberOfRows)
                        .map((front: ICardValueData) => front.inputItem);

                    this.backSideData = result.selectedColumns.back_side
                        .slice(0, result.selectedColumns.numberOfRows)
                        .map((back: ICardValueData) => back.inputItem);
                }
            });
    }

    public onShowMoreClick(): void {
        this.milesStoreService.getNewPage();
    }
}
