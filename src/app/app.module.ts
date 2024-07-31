import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApiModule, Configuration } from 'appcoretruckassist';
import { ToastrModule } from 'ngx-toastr';
import { LottieModule } from 'ngx-lottie';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// routing
import { AppRoutingModule } from '@app/app-routing.module';

// components
import { AppComponent } from '@app/app.component';
import { NavigationComponent } from '@core/components/navigation/pages/navigation/navigation.component';
import { TaCustomToastMessagesComponent } from '@shared/components/ta-custom-toast-messages/ta-custom-toast-messages.component';
import { TaTooltipSlideComponent } from '@shared/components/ta-tooltip-slide/ta-tooltip-slide.component';
import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';

// pipes
import { ChangeLogoPipe } from '@core/components/navigation/pipes/change-logo.pipe';
import { BlockedContentPipe } from '@core/pipes/blocked-content.pipe';

// interceptors
import { AppInterceptor } from '@core/interceptors/app.inteceptor';
import { RefreshTokenInterceptor } from '@core/interceptors/refresh-token.interceptor';

// config
import { configFactory } from '@core/configs/app.config';

// services
import { WebsiteUserLoggedService } from '@pages/website/services/website-user-logged.service';
import { EncryptionDecryptionService } from '@shared/services/encryption-decryption.service';
import { StaticInjectorService } from '@core/decorators/titles.decorator';

import { CaComponentsLibModule } from 'ca-components';

// lottie
import player from 'lottie-web';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';
function playerFactory() {
    return player;
}

@NgModule({
    declarations: [AppComponent, ChangeLogoPipe],
    imports: [
        BrowserModule,
        CommonModule,
        //BrowserTransferStateModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        TaTooltipSlideComponent,
        LottieModule.forRoot({ player: playerFactory }),
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
        ApiModule,
        BlockedContentPipe,
        NavigationComponent,
        TaCustomScrollbarComponent,
        ReactiveFormsModule.withConfig({
            warnOnNgModelWithFormControl: 'never',
        }),
        StoreModule.forRoot([]),
        EffectsModule.forRoot([]),

        // routing
        AppRoutingModule,
        CaComponentsLibModule,
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {}
