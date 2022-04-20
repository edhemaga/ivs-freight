import { TaModalComponent } from './ta-modal/ta-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { AutoFocusDirective } from "../../directives/auto-focus.directive";
import { InputFocusDirective } from "../../directives/input-focus.directive";
import { InputRestrictionDirective } from "../../directives/input-restriction.directive";
import { InputErrorPipe } from "../../pipes/input-error.pipe";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from "angular-svg-icon";
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortPipe } from "../../pipes/sort.pipe";
import { HistoryDataComponent } from "./history-data/history-data.component";
import { DatePickerModule } from "@progress/kendo-angular-dateinputs";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { TabSwitcherComponent } from "../switchers/tab-switcher/tab-switcher.component";
import { SortableModule } from "@progress/kendo-angular-sortable";
import { GridModule, PDFModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { InputsModule, SwitchModule } from "@progress/kendo-angular-inputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { LabelModule } from "@progress/kendo-angular-label";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {ScrollingModule} from '@angular/cdk/scrolling';
import { StatusSwitcherComponent } from "../switchers/status-switcher/status-switcher.component";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TooltipDirective } from "../../directives/tooltip.directive";
import { NgxMaskModule } from "ngx-mask";
import { NFormatterPipe } from '../../pipes/n-formatter.pipe';
import { TaNoteContainerComponent } from './ta-note/ta-note-container/ta-note-container.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { TaSelectComponent } from './ta-select/ta-select.component';
import { TaStatusSelectComponent } from './ta-status-select/ta-status-select.component';
import { TaStatusSwitchComponent } from './ta-status-switch/ta-status-switch.component';
import { StatusPipePipe } from '../../pipes/status-pipe.pipe';
import { CdkConnectPipe } from '../../pipes/cdkconnect.pipe';
import { CdkIdPipe } from '../../pipes/cdkid.pipe';
import { HighlightSearchPipe } from '../../pipes/highlight-search.pipe';
import { HosTimePipe } from '../../pipes/hostime';
import { NameInitialsPipe } from '../../pipes/nameinitials';
import { Ng5SliderModule } from 'ng5-slider';
import {EditProfileImageComponent} from "./edit-profile-image/edit-profile-image.component";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CroppieModule } from 'angular-croppie-module';
import { DragDropFileDirective } from '../../directives/dragDropFile.directive';
import { TaCounterComponent } from './ta-counter/ta-counter.component';
import { TaNgxSliderComponent } from './ta-ngx-slider/ta-ngx-slider.component';
import { TaLogoChangeComponent } from './ta-logo-change/ta-logo-change.component';

import { TaFilesComponent } from './ta-files/ta-files.component';
import { TaFileComponent } from './ta-files/ta-file/ta-file.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { TaInputComponent } from '../../components/shared/ta-input/ta-input.component';
import { SvgDefinitionsComponent } from 'src/app/svg-definitions/svg-definitions.component';
import { AccountManageComponent } from '../modals/account-manage/account-manage.component';
import { AccountModalComponent } from '../modals/account-modal/account-modal.component';
import { TaInputNoteComponent } from './ta-input-note/ta-input-note.component';
import { TextareaAutosizeDirective } from '../../directives/TextareaAutosize.directive';
import { TaInputDropdownComponent } from './ta-input-dropdown/ta-input-dropdown.component';
import { CustomDatetimePickersComponent } from './custom-datetime-pickers/custom-datetime-pickers.component';
import { CalendarDatesMainComponent } from './custom-datetime-pickers/calendar-dates-main/calendar-dates-main.component';
import { CalendarDaysComponent } from './custom-datetime-pickers/calendar-days/calendar-days.component';
import { CalendarLeftComponent } from './custom-datetime-pickers/calendar-left/calendar-left.component';
import { DateCalendarsComponent } from './custom-datetime-pickers/date-calendars/date-calendars.component';

@NgModule({
  declarations: [
    AutoFocusDirective,
    InputFocusDirective,
    TooltipDirective,
    InputRestrictionDirective,
    InputErrorPipe,
    SortPipe,
    StatusPipePipe,
    HighlightSearchPipe,
    NameInitialsPipe,
    HosTimePipe,
    CdkIdPipe,
    CdkConnectPipe,
    HistoryDataComponent,
    TabSwitcherComponent,
    StatusSwitcherComponent,
    NFormatterPipe,
    TooltipDirective,
    TaNoteContainerComponent,
    TaStatusSwitchComponent,
    TaStatusSelectComponent,
    TaSelectComponent,
    DeleteDialogComponent,
    EditProfileImageComponent,
    EditProfileImageComponent,
    EditProfileImageComponent,
    DragDropFileDirective,
    TaCounterComponent,
    TaNgxSliderComponent,
    TaLogoChangeComponent,
    TaFilesComponent,
    TaFileComponent,
    TaInputComponent,
    SvgDefinitionsComponent,
    AccountManageComponent,
    TaModalComponent,
    AccountModalComponent,
    TaInputNoteComponent,
    TextareaAutosizeDirective,
    TaInputDropdownComponent,
    CustomDatetimePickersComponent,
    CalendarDatesMainComponent,
    CalendarDaysComponent,
    CalendarLeftComponent,
    DateCalendarsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
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
    DragDropModule,
    ScrollingModule,
    NgxMaskModule.forRoot(),
    Ng5SliderModule,
    NgxDropzoneModule,
    CroppieModule,
    PdfViewerModule
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
    AgmCoreModule,
    NgbModule,
    GooglePlaceModule,
    SortPipe,
    StatusPipePipe,
    HighlightSearchPipe,
    NameInitialsPipe,
    HosTimePipe,
    CdkIdPipe,
    CdkConnectPipe,
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
    TooltipDirective,
    TaNoteContainerComponent,
    TaStatusSwitchComponent,
    TaStatusSelectComponent,
    TaSelectComponent,
    DeleteDialogComponent,
    DragDropModule,
    ScrollingModule,
    NgxMaskModule,
    Ng5SliderModule,
    NgxDropzoneModule,
    CroppieModule,
    DragDropFileDirective,
    TaCounterComponent,
    NgxSliderModule,
    TaNgxSliderComponent,
    TaLogoChangeComponent,
    TaFilesComponent,
    TaFileComponent,
    PdfViewerModule,
    TaInputComponent,
    SvgDefinitionsComponent,
    AccountManageComponent,
    TaModalComponent,
    AccountModalComponent,
    TaInputNoteComponent,
    TextareaAutosizeDirective,
    TaInputDropdownComponent,
    CustomDatetimePickersComponent,
    CalendarDatesMainComponent,
    CalendarDaysComponent,
    CalendarLeftComponent,
    DateCalendarsComponent
  ],
  providers: [DatePipe, SortPipe, NFormatterPipe, StatusPipePipe, CdkConnectPipe, CdkIdPipe, HighlightSearchPipe, HosTimePipe, NameInitialsPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
