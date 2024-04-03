import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
    BrowserModule,
    BrowserTransferStateModule,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './core/components/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgIdleModule } from '@ng-idle/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
// ---- NAVIGATION
import { NavigationComponent } from './core/components/navigation/pages/navigation/navigation.component';
import { ChangeLogoPipe } from './core/components/navigation/pipes/change-logo.pipe';
import { ApiModule, Configuration } from 'appcoretruckassist';
import { WebsiteUserLoggedService } from './pages/website/services/website-user-logged.service';

import { CustomToastMessagesComponent } from './core/components/shared/custom-toast-messages/custom-toast-messages.component';
import { AppInterceptor } from './app.inteceptor';

import { EncryptionDecryptionService } from './core/services/encryption-decryption/EncryptionDecryption.service';

import { RefreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { configFactory } from './app.config';
import { StaticInjectorService } from './core/utils/application.decorators';
import { TaTooltipSlideComponent } from './shared/components/ta-tooltip-slide/ta-tooltip-slide.component';
import { BlockedContentPipe } from './core/pipes/blockedContent.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomScrollbarComponent } from './core/components/shared/custom-scrollbar/custom-scrollbar.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { StoreModule } from '@ngrx/store';
import { ArticleReducer } from './pages/dashboard/state/dashboard.reducer';

function playerFactory() {
    return player;
}

@NgModule({
    declarations: [AppComponent, ChangeLogoPipe],
    imports: [
        BrowserModule,
        CommonModule,
        BrowserTransferStateModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        TaTooltipSlideComponent,
        LottieModule.forRoot({ player: playerFactory }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
            libraries: ['geometry', 'places'],
        }),
        ToastrModule.forRoot({
            preventDuplicates: true,
            enableHtml: true,
            timeOut: 5000,
            toastComponent: CustomToastMessagesComponent, // added custom toast!
        }),
        NgIdleModule.forRoot(),
        ApiModule,
        BlockedContentPipe,
        NavigationComponent,
        CustomScrollbarComponent,
        ReactiveFormsModule.withConfig({
            warnOnNgModelWithFormControl: 'never',
        }),
        StoreModule.forRoot({
            course: ArticleReducer,
        }),
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
        GoogleMapsAPIWrapper,
        StaticInjectorService,
        DatePipe,
        CurrencyPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {}
