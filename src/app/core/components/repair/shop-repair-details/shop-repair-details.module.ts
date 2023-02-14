import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRepairDetailsRoutes } from './shop-repair-details.routing';
import { ShopRepairDetailsComponent } from './shop-repair-details.component';
import { ShopRepairDetailsItemComponent } from './shop-repair-details-item/shop-repair-details-item.component';
import { ShopRepairCardViewComponent } from '../shop-repair-card-view/shop-repair-card-view.component';
import { SharedModule } from '../../shared/shared.module';
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';
import { TaDetailsHeaderCardComponent } from '../../shared/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TruckassistTableBodyComponent } from '../../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { ProfileImagesComponent } from '../../shared/profile-images/profile-images.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaReCardComponent } from '../../shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from '../../shared/ta-counter/ta-counter.component';
import { TaCommonHeaderComponent } from '../../shared/ta-details-header/ta-details-header.component';

@NgModule({
    declarations: [
        ShopRepairDetailsComponent,
        ShopRepairDetailsItemComponent,
        ShopRepairCardViewComponent,
    ],
    exports: [ShopRepairCardViewComponent, SharedModule],
    imports: [
        CommonModule,
        ShopRepairDetailsRoutes,
        SharedModule,
        TaChartComponent,
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        formatDatePipe,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent,
        ProfileImagesComponent,
        TaCopyComponent,
        TaUploadFilesComponent,
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        TaCommonHeaderComponent,
    ],
})
export class ShopRepairDetailsModule {}
