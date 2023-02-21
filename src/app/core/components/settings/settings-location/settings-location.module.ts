import { SettingsRepairShopComponent } from './settings-repair-shop/settings-repair-shop.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLocationComponent } from './settings-location.component';
import { SettingsLocationRoutes } from './settings-location.routing';
import { SettingsParkingComponent } from './settings-parking/settings-parking.component';
import { SettingsOfficeComponent } from './settings-office/settings-office.component';
import { SettingsTerminalComponent } from './settings-terminal/settings-terminal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaCounterComponent } from '../../shared/ta-counter/ta-counter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { ActiveItemsPipe } from 'src/app/core/pipes/activeItems.pipe';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaReCardComponent } from '../../shared/ta-common-card/ta-re-card.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SettingsLocationRoutes,
        AppTooltipComponent,
        TaCounterComponent,
        AngularSvgIconModule,
        TaModalComponent,
        TaTabSwitchComponent,
        ActiveItemsPipe,
        TaReCardComponent,
        TaCopyComponent,
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
