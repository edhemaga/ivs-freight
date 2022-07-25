import { SharedModule } from './../shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToDoRoutingModule } from './to-do-routing.module';
import { ToDoListCardComponent } from './to-do-list-card/to-do-list-card.component';

import { GridsterModule } from 'angular-gridster2';
import { AppTooltipeModule } from '../shared/app-tooltip/app-tooltip.module';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
@NgModule({
  declarations: [
    ToDoListCardComponent
  ],
  imports: [
    CommonModule,
    ToDoRoutingModule,
    AngularSvgIconModule,
    GridsterModule,
    AppTooltipeModule,
    SharedModule,
    NgxSmoothDnDModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToDoModule { }
