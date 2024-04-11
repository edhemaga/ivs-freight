// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DispatchRoutingModule } from './dispatch-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';

// Components
import { DispatchComponent } from './pages/dispatch/dispatch.component';
import { DispatchTableComponent } from './pages/dispatch/components/dispatch-table/dispatch-table.component';
import { TaAppTooltipV2Component } from 'src/app/shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputAddressDropdownComponent } from 'src/app/shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaStatusSwitchComponent } from 'src/app/shared/components/ta-status-switch/ta-status-switch.component';
import { TaGpsProgressbarComponent } from 'src/app/shared/components/ta-gps-progressbar/ta-gps-progressbar.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaPickupDeliveryComponent } from 'src/app/shared/components/ta-pickup-delivery/ta-pickup-delivery.component';

// Pipes
import { ColorFinderPipe } from './pipes/color-finder.pipe';
import { HosFilterPipe } from './pipes/hos-filter.pipe';
import { TooltipWidthPipe } from './pipes/tooltip-width.pipe';
import { CdkIdPipe } from 'src/app/pages/dispatch/pipes/cdk-id.pipe';
import { CdkConnectPipe } from 'src/app/pages/dispatch/pipes/cdk-connect.pipe';
import { HosTimePipe } from 'src/app/pages/dispatch/pipes/hos-time.pipe';

@NgModule({
    declarations: [
        // Components
        DispatchComponent,
        DispatchTableComponent,

        // Pipes
        ColorFinderPipe,
        HosFilterPipe,
        TooltipWidthPipe,
    ],
    imports: [
        // Modules
        AngularSvgIconModule,
        CommonModule,
        DispatchRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgbModule,

        // Pipes
        CdkIdPipe,
        CdkConnectPipe,
        HosTimePipe,

        // Components
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaInputDropdownComponent,
        TaInputAddressDropdownComponent,
        TaStatusSwitchComponent,
        TaGpsProgressbarComponent,
        TaNoteComponent,
        TaPickupDeliveryComponent,
    ],
})
export class DispatchModule {}
