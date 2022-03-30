import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from "../../directives/auto-focus.directive";
import { InputFocusDirective } from "../../directives/input-focus.directive";
import { InputRestrictionDirective } from "../../directives/input-restriction.directive";
import { InputErrorPipe } from "../../pipes/input-error.pipe";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from "angular-svg-icon";
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { SvgMorphComponent } from './svg-morph/svg-morph.component';
import { AgmCoreModule } from '@agm/core';
import { MapControlComponent } from './map-control/map-control.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DriverManageComponent } from "../../components/modals/driver-manage/driver-manage.component";
import { SortPipe } from "../../pipes/sort.pipe";
import { HistoryDataComponent } from "../../components/shared/history-data/history-data.component";
import { DatePickerModule } from "@progress/kendo-angular-dateinputs";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { TabSwitcherComponent } from "../../components/switchers/tab-switcher/tab-switcher.component";
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
import { TextFieldModule } from "@angular/cdk/text-field";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { StatusSwitcherComponent } from "../../components/switchers/status-switcher/status-switcher.component";
import { TruckManageComponent } from "../../components/modals/truck-manage/truck-manage.component";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TrailerManageComponent } from "../../components/modals/trailer-manage/trailer-manage.component";
import { TooltipDirective } from "../../directives/tooltip.directive";
import { NgxMaskModule } from "ngx-mask";
import { EditProfileComponent } from "../../components/modals/edit-profile/edit-profile.component";
import { NFormatterPipe } from '../../pipes/n-formatter.pipe';
import { TaNoteContainerComponent } from '../../components/shared/ta-note/ta-note-container/ta-note-container.component';
import { DeleteDialogComponent } from '../../components/shared/delete-dialog/delete-dialog.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { TaSelectComponent } from '../../components/shared/ta-select/ta-select.component';
import { TaStatusSelectComponent } from '../../components/shared/ta-status-select/ta-status-select.component';
import { TaStatusSwitchComponent } from '../../components/shared/ta-status-switch/ta-status-switch.component';
import { StatusPipePipe } from '../../pipes/status-pipe.pipe';
import { CdkConnectPipe } from '../../pipes/cdkconnect.pipe';
import { CdkIdPipe } from '../../pipes/cdkid.pipe';
import { HighlightSearchPipe } from '../../pipes/highlight-search.pipe';
import { HosTimePipe } from '../../pipes/hostime';
import { NameInitialsPipe } from '../../pipes/nameinitials';
import { Ng5SliderModule } from 'ng5-slider';
import {TodoManageComponent} from "../../components/modals/todo-manage/todo-manage.component";
import {BrokerManageComponent} from "../../components/modals/broker-manage/broker-manage.component";
import {ShipperManageComponent} from "../../components/modals/shipper-manage/shipper-manage.component";
import {RepairShopManageComponent} from "../../components/modals/repair-shop-manage/repair-shop-manage.component";
import {OwnerManageComponent} from "../../components/modals/owner-manage/owner-manage.component";
import {FuelManageComponent} from "../../components/modals/fuel-manage/fuel-manage.component";
import {ContactManageComponent} from "../../components/modals/contact-manage/contact-manage.component";
import {CompanyUserManageComponent} from "../../components/modals/company-user-manage/company-user-manage.component";
import {EditProfileImageComponent} from "../../components/shared/edit-profile-image/edit-profile-image.component";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CroppieModule } from 'angular-croppie-module';
import { DragDropFileDirective } from '../../directives/dragDropFile.directive';
import { TaCounterComponent } from '../../components/shared/ta-counter/ta-counter.component';
import { TaNgxSliderComponent } from '../../components/shared/ta-ngx-slider/ta-ngx-slider.component';
import { TaLogoChangeComponent } from '../../components/shared/ta-logo-change/ta-logo-change.component';
import { SvgIconNewComponent } from 'src/app/svg-definitions/svg-icon-new/svg-icon-new.component';
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
    SafeHtmlPipe,
    StatusPipePipe,
    HighlightSearchPipe,
    NameInitialsPipe,
    HosTimePipe,
    CdkIdPipe,
    CdkConnectPipe,
    HistoryDataComponent,
    TabSwitcherComponent,
    StatusSwitcherComponent,
    TruckManageComponent,
    NFormatterPipe,
    TooltipDirective,
    TrailerManageComponent,
    EditProfileComponent,
    TaNoteContainerComponent,
    TaStatusSwitchComponent,
    TaStatusSelectComponent,
    TaSelectComponent,
    DeleteDialogComponent,
    TodoManageComponent,
    BrokerManageComponent,
    ShipperManageComponent,
    RepairShopManageComponent,
    OwnerManageComponent,
    FuelManageComponent,
    ContactManageComponent,
    CompanyUserManageComponent,
    EditProfileImageComponent,
    EditProfileImageComponent,
    EditProfileImageComponent,
    DragDropFileDirective,
    TaCounterComponent,
    TaNgxSliderComponent,
    TaLogoChangeComponent,
    SvgIconNewComponent
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
    NgxMaskModule.forRoot(),
    Ng5SliderModule,
    NgxDropzoneModule,
    CroppieModule
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
    GooglePlaceModule,
    SortPipe,
    SafeHtmlPipe,
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
    NgxMaskModule,
    Ng5SliderModule,
    NgxDropzoneModule,
    CroppieModule,
    DragDropFileDirective,
    TaCounterComponent,
    NgxSliderModule,
    TaNgxSliderComponent,
    TaLogoChangeComponent,
    SvgIconNewComponent
  ],
  providers: [SortPipe, NFormatterPipe, SafeHtmlPipe, StatusPipePipe, CdkConnectPipe, CdkIdPipe, HighlightSearchPipe, HosTimePipe, NameInitialsPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
