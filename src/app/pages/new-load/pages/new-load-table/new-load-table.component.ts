import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

// Enums
import { eColor } from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// svg-routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import {
    CaCheckboxComponent,
    CaLoadStatusComponent,
    CaCheckboxSelectedCountComponent,
    CaProfileImageComponent
} from 'ca-components';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { PickupDeliveryRowComponent } from './components/pickup-delivery-row/pickup-delivery-row.component';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableComponent,
        CaLoadStatusComponent,
        CaProfileImageComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        SvgIconComponent,
        PickupDeliveryRowComponent
    ],
})
export class NewLoadTableComponent {
    public eColor = eColor;
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(protected loadStoreService: LoadStoreService) {}

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onOpenModal(id: number, selectedTab: eLoadStatusStringType): void {
        const isTemplate = selectedTab === eLoadStatusStringType.TEMPLATE;

        this.loadStoreService.onOpenModal({
            id,
            isTemplate,
            isEdit: true,
        });
    }

    public onCheckboxCountClick(action: string): void {
        this.loadStoreService.onSelectAll(action);
    }

    public onSelectLoad(id: number): void {
        this.loadStoreService.onSelectLoad(id);
    }
}
