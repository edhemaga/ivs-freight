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
import { ActiveItemsPipe } from 'src/app/core/pipes/activeItems.pipe';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

// components
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
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
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SettingsLocationRoutes,
        AppTooltipComponent,
        NgbModule,
        TaCounterComponent,
        AngularSvgIconModule,
        TaModalComponent,
        TaTabSwitchComponent,
        ActiveItemsPipe,
        TaCommonCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TruckassistProgressExpirationComponent,
        formatDatePipe,
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
