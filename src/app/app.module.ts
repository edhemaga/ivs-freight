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
import { SharedModule } from './core/components/shared/shared.module';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule} from 'ngx-toastr';
import { NgIdleModule } from '@ng-idle/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
// ---- NAVIGATION
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { NavigationRouteComponent } from './core/components/navigation/navigation-route/navigation-route.component';
import { ChangeLogoPipe } from './core/components/navigation/pipe/change-logo.pipe';
import { NavigationSubrouteComponent } from './core/components/navigation/navigation-subroute/navigation-subroute.component';
import { NavigationSubrouteCardComponent } from './core/components/navigation/navigation-subroute-card/navigation-subroute-card.component';
import { NavigationUserCompanyComponent } from './core/components/navigation/navigation-user-company/navigation-user-company.component';
import { NavigationHeaderComponent } from './core/components/navigation/navigation-header/navigation-header.component';
import { ApiModule, Configuration } from 'appcoretruckassist';
import { environment } from 'src/environments/environment';
import { UserLoggedService } from './core/components/authentication/state/user-logged.service';

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
    ToastNoAnimationModule.forRoot({
      preventDuplicates: true,
      enableHtml: true,
      timeOut: 5000,
    }),
    NgIdleModule.forRoot(),
    ApiModule,
  ],
  providers: [
    GoogleMapsAPIWrapper,
    {
      provide: Configuration,
      useFactory: (userLoggedService: UserLoggedService) =>
        new Configuration({
          basePath: environment.API_ENDPOINT,
          credentials: {
            bearer: userLoggedService.getAccessToken.bind(userLoggedService),
          },
        }),
      deps: [UserLoggedService],
      multi: false,
    },
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
