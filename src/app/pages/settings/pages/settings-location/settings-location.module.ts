import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// routing
import { SettingsLocationRoutingModule } from '@pages/settings/pages/settings-location/settings-location-routing.module';

// pipes
import { ActiveItemsPipe } from '@shared/pipes/active-Items.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { SettingsRepairShopComponent } from '@pages/settings/pages/settings-location/components/settings-repair-shop/settings-repair-shop.component';
import { SettingsLocationComponent } from '@pages/settings/pages/settings-location/settings-location.component';
import { SettingsParkingComponent } from '@pages/settings/pages/settings-location/components/settings-parking/settings-parking.component';
import { SettingsOfficeComponent } from '@pages/settings/pages/settings-location/components/settings-office/settings-office.component';
import { SettingsTerminalComponent } from '@pages/settings/pages/settings-location/components/settings-terminal/settings-terminal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SettingsLocationRoutingModule,
        TaAppTooltipV2Component,
        NgbModule,
        TaCounterComponent,
        AngularSvgIconModule,
        TaModalComponent,
        TaTabSwitchComponent,
        ActiveItemsPipe,
        TaCommonCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaProgressExpirationComponent,
        TaPasswordAccountHiddenCharactersComponent,
        FormatDatePipe,
    ],
    declarations: [
        SettingsLocationComponent,
        SettingsParkingComponent,
        SettingsOfficeComponent,
        SettingsRepairShopComponent,
        SettingsTerminalComponent,
    ],
})
export class SettingsLocationModule {}
