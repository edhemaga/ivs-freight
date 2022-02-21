import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "./core/shared/shared/shared.module";
import {ToastrModule} from "ngx-toastr";
import {NgIdleModule} from "@ng-idle/core";
import {HeaderComponent} from './core/components/header/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      enableHtml: true,
      timeOut: 5000,
    }),
    NgIdleModule.forRoot()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
