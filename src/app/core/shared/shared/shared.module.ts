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
import { SvgMorphComponent } from './svg-morph/svg-morph.component';
import {AgmCoreModule} from '@agm/core';
import { MapControlComponent } from './map-control/map-control.component';
import { TatooltipDirective } from '../../directives/tatooltip.directive';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TaSwitchComponent } from './ta-switch/ta-switch.component';

@NgModule({
  declarations: [
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    InputErrorPipe,
    SvgMorphComponent,
    MapControlComponent,
    TatooltipDirective,
    TaSwitchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgSelectModule,
    NgbModule,
    AngularSvgIconModule.forRoot(),
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
        libraries: ['geometry', 'places'],
    }),
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
    SvgMorphComponent,
    AgmCoreModule,
    MapControlComponent,
    NgbModule,
    TatooltipDirective,
    TaSwitchComponent
  ]
})
export class SharedModule { }
