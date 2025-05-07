import {
    ApplicationConfig,
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modules
import { SharedModule } from '@shared/shared.module';
import { ApiModule, Configuration } from 'appcoretruckassist';
import { ToastrModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Routing
import { AppRoutingModule } from '@app/app-routing.module';

// Components
import { AppComponent } from '@app/app.component';
import { NavigationComponent } from '@core/components/navigation/pages/navigation/navigation.component';
import { TaCustomToastMessagesComponent } from '@shared/components/ta-custom-toast-messages/ta-custom-toast-messages.component';
import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';
import { RightSidePanelComponent } from '@core/components/right-side-panel/components/right-side-panel/right-side-panel.component';
import { ReusableTemplatesComponent } from '@shared/components/reusable-templates/reusable-templates.component';

// Pipes
import { ChangeLogoPipe } from '@core/components/navigation/pipes/change-logo.pipe';
import { BlockedContentPipe } from '@core/pipes/blocked-content.pipe';

// Interceptors
import { AppInterceptor } from '@core/interceptors/app.inteceptor';
import { RefreshTokenInterceptor } from '@core/interceptors/refresh-token.interceptor';

// Config
import { configFactory } from '@core/configs/app.config';

// Services
import { WebsiteUserLoggedService } from '@pages/website/services/website-user-logged.service';
import { EncryptionDecryptionService } from '@shared/services/encryption-decryption.service';
import { StaticInjectorService } from '@core/decorators/titles.decorator';

// Lottie
import player from 'lottie-web';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';

import { provideLottieOptions } from 'ngx-lottie';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MilesEffects } from '@pages/miles/state/effects/miles.effect';
import { milesReducer } from '@pages/miles/state/reducers/miles.reducer';
import { UserEffects } from '@pages/new-user/state/effects/user.effect';
import { userReducer } from '@pages/new-user/state/reducers/user-reducer';

import { AccountEffect } from '@pages/new-account/state/effects/account.effect';
import { accountReducer } from '@pages/new-account/state/reducers/account.reducer';
// Load
// TODO: IT WILL BE RENAMED AND REMOVED ONCE WE HAVE NEW LOAD READY !!! DON'T COMMENT PR PLEASE :*
import { loadReducer } from '@pages/load/state/reducers/load.reducer';
import { LoadEffect } from '@pages/load/state/effects/load.effect';
import { loadReducer as NewLoadReducer } from '@pages/new-load/state/reducers/load.reducers';
import { LoadEffect as NewLoadEffect } from '@pages/new-load/state/effects/load.effects';

export const appConfig: ApplicationConfig = {
    providers: [
        provideLottieOptions({
            player: () => player,
        }),
    ],
};

@NgModule({
    declarations: [AppComponent, ChangeLogoPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        //BrowserTransferStateModule,
        BrowserAnimationsModule,
        SharedModule,
        // AgmCoreModule.forRoot({
        //     apiKey: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
        //     libraries: ['geometry', 'places'],
        // }),
        ToastrModule.forRoot({
            preventDuplicates: true,
            enableHtml: true,
            timeOut: 5000,
            toastComponent: TaCustomToastMessagesComponent, // added custom toast!
        }),
        NgIdleModule.forRoot(),
        AngularSvgIconPreloaderModule.forRoot({
            configUrl: 'assets/preload-svg/preload-svg.json',
        }),
        ApiModule,
        BlockedContentPipe,
        NavigationComponent,
        TaCustomScrollbarComponent,
        RightSidePanelComponent,
        ReactiveFormsModule.withConfig({
            warnOnNgModelWithFormControl: 'never',
        }),
        EffectsModule.forRoot([
            LoadEffect,
            MilesEffects,
            NewLoadEffect,
            UserEffects,
            AccountEffect,
        ]),
        StoreModule.forRoot({
            load: loadReducer,
            miles: milesReducer,
            newLoad: NewLoadReducer,
            user: userReducer,
            account: accountReducer,
        }),
        StoreDevtoolsModule.instrument({
            name: 'Carriera App',
        }),

        //components
        ReusableTemplatesComponent,
        // routing
        AppRoutingModule,
    ],
    providers: [
        {
            provide: Configuration,
            useFactory: (userLoggedService: WebsiteUserLoggedService) =>
                configFactory(userLoggedService),
            deps: [WebsiteUserLoggedService],
            multi: false,
        },
        [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: AppInterceptor,
                multi: true,
            },
            {
                provide: HTTP_INTERCEPTORS,
                useClass: RefreshTokenInterceptor,
                multi: true,
            },
        ],
        EncryptionDecryptionService,
        // GoogleMapsAPIWrapper,
        StaticInjectorService,
        DatePipe,
        CurrencyPipe,
        BlockedContentPipe,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class AppModule {}
