import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutoFocusDirective} from "../../directives/auto-focus.directive";
import {InputFocusDirective} from "../../directives/input-focus.directive";
import {InputRestrictionDirective} from "../../directives/input-restriction.directive";
import {InputErrorPipe} from "../../pipes/input-error.pipe";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularSvgIconModule} from "angular-svg-icon";
import {AngularSvgIconPreloaderModule} from 'angular-svg-icon-preloader';

@NgModule({
  declarations: [
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    InputErrorPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgSelectModule,
    AngularSvgIconModule.forRoot(),
    AngularSvgIconPreloaderModule.forRoot({
      configUrl: '../../assets/imgPreloadJson/svgImages.json',
    }),
  ],
  exports: [
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    InputErrorPipe,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularSvgIconModule,
  ]
})
export class SharedModule { }
