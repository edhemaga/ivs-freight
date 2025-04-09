import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// interfaces
import { ICardValueData } from '@shared/interfaces';

@Component({
    selector: 'app-new-load-cards',
    templateUrl: './new-load-cards.component.html',
    styleUrl: './new-load-cards.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class NewLoadCardsComponent {
    // public frontSideData: ICardValueData[] =
    //     MilesCardDataConfig.FRONT_SIDE_DATA;
    // public backSideData: ICardValueData[] = MilesCardDataConfig.BACK_SIDE_DATA;
    
    constructor(public loadStoreService: LoadStoreService) {}
}
