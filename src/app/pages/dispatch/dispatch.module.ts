// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DispatchRoutingModule } from '@pages/dispatch/dispatch-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// Components
import { DispatchComponent } from '@pages/dispatch/pages/dispatch/dispatch.component';
import { DispatchTableComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/dispatch-table.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaStatusSwitchComponent } from '@shared/components/ta-status-switch/ta-status-switch.component';
import { TaGpsProgressbarComponent } from '@shared/components/ta-gps-progressbar/ta-gps-progressbar.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaPickupDeliveryComponent } from '@shared/components/ta-pickup-delivery/ta-pickup-delivery.component';
import { DispatchTableTruckTrailerComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-truck-trailer/dispatch-table-truck-trailer.component';
import { DispatchTableAddNewComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-add-new/dispatch-table-add-new.component';

// Pipes
import { ColorFinderPipe } from '@pages/dispatch/pipes/color-finder.pipe';
import { HosFilterPipe } from '@pages/dispatch/pipes/hos-filter.pipe';
import { TooltipWidthPipe } from '@pages/dispatch/pipes/tooltip-width.pipe';
import { CdkIdPipe } from '@pages/dispatch/pipes/cdk-id.pipe';
import { CdkConnectPipe } from '@pages/dispatch/pipes/cdk-connect.pipe';
import { HosTimePipe } from '@pages/dispatch/pipes/hos-time.pipe';

@NgModule({
    declarations: [
        // Components
        DispatchComponent,
        DispatchTableComponent,

        DispatchTableTruckTrailerComponent,
        DispatchTableAddNewComponent,

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
    exports: [ColorFinderPipe],
})
export class DispatchModule {}
