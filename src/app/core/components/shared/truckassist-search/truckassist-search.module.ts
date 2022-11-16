import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistSearchComponent } from './truckassist-search.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
   declarations: [TruckassistSearchComponent],
   imports: [CommonModule, AngularSvgIconModule, DirectivesModule, FormsModule],
   exports: [TruckassistSearchComponent],
})
export class TruckassistSearchModule {}
