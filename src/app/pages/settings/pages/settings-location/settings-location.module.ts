import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// routing
import { SettingsLocationRoutes } from './settings-location.routing';

// pipes
import { ActiveItemsPipe } from 'src/app/shared/pipes/active-Items.pipe';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

// components
import { TaAppTooltipV2Component } from 'src/app/shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { TaModalComponent } from 'src/app/shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { SettingsRepairShopComponent } from './components/settings-repair-shop/settings-repair-shop.component';
import { SettingsLocationComponent } from './settings-location.component';
import { SettingsParkingComponent } from './components/settings-parking/settings-parking.component';
import { SettingsOfficeComponent } from './components/settings-office/settings-office.component';
import { SettingsTerminalComponent } from './components/settings-terminal/settings-terminal.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaProgressExpirationComponent } from 'src/app/shared/components/ta-progress-expiration/ta-progress-expiration.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SettingsLocationRoutes,
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
