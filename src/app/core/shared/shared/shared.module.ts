import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoFocusDirective} from "../../directives/auto-focus.directive";
import {InputFocusDirective} from "../../directives/input-focus.directive";
import {InputRestrictionDirective} from "../../directives/input-restriction.directive";
import {InputErrorPipe} from "../../pipes/input-error.pipe";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularSvgIconModule} from "angular-svg-icon";
import {AngularSvgIconPreloaderModule} from 'angular-svg-icon-preloader';
import {DriverManageComponent} from "../../components/modals/driver-manage/driver-manage.component";
import {SortPipe} from "../../pipes/sort.pipe";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {HistoryDataComponent} from "../../components/shared/history-data/history-data.component";
import {DatePickerModule} from "@progress/kendo-angular-dateinputs";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    InputErrorPipe,
    DriverManageComponent,
    SortPipe,
    HistoryDataComponent
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
    NgxSliderModule,
    DatePickerModule,
    GooglePlaceModule,
    NgbModule,
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
    SortPipe
  ],
  providers: [SortPipe]
})
export class SharedModule {
}
