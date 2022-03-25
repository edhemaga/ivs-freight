import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistReveiwComponent } from './truckassist-reveiw.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [TruckassistReveiwComponent],
  imports: [CommonModule, AngularSvgIconModule],
  exports: [TruckassistReveiwComponent],
})
export class TruckassistReveiwModule {}
