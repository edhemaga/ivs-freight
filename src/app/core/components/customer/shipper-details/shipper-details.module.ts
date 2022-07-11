import { ShipperCardViewComponent } from './../shipper-card-view/shipper-card-view.component';
import { ShipperDetailsComponent } from './shipper-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipperDetailsSingleComponent } from './shipper-details-single/shipper-details-single.component';
import { ShipperDetailsRoutes } from './shipper-details.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ShipperDetailsComponent,
    ShipperDetailsSingleComponent,
    ShipperCardViewComponent,
  ],
  exports: [ShipperCardViewComponent,SharedModule ],
  imports: [
    CommonModule,
    ShipperDetailsRoutes,
    SharedModule
  ],
})
export class ShipperDetailsModule {}
