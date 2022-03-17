import { NavigationUserProfileComponent } from './core/components/navigation/navigation-user-profile/navigation-user-profile.component';
import { NavigationModalsComponent } from './core/components/navigation/navigation-modals/navigation-modals.component';
import { NavigationFooterComponent } from './core/components/navigation/navigation-footer/navigation-footer.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './core/shared/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgIdleModule } from '@ng-idle/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
// ---- NAVIGATION
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { NavigationRouteComponent } from './core/components/navigation/navigation-route/navigation-route.component';
import { ChangeLogoPipe } from './core/components/navigation/pipe/change-logo.pipe';
import { NavigationSubrouteComponent } from './core/components/navigation/navigation-subroute/navigation-subroute.component';
import { NavigationSubrouteCardComponent } from './core/components/navigation/navigation-subroute-card/navigation-subroute-card.component';
import { NavigationUserCompanyComponent } from './core/components/navigation/navigation-user-company/navigation-user-company.component';
import { NavigationHeaderComponent } from './core/components/navigation/navigation-header/navigation-header.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    NavigationRouteComponent,
    NavigationHeaderComponent,
    NavigationFooterComponent,
    ChangeLogoPipe,
    NavigationSubrouteComponent,
    NavigationSubrouteCardComponent,
    NavigationModalsComponent,
    NavigationUserProfileComponent,
    NavigationUserCompanyComponent,
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
    NgIdleModule.forRoot(),
  ],
  providers: [
    GoogleMapsAPIWrapper,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
