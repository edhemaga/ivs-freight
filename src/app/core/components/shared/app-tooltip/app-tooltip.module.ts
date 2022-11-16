import { NgModule } from '@angular/core';
import { AppTooltipComponent } from './app-tooltip.component';
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [
    AppTooltipComponent,
  ],
  exports: [
    AppTooltipComponent,
    NgbTooltipModule
  ]
})
export class AppTooltipeModule { }