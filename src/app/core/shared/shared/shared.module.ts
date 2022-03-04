import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DriverManageComponent} from "../../components/modals/driver-manage/driver-manage.component";
import {SortPipe} from "../../pipes/sort.pipe";
import {HistoryDataComponent} from "../../components/shared/history-data/history-data.component";
import {DatePickerModule} from "@progress/kendo-angular-dateinputs";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {TabSwitcherComponent} from "../../components/switchers/tab-switcher/tab-switcher.component";
import {SortableModule} from "@progress/kendo-angular-sortable";
import {GridModule, PDFModule} from "@progress/kendo-angular-grid";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import {SchedulerModule} from '@progress/kendo-angular-scheduler';
import {InputsModule, SwitchModule} from "@progress/kendo-angular-inputs";
import {DateInputsModule} from "@progress/kendo-angular-dateinputs";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {ExcelExportModule} from "@progress/kendo-angular-excel-export";
import {PDFExportModule} from "@progress/kendo-angular-pdf-export";
import {LabelModule} from "@progress/kendo-angular-label";
import {TextFieldModule} from "@angular/cdk/text-field";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {StatusSwitcherComponent} from "../../components/switchers/status-switcher/status-switcher.component";
import {TruckManageComponent} from "../../components/modals/truck-manage/truck-manage.component";
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {TrailerManageComponent} from "../../components/modals/trailer-manage/trailer-manage.component";
import {TooltipDirective} from "../../directives/tooltip.directive";
import {NgxMaskModule} from "ngx-mask";
import {EditProfileComponent} from "../../components/modals/edit-profile/edit-profile.component";

@NgModule({
  declarations: [
    AutoFocusDirective,
    InputFocusDirective,
    TooltipDirective,
    InputRestrictionDirective,
    InputErrorPipe,
    SvgMorphComponent,
    MapControlComponent,
    DriverManageComponent,
    SortPipe,
    HistoryDataComponent,
    TabSwitcherComponent,
    StatusSwitcherComponent,
    TruckManageComponent,
    NFormatterPipe,
    TooltipDirective,
    TrailerManageComponent,
    EditProfileComponent
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
    NgxSliderModule,
    DatePickerModule,
    GooglePlaceModule,
    NgbModule,
    SortableModule,
    GridModule,
    PDFModule,
    DropDownsModule,
    ButtonsModule,
    SchedulerModule,
    InputsModule,
    SwitchModule,
    DateInputsModule,
    LayoutModule,
    ExcelExportModule,
    PDFExportModule,
    LabelModule,
    TextFieldModule,
    DragDropModule,
    NgxMaskModule.forRoot()
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
    SortPipe,
    SortableModule,
    GridModule,
    PDFModule,
    DropDownsModule,
    ButtonsModule,
    SchedulerModule,
    InputsModule,
    SwitchModule,
    DateInputsModule,
    LayoutModule,
    ExcelExportModule,
    PDFExportModule,
    LabelModule,
    NFormatterPipe,
    TabSwitcherComponent,
    TooltipDirective
  ],
  providers: [SortPipe, NFormatterPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
