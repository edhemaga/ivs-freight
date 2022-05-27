import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairTableComponent } from './repair-table/repair-table.component';
import { RepairRoutingModule } from './repair-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { RepairCardComponent } from './repair-card/repair-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ShopRepairDetailsComponent } from './shop-repair-details/shop-repair-details.component';

@NgModule({
  declarations: [RepairTableComponent, RepairCardComponent],
  imports: [CommonModule, RepairRoutingModule, TruckassistTableModule, AngularSvgIconModule],
})
export class RepairModule {}
