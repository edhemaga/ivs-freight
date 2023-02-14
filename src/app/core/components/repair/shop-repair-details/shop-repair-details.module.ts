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
        TruckassistTableHeadComponent
    ],
})
export class ShopRepairDetailsModule {}
