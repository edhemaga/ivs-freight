import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingRoutingModule } from './routing-routing.module';
import { RoutingMapComponent } from './routing-map/routing-map.component';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RoutingMapComponent
  ],
  imports: [
    CommonModule,
    RoutingRoutingModule,
    SharedModule,
  ]
})
export class RoutingModule { }
