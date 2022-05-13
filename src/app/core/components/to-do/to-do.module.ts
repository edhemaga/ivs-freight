import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToDoRoutingModule } from './to-do-routing.module';
import { ToDoListCardComponent } from './to-do-list-card/to-do-list-card.component';


@NgModule({
  declarations: [
    ToDoListCardComponent
  ],
  imports: [
    CommonModule,
    ToDoRoutingModule,
    AngularSvgIconModule
  ]
})
export class ToDoModule { }
