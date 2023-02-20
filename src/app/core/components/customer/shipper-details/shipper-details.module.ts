import { ShipperCardViewComponent } from './../shipper-card-view/shipper-card-view.component';
import { ShipperDetailsComponent } from './shipper-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipperDetailsSingleComponent } from './shipper-details-single/shipper-details-single.component';
import { ShipperDetailsRoutes } from './shipper-details.routing';
import { SharedModule } from '../../shared/shared.module';
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from '../../shared/ta-details-header-card/ta-details-header-card.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { formatTimePipe } from '../../../pipes/formatTime.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaCommonHeaderComponent } from '../../shared/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';

@NgModule({
    declarations: [
        ShipperDetailsComponent,
        ShipperDetailsSingleComponent,
        ShipperCardViewComponent,
    ],
    exports: [ShipperCardViewComponent, SharedModule],
    imports: [
        CommonModule,
        ShipperDetailsRoutes,
        SharedModule,
        TaChartComponent,
        AppTooltipComponent,
        TaDetailsHeaderCardComponent,
        formatDatePipe,
        TaCopyComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        formatTimePipe,
        AngularSvgIconModule,
        TaCommonHeaderComponent,
        TaTabSwitchComponent
    ],
    providers: [formatDatePipe],
})
export class ShipperDetailsModule {}
