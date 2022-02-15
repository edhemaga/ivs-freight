import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutoFocusDirective} from "../../directives/auto-focus.directive";
import {InputFocusDirective} from "../../directives/input-focus.directive";


@NgModule({
  declarations: [
    AutoFocusDirective,
    InputFocusDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AutoFocusDirective,
    InputFocusDirective
  ]
})
export class SharedModule { }
