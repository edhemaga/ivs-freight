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
import { CardColumnsComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';

// configs
import { MilesCardDataConfig } from './utils/configs/miles-card-data.config';

// interfaces
import { ICardValueData } from '@shared/interfaces';

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
            // this.modalService.openModal(CardColumnsComponent, {
            //     size: 'small',
            // });
        }, 5000);
    }
}
