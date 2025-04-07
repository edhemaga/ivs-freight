import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
    selector: 'app-miles-card',
    templateUrl: './miles-card.component.html',
    styleUrl: './miles-card.component.scss',
    standalone: true,
    imports: [
        CommonModule,

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

    constructor(
        public milesStoreService: MilesStoreService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.modalService
                .openModal(
                    CardColumnsModalComponent,
                    { size: 'small' },
                    {
                        data: {
                            cardsAllData: MilesCardDataConfig.CARD_ALL_DATA,
                            front_side: this.frontSideData,
                            back_side: this.backSideData,
                            numberOfRows: 4,
                            checked: true,
                        },
                        title: eMilesCardData.MILES_ACTIVE_TRUCK,
                    }
                )
                .then((result) => {
                    if (result) {
                        console.log('Modal emitted result:', result);
                        this.frontSideData = result.selectedColumns.front_side
                            .slice(0, result.selectedColumns.numberOfRows)
                            .map((front) => front.inputItem);

                        this.backSideData = result.selectedColumns.back_side
                            .slice(0, result.selectedColumns.numberOfRows)
                            .map((back) => back.inputItem);

                        console.log(this.frontSideData, 'frontsidedata');
                    }
                });
        }, 5000);
    }
}
