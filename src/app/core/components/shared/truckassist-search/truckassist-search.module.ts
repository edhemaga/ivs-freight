import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistSearchComponent } from './truckassist-search.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  declarations: [TruckassistSearchComponent],
  imports: [CommonModule, AngularSvgIconModule, DirectivesModule],
  exports: [TruckassistSearchComponent],
})
export class TruckassistSearchModule {}
