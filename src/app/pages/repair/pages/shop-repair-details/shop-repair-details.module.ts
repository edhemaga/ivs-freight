// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Routing
import { ShopRepairDetailsRoutes } from './shop-repair-details.routing';

// Components
import { ShopRepairDetailsComponent } from './shop-repair-details.component';
import { ShopRepairDetailsItemComponent } from './components/shop-repair-details-item/shop-repair-details-item.component';
import { ShopRepairCardViewComponent } from './components/shop-repair-details-card/shop-repair-details-card.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaReCardComponent } from 'src/app/core/components/shared/ta-common-card/ta-re-card.component';
import { TaCounterComponent } from 'src/app/core/components/shared/ta-counter/ta-counter.component';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { DetailsDropdownComponent } from 'src/app/core/components/shared/details-page-dropdown/details-dropdown';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';

// Pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';

@NgModule({
    declarations: [
        ShopRepairDetailsComponent,
        ShopRepairDetailsItemComponent,
        ShopRepairCardViewComponent,
    ],
    exports: [ShopRepairCardViewComponent, SharedModule],
    imports: [
        // Routes
        ShopRepairDetailsRoutes,

        // Modules
        CommonModule,
        SharedModule,

        // Components
        TaChartComponent,
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        ProfileImagesComponent,
        TaCopyComponent,
        TaUploadFilesComponent,
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        TaCommonHeaderComponent,
        TaTabSwitchComponent,
        DetailsDropdownComponent,

        // Pipes
        FormatDatePipe,
        FormatCurrency,
    ],
})
export class ShopRepairDetailsModule {}
