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
import {GoogleMapsAPIWrapper} from '@agm/core';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { NavigationRouteComponent } from './core/components/navigation/navigation-route/navigation-route.component';
import { NavigationHeaderComponent } from './core/components/navigation/navigation-header/navigation-header.component';
import { NavigationFooterComponent } from './core/components/navigation/navigation-footer/navigation-footer.component';
import { ChangeLogoPipe } from './core/components/navigation/pipe/change-logo.pipe';
import { NavigationSubrouteComponent } from './core/components/navigation/navigation-subroute/navigation-subroute.component';
import { NavigationSubrouteCardComponent } from './core/components/navigation/navigation-subroute-card/navigation-subroute-card.component';
import { NavigationModalsComponent } from './core/components/navigation/navigation-modals/navigation-modals.component';
import { NavigationUserProfileComponent } from './core/components/navigation/navigation-user-profile/navigation-user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    NavigationRouteComponent,
    NavigationHeaderComponent,
    NavigationFooterComponent,
    ChangeLogoPipe,
    NavigationSubrouteComponent,
    NavigationSubrouteCardComponent,
    NavigationModalsComponent,
    NavigationUserProfileComponent,
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
  providers: [
    GoogleMapsAPIWrapper
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
