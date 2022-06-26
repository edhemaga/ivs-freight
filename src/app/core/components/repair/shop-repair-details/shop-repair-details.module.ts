import { TruckassistTableModule } from './../../shared/truckassist-table/truckassist-table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { ShopRepairDetailsRoutes } from './shop-repair-details.routing';
import { ShopRepairDetailsComponent } from './shop-repair-details.component';
import { ShopRepairDetailsItemComponent } from './shop-repair-details-item/shop-repair-details-item.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ShopRepairCardViewComponent } from '../shop-repair-card-view/shop-repair-card-view.component';

@NgModule({
  declarations: [
    ShopRepairDetailsComponent,
    ShopRepairDetailsItemComponent,
    ShopRepairCardViewComponent
  ],
  exports:[ShopRepairCardViewComponent,SharedModule],
  imports: [
    CommonModule,
    ShopRepairDetailsRoutes,
    TruckassistProgressExpirationModule,
    SharedModule,
    TruckassistTableModule
  ],
})
export class ShopRepairDetailsModule {}
