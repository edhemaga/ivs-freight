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
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';
import { DetailsDropdownComponent } from 'src/app/core/components/shared/details-page-dropdown/details-dropdown';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';

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
        TaCommonCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderComponent,
        TaTabSwitchComponent,
        DetailsDropdownComponent,

        // Pipes
        formatDatePipe,
        formatCurrency,
    ],
})
export class ShopRepairDetailsModule {}
