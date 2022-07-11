import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistSearchComponent } from './truckassist-search.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TruckassistSearchComponent],
  imports: [CommonModule, AngularSvgIconModule, DirectivesModule, FormsModule],
  exports: [TruckassistSearchComponent],
})
export class TruckassistSearchModule {}
