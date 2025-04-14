import { Component } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

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
import { LoadCardDataConfig } from '@pages/new-load/pages/new-load-cards/utils/configs';

// interfaces
import { ICardValueData } from '@shared/interfaces';

// enums
import { eTableCardViewData, TableStringEnum } from '@shared/enums';

// svg-routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-load-cards',
    templateUrl: './new-load-cards.component.html',
    styleUrl: './new-load-cards.component.scss',
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
export class NewLoadCardsComponent {
    public frontSideData: ICardValueData[] = LoadCardDataConfig.FRONT_SIDE_DATA;
    public backSideData: ICardValueData[] = LoadCardDataConfig.BACK_SIDE_DATA;

    // enums
    public tableCardViewEnums = eTableCardViewData;

    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(
        private modalService: ModalService,
        public loadStoreService: LoadStoreService
    ) {}

    public openColumnsModal(): void {
        const action = {
            data: {
                cardsAllData: LoadCardDataConfig.CARD_ALL_DATA,
                front_side: this.frontSideData,
                back_side: this.backSideData,
                numberOfRows: 4,
                checked: true,
            },
            title: 'test',
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
}
