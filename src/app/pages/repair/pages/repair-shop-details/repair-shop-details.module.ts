// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

// Routing
import { RepairShopDetailsRoutingModule } from '@pages/repair/pages/repair-shop-details/repair-shop-details-routing.module';

// Components
import { RepairShopDetailsComponent } from '@pages/repair/pages/repair-shop-details/repair-shop-details.component';
import { RepairShopDetailsItemComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/repair-shop-details-item.component';
import { RepairShopCardViewComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/repair-shop-details-card.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { CaChartComponent } from 'ca-components';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

@NgModule({
    declarations: [
        RepairShopDetailsComponent,
        RepairShopDetailsItemComponent,
        RepairShopCardViewComponent,
    ],
    exports: [RepairShopCardViewComponent, SharedModule],
    imports: [
        // Routes
        RepairShopDetailsRoutingModule,

        // Modules
        CommonModule,
        SharedModule,

        // Components
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaUploadFilesComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderComponent,
        TaTabSwitchComponent,
        TaDetailsDropdownComponent,
        CaChartComponent,

        // Pipes
        FormatDatePipe,
        FormatCurrencyPipe,
    ],
})
export class RepairShopDetailsModule {}
