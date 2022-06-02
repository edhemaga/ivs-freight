import { TruckassistTableModule } from './../../shared/truckassist-table/truckassist-table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { ShopRepairDetailsRoutes } from './shop-repair-details.routing';
import { ShopRepairDetailsComponent } from './shop-repair-details.component';
import { RenderMultipleItemsPipe } from './shop-repair-details-item/renderMultipleItems.pipe';
import { ShopRepairDetailsItemComponent } from './shop-repair-details-item/shop-repair-details-item.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  declarations: [
    ShopRepairDetailsComponent,
    ShopRepairDetailsItemComponent,
    RenderMultipleItemsPipe,
  ],
  exports:[PipesModule],
  imports: [
    CommonModule,
    ShopRepairDetailsRoutes,
    TruckassistProgressExpirationModule,
    SharedModule,
    PipesModule,
    TruckassistTableModule
  ],
})
export class ShopRepairDetailsModule {}
