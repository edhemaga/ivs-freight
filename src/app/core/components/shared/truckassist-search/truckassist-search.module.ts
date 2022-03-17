import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistSearchComponent } from './truckassist-search.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [TruckassistSearchComponent],
  imports: [CommonModule, AngularSvgIconModule],
  exports: [TruckassistSearchComponent],
})
export class TruckassistSearchModule {}
